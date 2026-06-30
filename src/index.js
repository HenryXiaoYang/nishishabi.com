/**
 * 你是傻逼.com — 动态二级域名「奖状」Worker
 *
 * 任意 <名字>.你是傻逼.com 被访问时，从 hostname 解析出前缀名字，
 * 即时渲染一张中国小学生橙黄奖状风格的页面：「{名字}，你是傻逼！」
 * 纯动态、无存储。「创建」= 访客在首页输入一个新名字并跳转。
 */

const APEX_PUNY = "xn--6qqw6az48blo2b.com"; // 你是傻逼.com 的 punycode
const APEX_UNICODE = "你是傻逼.com";
const MAX_NAME_LEN = 63; // 单个 DNS label 上限

export default {
  fetch(request) {
    const url = new URL(request.url);

    // 噪音请求：favicon 等直接 204，避免被当成名字渲染
    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    // 优先用 Host 头判定请求的域名：
    // 生产环境（Worker 路由）下 url.hostname 即真实域名；
    // 但本地 wrangler dev 里 url.hostname 是 127.0.0.1，需回退到 Host 头。
    // 优先用 Host 头判定请求的域名：
    // 生产环境（Worker 路由）下 Host 头即真实域名。
    // 本地 wrangler dev (miniflare) 会把 Host 改写成 apex，
    // 但把原始域名放在 mf-original-hostname 头里，用它兜底以便本地测试。
    const hostname =
      request.headers.get("mf-original-hostname") ||
      request.headers.get("host") ||
      url.hostname;
    const name = getName(hostname);
    const html = name === null ? renderHome() : renderCert(name);

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
      },
    });
  },
};

/**
 * 从 hostname 解析出二级域名前缀。
 * apex / www / 解析失败 → 返回 null（渲染首页）。
 */
function getName(hostname) {
  let host = (hostname || "").toLowerCase().split(":")[0];

  // apex 本身 → 首页
  if (host === APEX_PUNY || host === APEX_UNICODE) return null;

  // 剥离 apex 后缀，拿到前缀部分
  let prefix = null;
  for (const apex of [APEX_PUNY, APEX_UNICODE]) {
    const suffix = "." + apex;
    if (host.endsWith(suffix)) {
      prefix = host.slice(0, -suffix.length);
      break;
    }
  }

  // 不属于本域（如本地 127.0.0.1、未知 host）→ 首页兜底
  if (prefix === null || prefix === "") return null;

  // 只取最左 label，忽略更深层级（a.b.你是傻逼.com → "a"）
  const label = prefix.split(".")[0];

  if (label === "www" || label.length === 0) return null;
  if (label.length > MAX_NAME_LEN) return null;

  return label;
}

