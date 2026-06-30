# 你是傻逼.com — 在线奖状颁发机

一个 Cloudflare Worker：任何人访问 `<名字>.你是傻逼.com`，就会看到一张
中国小学生橙黄奖状风格的页面 —— **「{名字}，你是傻逼！」**，并能一键给下一个人「颁奖」。

- **纯动态、零存储**：没有数据库、没有注册接口。任意子域名访问即时生成。
- **「创建」= 输入名字**：首页/证书页底部的输入框会把名字拼成 `https://名字.你是傻逼.com` 并跳转。
- 名字做了 HTML 转义，防 XSS。

## 工作原理

```
samaltman.你是傻逼.com
        │  （Cloudflare 通配代理 DNS + 通配 Worker 路由）
        ▼
   一个 Worker  →  从 hostname 剥离出 "samaltman"  →  渲染奖状
```

> IDN 细节：`你是傻逼.com` 的 punycode 是 `xn--6qqw6az48blo2b.com`，
> 所以 Worker 实际收到的是 `samaltman.xn--6qqw6az48blo2b.com`。代码两种形式都兼容。

## 本地开发

```bash
npm install
npm run dev          # 默认 http://127.0.0.1:8787
```

用 `Host` 头模拟不同子域名：

```bash
# 证书页
curl -H "Host: samaltman.xn--6qqw6az48blo2b.com" http://127.0.0.1:8787/

# 首页（apex）
curl -H "Host: xn--6qqw6az48blo2b.com" http://127.0.0.1:8787/

# XSS 转义验证（应输出 &lt;script&gt; 而非真实标签）
curl -H "Host: <script>.xn--6qqw6az48blo2b.com" http://127.0.0.1:8787/
```

## 部署到 Cloudflare

### 前置：DNS 通配记录（在 CF 后台操作一次）

> 代理通配 DNS 现已对所有套餐开放，**无需企业版**。

1. 域名 `你是傻逼.com` 已托管在 Cloudflare（NS 已切换到 CF）。
2. 在 **DNS** 面板添加两条记录，**代理状态都设为「已代理」（橙云）**：

   | 类型 | 名称 | 内容 | 代理 |
   |------|------|----------|------|
   | AAAA | `*`  | `100::`  | 已代理 🟠 |
   | AAAA | `@`  | `100::`  | 已代理 🟠 |

   `100::` 是 IPv6 丢弃地址 —— 真实流量由 Worker 接管，origin 不会被访问。

### 部署 Worker

```bash
npm install
npx wrangler login
npm run deploy
```

`wrangler.jsonc` 里的 `routes` 会自动创建这两条路由：

```
*.你是傻逼.com/*
你是傻逼.com/*
```

### 验证

浏览器访问：

- https://你是傻逼.com — 首页（颁奖处）
- https://samaltman.你是傻逼.com — 证书页
- https://随便什么名字.你是傻逼.com — 任意名字即时生效

## 自定义

- 域名换了？改 `src/index.js` 顶部的 `APEX_PUNY` / `APEX_UNICODE`，
  以及 `wrangler.jsonc` 的 `routes` / `zone_name`。
  （punycode 可用 Node 计算：`node -e "console.log(new URL('http://你的域名').hostname)"`）
- 文案／配色都在 `src/index.js` 的 `renderCert` / `renderHome` / `shell` 里。

## 可选增强（当前未实现）

- **敏感词过滤**：在 `getName()` 加一个黑名单数组拦截。
- **名人墙 / 历史记录**：接入 Cloudflare KV，颁奖时写入、首页展示最近列表。
