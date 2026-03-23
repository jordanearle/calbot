export function getDashboardHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>calbot</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #f4f6f8;
      --card: #ffffff;
      --border: #e2e8f0;
      --input-border: #d1d5db;
      --text: #0f172a;
      --muted: #64748b;
      --muted-bg: #f8fafc;
      --primary: #006643;
      --primary-fg: #ffffff;
      --nav: rgb(21,41,81);
      --teal: #54BBB7;
      --orange: #F19800;
      --radius: 6px;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow: 0 4px 12px rgba(0,0,0,0.08);
      --shadow-lg: 0 8px 28px rgba(0,0,0,0.14);
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      font-size: 14px;
      line-height: 1.5;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes waddle { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }

    /* Nav */
    .nav {
      background: var(--nav);
      height: 52px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 10px;
      position: sticky;
      top: 0;
      z-index: 50;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .nav-logo { display: flex; align-items: center; gap: 8px; }
    .nav-logo svg { animation: waddle 3s ease-in-out infinite; transform-origin: bottom center; }
    .nav-wordmark { color: white; font-weight: 700; font-size: 15px; letter-spacing: -0.01em; }
    .nav-sep { width: 1px; height: 16px; background: rgba(255,255,255,0.15); margin: 0 2px; }
    .nav-sub { color: rgba(255,255,255,0.4); font-size: 12px; }
    .nav-spacer { flex: 1; }
    .nav-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--teal); animation: pulse 2.4s ease-in-out infinite; }

    /* Cal face helper */
    .cal-face { white-space: nowrap; }
    .cal-teal { color: var(--teal); }
    .cal-orange { color: var(--orange); }

    /* Cal greeting bar */
    .cal-bar {
      background: var(--nav);
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 8px 24px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cal-bar-text { color: rgba(255,255,255,0.65); font-size: 12px; }
    .cal-bar-text strong { color: var(--teal); font-weight: 500; }

    /* Layout */
    .main { max-width: 960px; margin: 0 auto; padding: 32px 24px 64px; }

    /* Page header */
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .page-title { font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
    .page-count { font-size: 12px; color: var(--muted); margin-top: 3px; }

    /* Buttons */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 0 14px; height: 36px;
      border-radius: var(--radius);
      font-size: 13px; font-weight: 500; font-family: inherit;
      cursor: pointer; border: none;
      transition: background 0.12s, box-shadow 0.12s;
      white-space: nowrap; text-decoration: none; line-height: 1;
    }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .btn-primary { background: var(--primary); color: var(--primary-fg); box-shadow: 0 1px 2px rgba(0,102,67,0.25); }
    .btn-primary:hover:not(:disabled) { background: #005438; }
    .btn-secondary { background: white; color: var(--text); border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
    .btn-secondary:hover:not(:disabled) { background: var(--muted-bg); border-color: #c2cad5; }

    .btn-icon {
      width: 30px; height: 30px; padding: 0;
      display: flex; align-items: center; justify-content: center;
      border-radius: var(--radius); background: transparent;
      color: var(--muted); border: none; cursor: pointer; flex-shrink: 0;
      transition: background 0.1s, color 0.1s;
    }
    .btn-icon:hover { background: var(--muted-bg); color: var(--text); }
    .btn-icon.open { background: var(--muted-bg); color: var(--text); }

    /* Table */
    .table-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .table-head {
      display: grid;
      grid-template-columns: minmax(0,1fr) 90px 108px 108px 38px;
      gap: 12px;
      padding: 9px 16px;
      border-bottom: 1px solid var(--border);
      background: var(--muted-bg);
    }
    .col-head { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .table-row {
      display: grid;
      grid-template-columns: minmax(0,1fr) 90px 108px 108px 38px;
      gap: 12px;
      padding: 11px 16px;
      align-items: center;
      border-bottom: 1px solid var(--border);
      transition: background 0.1s;
    }
    .table-row:last-child { border-bottom: none; }
    .table-row:hover { background: #fafbfc; }
    .table-row.is-creating { background: #fffef5; }

    .cell-name { display: flex; align-items: center; gap: 6px; min-width: 0; }
    .name-link {
      font-size: 13px; font-weight: 500; color: #0f766e;
      text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .name-link:hover { text-decoration: underline; }
    .name-text { font-size: 13px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ext-icon { flex-shrink: 0; color: #94a3b8; }

    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 2px 8px; border-radius: 999px;
      font-size: 11px; font-weight: 500; white-space: nowrap;
    }
    .badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
    .badge-running { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-running .badge-dot { background: #15803d; }
    .badge-stopped { background: #f8fafc; color: var(--muted); border: 1px solid var(--border); }
    .badge-stopped .badge-dot { background: #94a3b8; }
    .badge-creating { background: #fefce8; color: #854d0e; border: 1px solid #fde68a; }

    .cell-date { font-size: 12px; color: var(--muted); }

    /* Context menu */
    .ctx-menu {
      position: fixed;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      min-width: 168px;
      z-index: 200;
      overflow: hidden;
      animation: fadeIn 0.1s ease;
      display: none;
    }
    .ctx-item {
      display: flex; align-items: center; gap: 9px;
      padding: 8px 12px; font-size: 13px; color: var(--text);
      cursor: pointer; background: none; border: none;
      width: 100%; text-align: left; font-family: inherit;
      transition: background 0.08s;
    }
    .ctx-item:hover { background: var(--muted-bg); }
    .ctx-item.danger { color: #dc2626; }
    .ctx-item.danger:hover { background: #fef2f2; }
    .ctx-sep { height: 1px; background: var(--border); margin: 3px 0; }

    .spinner {
      display: inline-block; border-radius: 50%;
      border: 1.5px solid rgba(0,0,0,0.12);
      border-top-color: currentColor;
      animation: spin 0.65s linear infinite; flex-shrink: 0;
    }

    /* Empty state */
    .empty-state { padding: 52px 24px 48px; text-align: center; }
    .empty-bird {
      font-size: 44px; line-height: 1;
      margin-bottom: 12px;
      display: block;
      animation: waddle 3s ease-in-out infinite;
      transform-origin: bottom center;
    }
    .empty-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
    .empty-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
    .empty-chirp { font-size: 12px; color: var(--teal); margin-top: 8px; font-style: italic; }

    /* Modal */
    .modal-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(15,23,42,0.5);
      backdrop-filter: blur(3px);
      z-index: 100;
      align-items: center; justify-content: center;
    }
    .modal-overlay.open { display: flex; }
    .modal {
      background: white; border-radius: 10px;
      box-shadow: var(--shadow-lg), 0 0 0 1px rgba(0,0,0,0.04);
      width: 100%; max-width: 420px; margin: 20px;
      animation: slideUp 0.16s ease;
    }
    .modal-header { padding: 20px 20px 0; }
    .modal-cal { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .modal-cal-face { font-size: 18px; line-height: 1; }
    .modal-cal-msg { font-size: 13px; color: var(--muted); font-style: italic; }
    .modal-title { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
    .modal-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }
    .modal-body { padding: 16px 20px; }
    .modal-footer { padding: 16px 20px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 8px; }

    .form-label { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 6px; display: block; }
    .form-input {
      width: 100%; border: 1px solid var(--input-border); border-radius: var(--radius);
      padding: 8px 12px; font-size: 13px; font-family: inherit;
      color: var(--text); background: white; outline: none; height: 38px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(84,187,183,0.15); }
    .form-input::placeholder { color: #a0aab8; }
    .form-hint { font-size: 11px; color: var(--muted); margin-top: 5px; }
    .form-preview { font-size: 12px; color: var(--teal); margin-top: 6px; display: none; font-family: ui-monospace, monospace; }
    .form-preview.visible { display: block; }
    .form-preview-warn { color: #dc2626; font-family: inherit; font-size: 12px; margin-top: 6px; display: none; }
    .form-preview-warn.visible { display: block; }
    .form-error { font-size: 12px; color: #dc2626; margin-top: 6px; display: none; }
    .form-error.visible { display: block; }

    /* Progress steps */
    .progress-list { display: flex; flex-direction: column; }
    .progress-step {
      display: flex; align-items: center; gap: 12px;
      padding: 9px 0; border-bottom: 1px solid var(--border);
    }
    .progress-step:last-child { border-bottom: none; }
    .step-icon { width: 20px; height: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .step-label { font-size: 13px; }
    .step-label.step-pending { color: var(--muted); }
    .step-label.step-running { color: var(--text); font-weight: 500; }
    .step-label.step-done { color: var(--muted); }
    .cal-progress-msg {
      font-size: 12px; color: var(--teal); font-style: italic;
      margin-top: 14px; min-height: 18px;
      transition: opacity 0.3s;
    }

    /* Toast */
    .toast {
      position: fixed; bottom: 24px; right: 24px;
      background: var(--nav); color: white;
      padding: 10px 16px; border-radius: 8px;
      font-size: 13px; font-weight: 500;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      opacity: 0; transform: translateY(6px);
      transition: opacity 0.18s, transform 0.18s;
      z-index: 500; pointer-events: none; max-width: 340px;
    }
    .toast.visible { opacity: 1; transform: translateY(0); }
    .toast-face { color: var(--teal); }
    .toast-beak { color: var(--orange); }

    .footer {
      margin-top: 28px; text-align: center; font-size: 11px;
      color: var(--muted); opacity: 0.65;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
  </style>
</head>
<body>

<nav class="nav">
  <div class="nav-logo">
    <svg width="26" height="26" viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="13" fill="#54BBB7"/>
      <circle cx="11" cy="14" r="2" fill="white"/>
      <circle cx="19" cy="14" r="2" fill="white"/>
      <circle cx="11.6" cy="14.6" r="0.8" fill="#1a2b4a"/>
      <circle cx="19.6" cy="14.6" r="0.8" fill="#1a2b4a"/>
      <path d="M10.5 19.5 Q15 22 19.5 19.5" stroke="#F19800" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
    <span class="nav-wordmark">calbot</span>
  </div>
  <div class="nav-sep"></div>
  <span class="nav-sub">prototype control room</span>
  <div class="nav-spacer"></div>
  <div class="nav-pulse" title="Live"></div>
</nav>

<div class="cal-bar" id="cal-bar">
  <span class="cal-face"><span class="cal-teal">(•</span><span class="cal-orange">ᴗ</span><span class="cal-teal">•) cal&gt;</span></span>
  <span class="cal-bar-text" id="cal-greeting"></span>
</div>

<main class="main">
  <div class="page-header">
    <div>
      <div class="page-title">Prototypes</div>
      <div class="page-count" id="page-count">&nbsp;</div>
    </div>
    <button class="btn btn-primary" data-action="open-modal">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      New Prototype
    </button>
  </div>

  <div class="table-card">
    <div class="table-head">
      <div class="col-head">Name</div>
      <div class="col-head">Status</div>
      <div class="col-head">Created</div>
      <div class="col-head">Last edited</div>
      <div></div>
    </div>
    <div id="table-body">
      <div class="empty-state">
        <span class="empty-bird">🐦</span>
        <div class="empty-title">No prototypes yet!</div>
        <div class="empty-desc">Hit "New Prototype" to scaffold your first one.</div>
        <div class="empty-chirp">*chirp chirp*</div>
      </div>
    </div>
  </div>

  <div class="footer" id="footer"></div>
</main>

<div class="ctx-menu" id="ctx-menu"></div>

<div class="modal-overlay" id="modal-overlay">
  <div class="modal" id="modal"></div>
</div>

<div class="toast" id="toast"></div>

<script>
  var appState = { projects: [], pendingCreations: [], calbotDir: '' };
  var toastTimer = null;
  var activeMenuName = null;
  var modalPhase = 0;
  var creatingName = null;
  var progressTimer = null;

  // ── Cal's personality ─────────────────────────────────────────────────
  var CAL_MESSAGES = {
    greetings: [
      "Hey there, friend! Ready to build something cool?",
      "Oh hello! What are we shipping today?",
      "Chirp chirp! Let\u2019s make something awesome!",
      "Welcome back! The nest is looking good.",
      "*happy bird noises* \u2014 let\u2019s get building!",
      "Good to see you! Got some great prototypes ready.",
      "Ooh, a visitor! Let\u2019s build something people will love.",
      "Right then, let\u2019s make something brilliant.",
      "Back again! I\u2019ve kept everything warm for you.",
      "Hello hello! Ready to turn ideas into pixels?",
      "*flaps wings excitedly* You\u2019re here!",
      "Prototype o\u2019clock. Let\u2019s gooo.",
      "Another day, another banger prototype incoming.",
      "The gang\u2019s all here. Well, just us. But still!",
      "I\u2019ve been practicing my design feedback while you were gone.",
      "You know what time it is? Shipping time.",
    ],
    morning: [
      "Good morning! Coffee in hand? Let\u2019s build.",
      "Early bird gets the prototype shipped! \uD83C\uDF05",
      "Morning! Best ideas happen before lunch, let\u2019s capture them.",
      "Rise and prototype! The day is young.",
      "Good morning! I\u2019ve been here all night. Just kidding. Maybe.",
    ],
    afternoon: [
      "Good afternoon! Prime prototyping hours right now.",
      "Post-lunch energy \u2014 let\u2019s use it wisely.",
      "Afternoon! Nothing beats building something real.",
      "The afternoon slump is a myth. Build something instead.",
    ],
    evening: [
      "Evening session! Some of the best work happens now.",
      "The office is quiet. Perfect for shipping something cool.",
      "Evening! The best ideas always come after 5pm.",
      "*lights lamp* Let\u2019s build something by nightfall.",
    ],
    latenight: [
      "Burning the midnight oil? *respects the dedication*",
      "Still here? Legendary. Let\u2019s make it worth it.",
      "Late night builds hit different. Let\u2019s go.",
      "The secret to great prototypes: build them when everyone else is asleep.",
      "Night owl mode: activated. What are we building?",
    ],
    monday: [
      "Monday! Turn those meeting ideas into something real.",
      "New week, new prototype. Let\u2019s make it count.",
      "Monday energy! The best antidote is shipping something.",
    ],
    friday: [
      "Friday! Ship something before the weekend. I believe in you.",
      "TGIF \u2014 The Greatness Is Forthcoming (in prototype form).",
      "Friday build! Weekend bragging rights await.",
      "End the week with a banger. You\u2019ve got this.",
    ],
    loading: [
      "Gathering twigs for your nest...",
      "Doing some bird calculations...",
      "Flapping my wings extra hard...",
      "Fetching the good stuff...",
      "Building your nest, one twig at a time...",
      "Almost there, just preening my feathers...",
      "npm is doing its thing... *taps foot*",
      "Installing the good stuff \u2014 this is the exciting part!",
      "Wiring up all the components...",
      "Making it go fast...",
      "Teaching it the Birdie way...",
      "*intense concentration noises*",
    ],
    success: [
      "Nailed it! *happy dance*",
      "We did it! Time for a victory chirp!",
      "Boom! That\u2019s what I\u2019m talking about!",
      "Success! *does little wing flap*",
      "LETS GOOOO! \uD83C\uDF89",
      "Look at you, shipping things!",
      "Another one for the nest!",
      "Clean. Crisp. Delivered. *chef\u2019s kiss*",
      "That\u2019s a wrap! Or rather, a launch.",
      "*victory screech* (it\u2019s a bird thing)",
    ],
    waiting: [
      "Good things come to those who wait...",
      "Patience, young padawan...",
      "Building your nest, one twig at a time...",
      "The best prototypes take a little time...",
      "Worth the wait, I promise.",
      "This is the part where we trust the process.",
      "npm install is basically meditation at this point.",
    ],
    duplicate: [
      "Cloning the DNA...",
      "Forking the nest!",
      "Making a twin...",
      "Copy... paste... but make it elegant.",
    ],
    delete: [
      "Back to the void it goes.",
      "Tidying the nest.",
      "Gone but not forgotten.",
    ],
  };

  // ── Rare messages (1 in 15 chance on load) ───────────────────────────
  var CAL_RARE = [
    "psst\u2026 did you know you can duplicate prototypes? \uD83E\uDD2B",
    "fun fact: cal stands for nothing. it\u2019s just a name. or is it?",
    "I once calculated the perfect border-radius. It\u2019s 6px.",
    "between us: I think in components.",
    "I\u2019ve read every shadcn doc. Twice.",
    "no thoughts, just tailwind classes.",
    "*quietly judges your colour choices* just kidding. mostly.",
    "the best prototype is the one you actually ship.",
    "have you tried turning it off and on again? (the prototype, not me)",
  ];

  function randMsg(category) {
    var msgs = CAL_MESSAGES[category];
    if (!msgs || !msgs.length) return '';
    return msgs[Math.floor(Math.random() * msgs.length)];
  }

  // Time + day aware greeting
  function getGreeting() {
    if (Math.random() < 0.07) return CAL_RARE[Math.floor(Math.random() * CAL_RARE.length)];
    var h = new Date().getHours();
    var d = new Date().getDay();
    if (d === 1) return randMsg('monday');
    if (d === 5) return randMsg('friday');
    if (h >= 0  && h < 5)  return randMsg('latenight');
    if (h >= 5  && h < 12) return randMsg('morning');
    if (h >= 12 && h < 17) return randMsg('afternoon');
    if (h >= 17 && h < 21) return randMsg('evening');
    return randMsg('latenight');
  }

  // Pick a stable greeting per session (not per render)
  var SESSION_GREETING = getGreeting();

  // ── Name sanitisation (mirrors server-side toNpmSafeName) ────────────
  function toSafeName(s) {
    return s
      .toLowerCase()
      .replace(/\\s+/g, '-')
      .replace(/[^a-z0-9-_.]/g, '')
      .replace(/^[-_.]+/, '')
      .replace(/[-_.]+$/, '')
      .replace(/-+/g, '-');
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function timeAgo(d) {
    if (!d) return '\u2014';
    var s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return Math.floor(s/60) + 'm ago';
    if (s < 86400) return Math.floor(s/3600) + 'h ago';
    if (s < 604800) return Math.floor(s/86400) + 'd ago';
    return new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'short' });
  }

  function calFaceHtml(beak) {
    beak = beak || '\u1d17';
    return '<span class="cal-teal">(\u2022</span><span class="cal-orange">' + beak + '</span><span class="cal-teal">\u2022)</span>';
  }

  function showToast(msg, ms) {
    var el = document.getElementById('toast');
    el.innerHTML = '<span class="toast-face">(<span class="toast-beak">\u1d17</span></span><span class="toast-face">\u2022)</span> ' + esc(msg);
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ el.classList.remove('visible'); }, ms || 3000);
  }

  // ── SVG icons ─────────────────────────────────────────────────────────
  var SVG = {
    play:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
    stop:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
    copy:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    open:    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    extLink: '<svg class="ext-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    more:    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    editor:  '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    trash:   '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    check:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    circle:  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
    xCircle: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  };
  function spinSvg(color) {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + (color||'#54BBB7') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 0.7s linear infinite;display:block"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
  }

  // ── Table ─────────────────────────────────────────────────────────────
  function buildRow(p) {
    var n = esc(p.name);
    var nameCell = p.running && p.port
      ? '<div class="cell-name"><a class="name-link" href="http://localhost:' + p.port + '" target="_blank" rel="noopener">' + n + '</a>' + SVG.extLink + '</div>'
      : '<div class="cell-name"><span class="name-text">' + n + '</span></div>';

    var badge = p.creating
      ? '<span class="badge badge-creating"><span class="spinner" style="width:9px;height:9px;border-color:rgba(133,77,14,0.2);border-top-color:#854d0e"></span>&nbsp;Creating</span>'
      : p.running
        ? '<span class="badge badge-running"><span class="badge-dot"></span>Running</span>'
        : '<span class="badge badge-stopped"><span class="badge-dot"></span>Stopped</span>';

    var menuCell = p.creating
      ? '<div style="width:30px"></div>'
      : '<button class="btn-icon" data-action="menu" data-name="' + n + '" id="mbtn-' + n + '">' + SVG.more + '</button>';

    var cls = 'table-row' + (p.creating ? ' is-creating' : '');
    return '<div class="' + cls + '" id="row-' + n + '">' +
      nameCell + badge +
      '<div class="cell-date">' + timeAgo(p.createdAt) + '</div>' +
      '<div class="cell-date">' + (p.creating ? '\u2014' : timeAgo(p.lastModified)) + '</div>' +
      menuCell + '</div>';
  }

  function render() {
    var all = [];
    appState.pendingCreations.forEach(function(p) {
      all.push({ name: p.name, createdAt: p.startedAt, lastModified: null, running: false, creating: true });
    });
    appState.projects.forEach(function(p) { all.push(p); });

    document.getElementById('page-count').textContent = all.length + ' prototype' + (all.length === 1 ? '' : 's');

    var tbody = document.getElementById('table-body');
    if (all.length === 0) {
      tbody.innerHTML =
        '<div class="empty-state">' +
          '<span class="empty-bird">\uD83D\uDC26</span>' +
          '<div class="empty-title">No prototypes yet!</div>' +
          '<div class="empty-desc">Hit \u201cNew Prototype\u201d to scaffold your first one.</div>' +
          '<div class="empty-chirp">*chirp chirp*</div>' +
        '</div>';
    } else {
      var html = '';
      all.forEach(function(p) { html += buildRow(p); });
      tbody.innerHTML = html;
    }

    var footer = document.getElementById('footer');
    if (appState.calbotDir) {
      footer.innerHTML = calFaceHtml('.') + ' <span>' + esc(appState.calbotDir) + '</span>';
    }
  }

  // ── State ─────────────────────────────────────────────────────────────
  function fetchState() {
    fetch('/api/state')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) console.error('[calbot]', data.error);
        appState = data;
        render();
      })
      .catch(function(e) { console.error('[calbot] fetch failed', e); });
  }

  // ── Context menu ──────────────────────────────────────────────────────
  function openCtxMenu(name, anchor) {
    activeMenuName = name;
    var p = appState.projects.find(function(x) { return x.name === name; });
    if (!p) return;

    var html = '';
    if (p.running && p.port) {
      html += '<button class="ctx-item" data-action="open" data-name="' + esc(name) + '">' + SVG.open + ' Open in browser</button>';
      html += '<div class="ctx-sep"></div>';
      html += '<button class="ctx-item danger" data-action="stop" data-name="' + esc(name) + '">' + SVG.stop + ' Stop server</button>';
    } else {
      html += '<button class="ctx-item" data-action="start" data-name="' + esc(name) + '">' + SVG.play + ' Start server</button>';
    }
    html += '<div class="ctx-sep"></div>';
    html += '<button class="ctx-item" data-action="duplicate" data-name="' + esc(name) + '">' + SVG.copy + ' Duplicate</button>';
    html += '<button class="ctx-item" data-action="open-editor" data-name="' + esc(name) + '">' + SVG.editor + ' Open in editor</button>';
    html += '<div class="ctx-sep"></div>';
    html += '<button class="ctx-item danger" data-action="delete" data-name="' + esc(name) + '">' + SVG.trash + ' Delete</button>';

    var menu = document.getElementById('ctx-menu');
    menu.innerHTML = html;
    menu.style.display = 'block';
    var r = anchor.getBoundingClientRect();
    menu.style.top = (r.bottom + 4) + 'px';
    menu.style.right = (window.innerWidth - r.right) + 'px';
    menu.style.left = 'auto';
    anchor.classList.add('open');
  }

  function closeCtxMenu() {
    if (activeMenuName) {
      var btn = document.getElementById('mbtn-' + esc(activeMenuName));
      if (btn) btn.classList.remove('open');
      activeMenuName = null;
    }
    var menu = document.getElementById('ctx-menu');
    menu.style.display = 'none';
    menu.innerHTML = '';
  }

  // ── Modal ─────────────────────────────────────────────────────────────
  var STEPS = [
    'Creating Next.js app',
    'Installing UI components',
    'Applying Birdie design system',
    'Building layout',
    'Final install',
    'Starting dev server'
  ];

  // Cal quips per step (shown while that step runs)
  var STEP_QUIPS = [
    'Laying the foundation egg...',
    'Gathering the finest twigs...',
    'Painting the nest in Birdie colours...',
    'Arranging the furniture...',
    'Tying all the loose feathers together...',
    'Hatching something beautiful...',
  ];

  function openModal() {
    modalPhase = 1;
    renderModal();
    document.getElementById('modal-overlay').classList.add('open');
    setTimeout(function() {
      var inp = document.getElementById('modal-name');
      if (!inp) return;
      inp.focus();
      inp.addEventListener('input', function() {
        var raw = inp.value;
        var safe = toSafeName(raw.trim());
        var preview = document.getElementById('modal-preview');
        var warn = document.getElementById('modal-preview-warn');
        if (!preview || !warn) return;
        if (!raw.trim()) {
          preview.classList.remove('visible');
          warn.classList.remove('visible');
        } else if (!safe) {
          preview.classList.remove('visible');
          warn.textContent = 'That name won\u2019t work \u2014 try using letters and hyphens.';
          warn.classList.add('visible');
        } else if (safe !== raw.trim()) {
          preview.textContent = '\u2192 will be created as: ' + safe;
          preview.classList.add('visible');
          warn.classList.remove('visible');
        } else {
          preview.classList.remove('visible');
          warn.classList.remove('visible');
        }
      });
    }, 60);
  }

  function closeModal() {
    clearInterval(progressTimer);
    modalPhase = 0;
    creatingName = null;
    document.getElementById('modal-overlay').classList.remove('open');
  }

  function renderModal() {
    var modal = document.getElementById('modal');
    if (modalPhase === 1) {
      modal.innerHTML =
        '<div class="modal-header">' +
          '<div class="modal-cal">' +
            '<span class="modal-cal-face">' + calFaceHtml() + '</span>' +
            '<span class="modal-cal-msg">Let&apos;s build something awesome!</span>' +
          '</div>' +
          '<div class="modal-title">New Prototype</div>' +
          '<div class="modal-desc">Scaffold a new Next.js app with the Birdie design system.</div>' +
        '</div>' +
        '<div class="modal-body">' +
          '<label class="form-label" for="modal-name">Name</label>' +
          '<input type="text" id="modal-name" class="form-input" placeholder="e.g. Onboarding v2" autocomplete="off" spellcheck="false" />' +
          '<div class="form-hint">Letters, numbers, spaces \u2014 we&apos;ll handle the rest.</div>' +
          '<div class="form-preview" id="modal-preview"></div>' +
          '<div class="form-preview-warn" id="modal-preview-warn"></div>' +
          '<div class="form-error" id="modal-error"></div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-secondary" data-action="close-modal">Cancel</button>' +
          '<button class="btn btn-primary" id="modal-submit" data-action="submit-modal">Create prototype</button>' +
        '</div>';
    } else if (modalPhase === 2) {
      var stepsHtml = '';
      STEPS.forEach(function(label, i) {
        stepsHtml +=
          '<div class="progress-step" id="ps-' + i + '">' +
            '<div class="step-icon">' + (i === 0 ? spinSvg() : SVG.circle) + '</div>' +
            '<div class="step-label ' + (i === 0 ? 'step-running' : 'step-pending') + '">' + esc(label) + '</div>' +
          '</div>';
      });
      modal.innerHTML =
        '<div class="modal-header">' +
          '<div class="modal-cal">' +
            '<span class="modal-cal-face">' + calFaceHtml('.') + '</span>' +
            '<span class="modal-cal-msg" id="cal-quip">' + STEP_QUIPS[0] + '</span>' +
          '</div>' +
          '<div class="modal-title">Creating ' + esc(creatingName || 'prototype') + '</div>' +
          '<div class="modal-desc">Takes 2\u20133 minutes. You can close this \u2014 it keeps going.</div>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="progress-list">' + stepsHtml + '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
          '<button class="btn btn-secondary" data-action="close-modal">Run in background</button>' +
        '</div>';
    }
  }

  function submitModal() {
    var inp = document.getElementById('modal-name');
    var name = toSafeName(inp ? inp.value.trim() : '');
    var errEl = document.getElementById('modal-error');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
    if (!name) {
      if (errEl) { errEl.textContent = 'Please enter a name \u2014 letters and hyphens work best.'; errEl.classList.add('visible'); }
      return;
    }
    var btn = document.getElementById('modal-submit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" style="width:12px;height:12px;border-color:rgba(255,255,255,0.3);border-top-color:white"></span> Creating...';
    }
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) {
          if (errEl) { errEl.textContent = data.error; errEl.classList.add('visible'); }
          if (btn) { btn.disabled = false; btn.innerHTML = 'Create prototype'; }
          return;
        }
        creatingName = data.name;
        modalPhase = 2;
        renderModal();
        startProgressPoll();
        fetchState();
      })
      .catch(function() {
        if (errEl) { errEl.textContent = 'Something went wrong. Try again.'; errEl.classList.add('visible'); }
        if (btn) { btn.disabled = false; btn.innerHTML = 'Create prototype'; }
      });
  }

  function startProgressPoll() {
    clearInterval(progressTimer);
    progressTimer = setInterval(function() {
      if (!creatingName) { clearInterval(progressTimer); return; }
      fetch('/api/progress/' + encodeURIComponent(creatingName))
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (modalPhase === 2) applyProgressSteps(data);
          if (data.done || data.error) {
            clearInterval(progressTimer);
            fetchState();
            if (modalPhase === 2) finishProgressModal(data.error || null);
          }
        })
        .catch(function() {});
    }, 600);
  }

  function applyProgressSteps(progress) {
    if (!progress || !progress.steps) return;
    var runningIdx = -1;
    progress.steps.forEach(function(step, i) {
      var el = document.getElementById('ps-' + i);
      if (!el) return;
      var iconEl = el.querySelector('.step-icon');
      var labelEl = el.querySelector('.step-label');
      if (step.status === 'done') {
        iconEl.innerHTML = SVG.check;
        labelEl.className = 'step-label step-done';
      } else if (step.status === 'running') {
        iconEl.innerHTML = spinSvg('#54BBB7');
        labelEl.className = 'step-label step-running';
        runningIdx = i;
      } else {
        iconEl.innerHTML = SVG.circle;
        labelEl.className = 'step-label step-pending';
      }
    });
    // Update cal quip for current step
    if (runningIdx >= 0) {
      var quipEl = document.getElementById('cal-quip');
      if (quipEl) quipEl.textContent = STEP_QUIPS[runningIdx] || randMsg('loading');
    }
  }

  function finishProgressModal(error) {
    var title = document.querySelector('#modal .modal-title');
    var quip = document.getElementById('cal-quip');
    var footer = document.querySelector('#modal .modal-footer');
    if (error) {
      if (title) title.textContent = 'Uh oh, something went wrong!';
      if (quip) quip.textContent = "Hmm, that didn't go as planned... " + error;
      if (footer) footer.innerHTML = '<button class="btn btn-secondary" data-action="close-modal">Close</button>';
    } else {
      if (title) title.textContent = 'Prototype ready! \uD83C\uDF89';
      if (quip) quip.textContent = randMsg('success');
      if (footer) footer.innerHTML = '<button class="btn btn-secondary" data-action="close-modal">Close</button>';
    }
  }

  // ── Project actions ───────────────────────────────────────────────────
  function startProject(name) {
    showToast('Starting ' + name + '... ' + randMsg('waiting'));
    fetch('/api/projects/' + encodeURIComponent(name) + '/start', { method: 'POST' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { showToast('Error: ' + data.error); fetchState(); return; }
        showToast(name + ' is live on :' + data.port + ' \u2014 go build something!', 5000);
        var n = 0;
        var poll = setInterval(function() { fetchState(); if (++n > 10) clearInterval(poll); }, 2000);
      })
      .catch(function() { showToast('Failed to start ' + name); fetchState(); });
  }

  function stopProject(name) {
    fetch('/api/projects/' + encodeURIComponent(name) + '/stop', { method: 'POST' })
      .then(function() { showToast(name + ' stopped. Time for a rest!'); fetchState(); })
      .catch(function() { showToast('Failed to stop ' + name); });
  }

  function duplicateProject(name) {
    showToast('Duplicating ' + name + '... ' + randMsg('duplicate'), 2500);
    fetch('/api/projects/' + encodeURIComponent(name) + '/duplicate', { method: 'POST' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { showToast('Error: ' + data.error); return; }
        showToast('Created ' + data.name + ' \u2014 ' + randMsg('success'), 4000);
        fetchState();
      })
      .catch(function() { showToast('Failed to duplicate ' + name); });
  }

  function openProject(name) {
    var p = appState.projects.find(function(x) { return x.name === name; });
    if (p && p.running && p.port) window.open('http://localhost:' + p.port, '_blank');
  }

  function openEditor(name) {
    fetch('/api/projects/' + encodeURIComponent(name) + '/open-editor', { method: 'POST' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { showToast(data.error); return; }
        showToast('Opened ' + name + ' in ' + data.editor + '. Happy coding!', 4000);
      })
      .catch(function() { showToast('Could not open editor.'); });
  }

  function deleteProject(name) {
    if (!window.confirm('Delete "' + name + '"? This cannot be undone.')) return;
    fetch('/api/projects/' + encodeURIComponent(name), { method: 'DELETE' })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { showToast('Error: ' + data.error); return; }
        showToast(name + ' deleted. ' + randMsg('delete'));
        fetchState();
      })
      .catch(function() { showToast('Failed to delete ' + name); });
  }

  // ── Events ────────────────────────────────────────────────────────────
  document.addEventListener('click', function(e) {
    var menu = document.getElementById('ctx-menu');
    if (activeMenuName && menu && !menu.contains(e.target) && !e.target.closest('[data-action="menu"]')) {
      closeCtxMenu();
    }
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.dataset.action;
    var name = el.dataset.name;
    if (action === 'open-modal')   { openModal(); }
    else if (action === 'close-modal')  { closeModal(); }
    else if (action === 'submit-modal') { submitModal(); }
    else if (action === 'menu') {
      e.stopPropagation();
      if (activeMenuName === name) { closeCtxMenu(); return; }
      closeCtxMenu(); openCtxMenu(name, el);
    }
    else if (action === 'open')        { closeCtxMenu(); openProject(name); }
    else if (action === 'start')       { closeCtxMenu(); startProject(name); }
    else if (action === 'stop')        { closeCtxMenu(); stopProject(name); }
    else if (action === 'duplicate')   { closeCtxMenu(); duplicateProject(name); }
    else if (action === 'open-editor') { closeCtxMenu(); openEditor(name); }
    else if (action === 'delete')      { closeCtxMenu(); deleteProject(name); }
  });

  document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this && modalPhase === 1) closeModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeCtxMenu(); if (modalPhase === 1) closeModal(); }
    if (e.key === 'Enter' && modalPhase === 1 && document.activeElement && document.activeElement.id === 'modal-name') {
      submitModal();
    }
  });

  // ── Easter eggs ───────────────────────────────────────────────────────

  // Click the logo 5 times for a secret reaction
  var logoClicks = 0;
  var logoClickTimer = null;
  var logoSecrets = [
    "*moonwalks out of frame*",
    "ow. that\u2019s my beak.",
    "okay okay I\u2019ll do a trick. ...nope.",
    "you found the secret! there is no secret. this IS the secret.",
    "stop poking me I\u2019m trying to work",
    "*dramatically faints*",
    "I\u2019m not a button. I mean I am. But still.",
    "beep boop. just kidding I\u2019m a bird.",
    "FIVE TAPS. you have too much free time. I respect it.",
  ];
  document.querySelector('.nav-logo').addEventListener('click', function() {
    logoClicks++;
    clearTimeout(logoClickTimer);
    logoClickTimer = setTimeout(function() { logoClicks = 0; }, 1200);
    if (logoClicks >= 5) {
      logoClicks = 0;
      var msg = logoSecrets[Math.floor(Math.random() * logoSecrets.length)];
      var el = document.getElementById('cal-greeting');
      var prev = el.innerHTML;
      el.style.transition = 'opacity 0.2s';
      el.style.opacity = '0';
      setTimeout(function() {
        el.innerHTML = msg;
        el.style.opacity = '1';
        setTimeout(function() {
          el.style.opacity = '0';
          setTimeout(function() { el.innerHTML = prev; el.style.opacity = '1'; }, 200);
        }, 2800);
      }, 200);
    }
  });

  // Konami code: ↑↑↓↓←→←→BA
  var konamiSeq = [38,38,40,40,37,39,37,39,66,65];
  var konamiPos = 0;
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiSeq[konamiPos]) {
      konamiPos++;
      if (konamiPos === konamiSeq.length) {
        konamiPos = 0;
        triggerPartyMode();
      }
    } else {
      konamiPos = e.keyCode === konamiSeq[0] ? 1 : 0;
    }
  });

  function triggerPartyMode() {
    var el = document.getElementById('cal-greeting');
    var bar = document.getElementById('cal-bar');
    var prev = el.innerHTML;
    var prevBg = bar.style.background;
    var msgs = [
      "\uD83C\uDF89 PARTY MODE ACTIVATED \uD83C\uDF89 you found the konami code!!",
      "UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A \u2014 you absolute legend",
      "\uD83D\uDC26\uD83C\uDF89 cal is PARTYING \uD83C\uDF89\uD83D\uDC26",
    ];
    var msg = msgs[Math.floor(Math.random() * msgs.length)];
    el.innerHTML = msg;
    var colors = ['#54BBB7','#F19800','#006643','#15294F','#54BBB7'];
    var ci = 0;
    var flash = setInterval(function() {
      bar.style.background = colors[ci % colors.length];
      ci++;
    }, 180);
    setTimeout(function() {
      clearInterval(flash);
      bar.style.background = prevBg;
      el.style.opacity = '0';
      setTimeout(function() { el.innerHTML = prev; el.style.opacity = '1'; }, 200);
    }, 3000);
  }

  // Clicking the bird in the empty state chirps at you
  var birdClicks = 0;
  var birdResponses = [
    "chirp!",
    "chirp chirp!",
    "*ruffles feathers*",
    "I\u2019m just a bird icon, I don\u2019t do tricks.",
    "okay fine. chirp.",
    "CHIRP",
    "...chirp?",
    "*stares at you*",
    "you could be building a prototype right now y\u2019know",
    "okay this is getting weird. build something.",
  ];
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('empty-bird')) {
      var chirp = birdResponses[birdClicks % birdResponses.length];
      birdClicks++;
      showToast(chirp, 1800);
    }
  });

  // ── Boot ──────────────────────────────────────────────────────────────
  document.getElementById('cal-greeting').innerHTML = SESSION_GREETING;
  fetchState();
  setInterval(fetchState, 3000);
</script>
</body>
</html>`;
}
