// ============================================================
// LearnGreen LMS — main.js
// All shared functions used by every page
// ============================================================

// ── TOAST ──
function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  const icon = t.querySelector('i');
  if (icon) icon.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── LOGOUT ──
function logout() {
  showToast('Logged out successfully');
  setTimeout(() => { window.location.href = 'login.html'; }, 800);
}

// ── GET / SET USER ──
function getUser() {
  try { return JSON.parse(localStorage.getItem('lg_user') || '{}'); } catch(e) { return {}; }
}
function saveUser(u) {
  localStorage.setItem('lg_user', JSON.stringify(u));
}

// ── LOAD SIDEBAR USER ──
function loadSidebarUser() {
  const u = getUser();
  const full = ((u.firstName||'Alex')+' '+(u.lastName||'Johnson')).trim();
  const init = full.charAt(0).toUpperCase();
  const role = (u.role||'Student') + (u.plan ? ' • '+u.plan : '');

  const el = (id) => document.getElementById(id);
  if (el('sb-avatar')) {
    if (u.photoData) {
      el('sb-avatar').innerHTML = `<img src="${u.photoData}" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/>`;
    } else {
      el('sb-avatar').textContent = init;
    }
  }
  if (el('sb-name'))   el('sb-name').textContent   = full;
  if (el('sb-role'))   el('sb-role').textContent   = role;
  if (el('nav-uname')) el('nav-uname').textContent = u.firstName || 'Alex';
}

// ── HIGHLIGHT ACTIVE SIDEBAR LINK ──
function highlightNav() {
  const page = location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-menu a[href]').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ── TABS ──
function openTab(btn, panelId, groupClass) {
  const grp = groupClass || '.tab-panel';
  btn.closest('[data-tabs]').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(grp).forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const p = document.getElementById(panelId);
  if (p) p.classList.add('active');
}

// ── QUIZ ──
function selectOpt(btn) {
  btn.closest('.options').querySelectorAll('.opt').forEach(b => {
    b.classList.remove('selected');
    const l = b.querySelector('.opt-lbl');
    if (l) { l.style.background=''; l.style.color=''; }
  });
  btn.classList.add('selected');
  const l = btn.querySelector('.opt-lbl');
  if (l) { l.style.background='var(--green-main)'; l.style.color='#fff'; }
}

function submitQuiz() {
  const qa = document.getElementById('quiz-q');
  const qr = document.getElementById('quiz-r');
  if (qa) qa.style.display = 'none';
  if (qr) qr.style.display = 'block';
}

// ── FORGOT PASSWORD STEPS ──
function fpStep(n) {
  [1,2,3].forEach(i => {
    const s = document.getElementById('fp-s'+i);
    const d = document.getElementById('fp-d'+i);
    if (s) s.style.display = i===n ? 'block' : 'none';
    if (d) d.style.background = i<=n ? 'var(--green-main)' : 'var(--border)';
  });
}
function fpSend() {
  const e = document.getElementById('fp-email');
  if (!e||!e.value) { showToast('Enter your email first','error'); return; }
  const disp = document.getElementById('fp-email-disp');
  if (disp) disp.textContent = e.value;
  fpStep(2); showToast('Reset code sent! Check your email');
}
function fpVerify() { fpStep(3); }
function fpReset() {
  showToast('Password reset successfully!');
  setTimeout(() => { window.location.href = 'login.html'; }, 1200);
}

// ── PROFILE TAB ──
function pTab(btn, id) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.ptab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

// ── PASSWORD STRENGTH ──
function checkPwStrength(val) {
  const rules = {
    len:     val.length >= 8,
    upper:   /[A-Z]/.test(val),
    num:     /[0-9]/.test(val),
    special: /[!@#$%^&*]/.test(val)
  };
  const score = Object.values(rules).filter(Boolean).length;
  const fill = document.getElementById('pw-fill');
  const text = document.getElementById('pw-text');
  const lvls = [
    {w:'0%',  c:'var(--border)',t:'',       tc:'#9aab9a'},
    {w:'25%', c:'#e53935',     t:'Weak',    tc:'#e53935'},
    {w:'50%', c:'#ff9800',     t:'Fair',    tc:'#ff9800'},
    {w:'75%', c:'#fdd835',     t:'Good',    tc:'#f57c00'},
    {w:'100%',c:'var(--green-main)',t:'Strong ✓',tc:'var(--green-main)'}
  ];
  if (fill) { fill.style.width=lvls[score].w; fill.style.background=lvls[score].c; }
  if (text) { text.textContent=lvls[score].t; text.style.color=lvls[score].tc; }
  Object.keys(rules).forEach(k => {
    const el = document.getElementById('r-'+k);
    if (!el) return;
    const i = el.querySelector('i');
    const s = el.querySelector('span');
    if (rules[k]) { i.className='fas fa-check-circle'; i.style.color='var(--green-main)'; if(s)s.style.color='var(--green-dark)'; }
    else          { i.className='fas fa-circle'; i.style.color='#9aab9a'; if(s)s.style.color='var(--text-muted)'; }
  });
}

// ── ENROLL SUCCESS ──
function finishEnroll() {
  const f = document.getElementById('enroll-form');
  const s = document.getElementById('enroll-success');
  if (f) f.style.display='none';
  if (s) s.style.display='block';
  showToast('Enrollment successful! 🎉');
}

// ── SECTION SWITCHER (edit-profile) ──
function showSec(id, btn) {
  document.querySelectorAll('.ep-sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.snav-btn').forEach(b => b.classList.remove('active'));
  const s = document.getElementById('sec-'+id);
  if (s) s.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── QUIZ TIMER ──
let quizInterval = null;
function startTimer(secs) {
  const el = document.getElementById('quiz-timer');
  if (!el) return;
  clearInterval(quizInterval);
  let rem = secs;
  quizInterval = setInterval(() => {
    rem--;
    if (rem <= 0) { clearInterval(quizInterval); el.textContent='0:00'; return; }
    const m = Math.floor(rem/60), s = rem%60;
    el.textContent = m+':'+(s<10?'0':'')+s;
    if (rem<=60) el.style.color='#e53935';
  }, 1000);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadSidebarUser();
  highlightNav();
  // Animate progress bars with data-w attribute
  document.querySelectorAll('.progress-fill[data-w]').forEach(b => {
    const w = b.getAttribute('data-w');
    b.style.width='0'; setTimeout(()=>b.style.width=w, 400);
  });
});