/** HTML 转义，名字直接进页面必须做（防 XSS） */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 共用的奖状视觉外壳（背景渐变、左右橙条、顶部奖状字+徽章、花纹） */
function shell({ title, body, footer }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg1: #fbf7f0;        /* 奶油底 */
    --bg2: #f3ead9;        /* 浅杏 */
    --ink: #4a3f35;        /* 主文字 暖灰棕 */
    --ink-soft: #8a7d6e;   /* 次要文字 */
    --line: #e7dcc8;       /* 细描边 */
    --accent: #c8553d;     /* 柔和砖红（主强调） */
    --accent-deep: #a8412e;
    --gold: #c9a24b;       /* 柔和金 */
    --gold-soft: #e6d6ad;
    --card: #fffdf8;       /* 卡片底 近白 */
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    --serif: "Noto Serif SC", "Songti SC", "STSong", "SimSun", Georgia, serif;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    font-family: var(--sans);
    color: var(--ink);
    min-height: 100vh;
    /* 柔和奶油渐变 + 极淡暖光 */
    background:
      radial-gradient(120% 90% at 50% 0%, #fffdf9 0%, var(--bg1) 45%, var(--bg2) 100%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
  }
  .frame {
    position: relative;
    width: 100%; min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: clamp(28px, 4vh, 50px) clamp(20px, 5vw, 64px);
    gap: clamp(6px, 1.2vh, 12px);
  }
  /* 细金线内框，现代克制 */
  .frame::before {
    content: "";
    position: absolute; inset: clamp(12px, 2vw, 24px);
    border: 1px solid var(--gold-soft);
    border-radius: 18px;
    box-shadow: inset 0 0 0 6px rgba(255,255,255,.5), 0 1px 0 rgba(201,162,75,.15);
    pointer-events: none;
  }
  /* 顶部：恭喜 + 徽章 */
  .head { display: flex; align-items: center; gap: clamp(12px, 2.2vw, 22px); z-index: 1; }
  .jiang {
    font-family: var(--serif);
    font-weight: 600;
    font-size: clamp(24px, 4.8vw, 48px);
    letter-spacing: .22em;
    color: var(--accent);
    padding-left: .22em;
  }
  .badge { width: clamp(36px, 6vw, 60px); height: clamp(36px, 6vw, 60px); flex: none; }
  .flourish-top { width: clamp(120px, 22vw, 220px); opacity: .9; z-index: 1; }
  .flourish-bottom { width: clamp(140px, 26vw, 260px); opacity: .5; z-index: 1; margin-top: clamp(2px, 0.6vh, 6px); }
  .card {
    width: min(94%, 720px);
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 20px;
    padding: clamp(22px, 3.6vh, 42px) clamp(20px, 4.5vw, 56px);
    text-align: center;
    box-shadow: 0 12px 40px -18px rgba(74,63,53,.28), 0 2px 8px -4px rgba(74,63,53,.1);
    position: relative; z-index: 1;
  }
  .card .lead {
    font-size: clamp(12px, 2.2vw, 15px);
    letter-spacing: .42em; text-indent: .42em;
    color: var(--gold); font-weight: 600;
  }
  .name {
    display: block;
    font-family: var(--serif); font-weight: 700;
    font-size: clamp(32px, 7vw, 64px);
    line-height: 1.1;
    color: var(--ink);
    margin: clamp(10px, 1.8vh, 18px) 0;
    word-break: break-word;
  }
  .slogan {
    display: block;
    font-family: var(--serif); font-weight: 900;
    font-size: clamp(48px, 10vw, 96px);
    line-height: 1.1;
    color: var(--accent);
    margin: clamp(20px, 3vh, 36px) 0 clamp(10px, 1.6vh, 16px);
    letter-spacing: 0.08em;
  }
  .hint {
    font-size: clamp(13px, 2.2vw, 16px);
    color: var(--ink-soft);
    letter-spacing: .04em;
  }
  /* 细线 chevron 箭头，克制 */
  .arrow {
    width: 18px; height: 18px;
    margin: clamp(14px, 2vh, 22px) auto 0;
    border-right: 1.5px solid var(--gold);
    border-bottom: 1.5px solid var(--gold);
    transform: rotate(45deg);
    opacity: .55;
    animation: bob 1.8s ease-in-out infinite;
  }
  @keyframes bob { 0%,100% { transform: rotate(45deg) translate(0,0); } 50% { transform: rotate(45deg) translate(3px,3px); } }
  @media (prefers-reduced-motion: reduce) { .arrow { animation: none; } }
  .card p {
    font-size: clamp(14px, 2.4vw, 17px);
    line-height: 1.8; color: var(--ink-soft);
    margin-top: 8px; max-width: 30em; margin-left: auto; margin-right: auto;
  }
  .card b { color: var(--accent); font-weight: 600; }
  /* 落款 + 印章（并入卡片下沿对齐宽度） */
  .sign {
    width: min(94%, 720px);
    display: flex; justify-content: flex-end; align-items: center; gap: clamp(12px, 2vw, 18px);
    padding-right: clamp(4px, 2vw, 20px);
    position: relative; z-index: 1;
  }
  .sign .org { text-align: right; color: var(--ink-soft); font-size: clamp(11px, 1.9vw, 14px); line-height: 1.6; }
  .stamp {
    width: clamp(56px, 10vw, 76px); height: clamp(56px, 10vw, 76px);
    border: 1.5px solid var(--accent); border-radius: 50%;
    color: var(--accent); display: flex; align-items: center; justify-content: center; text-align: center;
    font-family: var(--serif); font-weight: 600;
    font-size: clamp(10px, 1.8vw, 13px); line-height: 1.3;
    transform: rotate(-8deg); opacity: .8;
    flex-shrink: 0;
  }
  /* 行动区：作为独立分组卡片，置于流末，不悬浮 */
  .actions {
    width: min(94%, 560px);
    display: flex; flex-direction: column; gap: 10px; align-items: center;
    position: relative; z-index: 1;
    margin-top: clamp(4px, 1vh, 10px);
    padding-top: clamp(14px, 2.4vh, 22px);
    border-top: 1px solid var(--line);
  }
  .tip { color: var(--ink-soft); font-size: clamp(12px, 2vw, 14px); }
  .row {
    display: flex; gap: 10px; width: 100%;
    background: #fff; border: 1px solid var(--line); border-radius: 16px;
    padding: 7px 7px 7px 8px;
    box-shadow: 0 6px 22px -12px rgba(74,63,53,.3);
    transition: border-color .2s, box-shadow .2s;
  }
  .row:focus-within { border-color: var(--gold); box-shadow: 0 8px 26px -12px rgba(201,162,75,.45); }
  .row input {
    flex: 1; min-width: 0;
    padding: 16px 18px; font-size: 17px;
    border: none; background: transparent; color: var(--ink);
    font-family: inherit;
  }
  .row input::placeholder { color: var(--ink-soft); }
  .row input:focus { outline: none; }
  .btn {
    padding: 0 clamp(20px, 4vw, 30px); font-size: 16px; white-space: nowrap;
    border: none; border-radius: 12px; cursor: pointer;
    background: var(--accent); color: #fff; font-weight: 600; font-family: inherit;
    transition: background .18s, transform .1s;
  }
  .btn:hover { background: var(--accent-deep); }
  .btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
  .btn:active { transform: scale(.97); }
  .btn.ghost {
    background: transparent; color: var(--accent);
    padding: 11px 18px; border: 1px solid var(--line); border-radius: 12px;
    font-size: 14px;
  }
  .btn.ghost:hover { background: #fbf3ee; border-color: var(--gold-soft); }
  .btn.ghost:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  .foot { color: var(--ink-soft); font-size: 12px; margin-top: 4px; opacity: .8; text-align: center; word-break: break-word; }
  @media (max-width: 600px) {
    .frame { padding: 32px 16px; }
    .frame::before { inset: 10px; border-radius: 14px; }
    .row { flex-direction: column; padding: 8px; }
    .row input { padding: 14px 16px; }
    .btn { padding: 15px; }
    .sign { justify-content: center; flex-wrap: wrap; }
    .sign .org { text-align: center; }
  }
  @media (max-height: 720px) and (min-width: 601px) {
    /* 矮屏：缩短纵向间距，避免内容被挤压 */
    .frame { justify-content: flex-start; }
  }
</style>
</head>
<body>
  <div class="frame">
    <div class="head">
      <span class="jiang">恭</span>
      ${BADGE_SVG}
      <span class="jiang">喜</span>
    </div>
    ${FLOURISH_TOP}
    ${title ? "" : ""}
    ${body}
    ${footer}
    ${FLOURISH_BOTTOM}
  </div>
  <script>
  (function () {
    function go(v) {
      var name = (v || "").trim().toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")   // 仅保留 DNS 合法字符
        .replace(/^-+|-+$/g, "")
        .slice(0, ${MAX_NAME_LEN});
      if (!name) { alert("请输入一个名字（字母/数字）"); return; }
      location.href = "https://" + name + ".${APEX_UNICODE}";
    }
    var inp = document.getElementById("nameInput");
    var btn = document.getElementById("goBtn");
    if (btn) btn.addEventListener("click", function () { go(inp.value); });
    if (inp) inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(inp.value); });
    var copy = document.getElementById("copyBtn");
    if (copy) copy.addEventListener("click", function () {
      navigator.clipboard && navigator.clipboard.writeText(location.href).then(function () {
        copy.textContent = "已复制 ✓";
        setTimeout(function () { copy.textContent = "复制本页链接"; }, 1500);
      });
    });
  })();
  </script>
</body>
</html>`;
}

/** 证书页：{name}，你是傻逼！ */
function renderCert(rawName) {
  const name = escapeHtml(rawName);
  const date = todayCN();
  const body = `
    <div class="card">
      <span class="name">${name}</span>
      <div class="slogan">你是傻逼！</div>
    </div>`;
  const footer = `
    <div class="sign">
      <div class="org">颁发单位：你是傻逼评审委员会<br>${date}</div>
      <div class="stamp">傻逼<br>认证<br>专用章</div>
    </div>
    <div class="actions">
      <div class="tip">觉得 TA 当之无愧？给别人也颁一张 👇</div>
      <div class="row">
        <input id="nameInput" type="text" placeholder="输入对方名字，如 Anthropic" autocomplete="off" spellcheck="false">
        <button id="goBtn" class="btn">颁奖 →</button>
      </div>
      <button id="copyBtn" class="btn ghost">复制本页链接</button>
    </div>`;
  return shell({ title: `${name}，你是傻逼！`, body, footer });
}

/** 首页：颁奖处 */
function renderHome() {
  const body = `
    <div class="card">
      <div class="slogan">谁是傻逼？</div>
      <p class="hint">输入名字，即刻为 TA 颁发认证</p>
      <div class="arrow" aria-hidden="true"></div>
    </div>`;
  const footer = `
    <div class="actions">
      <div class="row">
        <input id="nameInput" type="text" placeholder="如 Anthropic" autocomplete="off" spellcheck="false" autofocus>
        <button id="goBtn" class="btn">立即颁奖 →</button>
      </div>
      <div class="foot">颁奖后会跳转到 名字.你是傻逼.com</div>
    </div>`;
  return shell({ title: "你是傻逼.com · 在线颁奖", body, footer });
}

/** 当天日期（北京时间，中文） */
function todayCN() {
  const now = new Date(Date.now() + 8 * 3600 * 1000); // UTC+8
  return `${now.getUTCFullYear()} 年 ${now.getUTCMonth() + 1} 月 ${now.getUTCDate()} 日`;
}

/* ============ 内联 SVG 装饰（现代精致线条风） ============ */

// 精致徽章：细线金色花环 + 中央圆印
const BADGE_SVG = `<svg class="badge" viewBox="0 0 100 100" aria-hidden="true">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#f9f4ed"/>
      <stop offset="100%" stop-color="#e7dcc8"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="#c9a24b" stroke-width="1.2"/>
  <g fill="none" stroke="#c9a24b" stroke-width="1.6" stroke-linecap="round">
    ${Array.from({length:8}, (_,i) => {
      const a = (i*45 - 90) * Math.PI/180;
      const x1=50+Math.cos(a)*28, y1=50+Math.sin(a)*28;
      const x2=50+Math.cos(a)*38, y2=50+Math.sin(a)*38;
      return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} Q${(x1+x2)/2} ${((y1+y2)/2-3).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
    }).join('')}
  </g>
  <circle cx="50" cy="50" r="18" fill="none" stroke="#c8553d" stroke-width="1.4"/>
  <circle cx="50" cy="50" r="4" fill="#c8553d"/>
</svg>`;

// 顶部精致分隔线：细金线 + 中央装饰点
const FLOURISH_TOP = `<svg class="flourish-top" viewBox="0 0 260 24" aria-hidden="true">
  <line x1="0" y1="12" x2="110" y2="12" stroke="#c9a24b" stroke-width="1" opacity=".65"/>
  <line x1="150" y1="12" x2="260" y2="12" stroke="#c9a24b" stroke-width="1" opacity=".65"/>
  <circle cx="130" cy="12" r="3.5" fill="#c9a24b" opacity=".8"/>
  <circle cx="130" cy="12" r="1.2" fill="#c8553d"/>
</svg>`;

// 底部装饰：更简洁的细线卷草
const FLOURISH_BOTTOM = `<svg class="flourish-bottom" viewBox="0 0 300 20" aria-hidden="true">
  <path d="M0 10 Q 75 4, 150 10 T 300 10" fill="none" stroke="#c9a24b" stroke-width="1" opacity=".45"/>
</svg>`;
