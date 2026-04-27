/* ============================================================
   CLOCKIVO — app.js
   State + Theme + Router + Time Engine + Clock Module
============================================================ */

const AppState = {
  settings: {
    use24Hour: false,
    showSeconds: true,
    alarmSound: 'assets/sound/mixkit-alarm-tone-996.wav'
  },
  alarms: [],
  wc: ["America/New_York", "Europe/London", "Asia/Tokyo"]
};

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  initRouter();
  initMobileMenu();
  initClockModule();
  initAlarmModule();
  initTimerModule();
  initStopwatchModule();
  initWorldClockModule();
  initSettingsModule();
  startTimeEngine();
  initFaq();
  initFooterYear();
  handleRoute(); // Call initially
});

/* ============================================================
   PERSISTENCE
============================================================ */
function loadState() {
  try {
    const s = localStorage.getItem('cf-settings');
    if (s) AppState.settings = { ...AppState.settings, ...JSON.parse(s) };
    const a = localStorage.getItem('cf-alarms');
    if (a) AppState.alarms = JSON.parse(a);
  } catch (e) { /* fail gracefully */ }
}

function saveSettings() {
  try { localStorage.setItem('cf-settings', JSON.stringify(AppState.settings)); } catch (e) {}
}

/* ============================================================
   THEME
============================================================ */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('cf-theme') || 'dark';
  applyTheme(saved, html);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next, html);
    localStorage.setItem('cf-theme', next);
  });
}

function applyTheme(theme, html) {
  html.setAttribute('data-theme', theme);
  const moon = document.getElementById('ti-moon');
  const sun  = document.getElementById('ti-sun');
  if (theme === 'dark') {
    if (moon) moon.style.display = 'block';
    if (sun)  sun.style.display  = 'none';
  } else {
    if (moon) moon.style.display = 'none';
    if (sun)  sun.style.display  = 'block';
  }
}

/* ============================================================
   FAQ MODULE
============================================================ */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
      
      // Toggle current
      if(!isActive) item.classList.add('active');
    });
  });
}

/* ============================================================
   ROUTER (hash-based)
============================================================ */
function initRouter() {
  if (!window.location.hash) window.location.hash = '#home';
  handleRoute();
  window.addEventListener('hashchange', handleRoute);
}

window.switchView = function(viewId) {
  window.location.hash = '#' + viewId;
}

function handleRoute() {
  const hash = window.location.hash || '#home';
  const id   = hash.slice(1);
  
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
  } else {
    const nf = document.getElementById('not-found');
    if (nf) {
      nf.classList.add('active');
    } else {
      document.getElementById('home').classList.add('active');
      window.location.hash = '#home';
    }
  }

  // Close mobile drawer if open
  const drawer = document.getElementById('mob-drawer');
  if(drawer) drawer.classList.remove('show');
  // Nav links
  document.querySelectorAll('.nav-link, .mob-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });

  // Close mobile drawer
  closeMobileDrawer();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ============================================================
   MOBILE MENU
============================================================ */
function initMobileMenu() {
  const btn    = document.getElementById('mob-btn');
  const drawer = document.getElementById('mob-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('show');
    if (isOpen) closeMobileDrawer();
    else        openMobileDrawer();
  });

  const closeBtn = document.getElementById('mob-close');
  if(closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);

  drawer.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });

  // Share menu toggle for mobile
  const shareTrigger = document.querySelector('.share-trigger');
  const shareContainer = document.querySelector('.share-container');
  if(shareTrigger && shareContainer) {
    shareTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      shareContainer.classList.toggle('active');
    });
    document.addEventListener('click', () => shareContainer.classList.remove('active'));
  }
}

function openMobileDrawer() {
  const drawer = document.getElementById('mob-drawer');
  if (drawer) { drawer.classList.add('show'); drawer.setAttribute('aria-hidden', 'false'); }
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mob-drawer');
  if (drawer) { drawer.classList.remove('show'); drawer.setAttribute('aria-hidden', 'true'); }
}

/* ============================================================
   TIME ENGINE
============================================================ */
function startTimeEngine() {
  updateTimeUI();
  checkAlarms();
  // Re-align every second
  const tick = () => {
    updateTimeUI();
    checkAlarms();
    updateWorldClock();
    const ms = 1000 - (Date.now() % 1000);
    setTimeout(tick, ms);
  };
  const ms = 1000 - (Date.now() % 1000);
  setTimeout(tick, ms);
}

function updateTimeUI() {
  const now = new Date();

  const timeOpts = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !AppState.settings.use24Hour
  };
  if (AppState.settings.showSeconds) timeOpts.second = '2-digit';

  const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const timeStr = now.toLocaleTimeString(undefined, timeOpts);
  const dateStr = now.toLocaleDateString(undefined, dateOpts);

  setText('hero-time', timeStr);
  setText('hero-date', dateStr);
  setText('clk-time', timeStr);
  setText('clk-date', dateStr);

  // Update stat: active alarm count
  const activeAlarms = AppState.alarms.filter(a => a.enabled).length;
  setText('stat-alarms', activeAlarms);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ============================================================
   CLOCK MODULE
============================================================ */
function initClockModule() {
  const fmt24    = document.getElementById('fmt24');
  const showSec  = document.getElementById('show-sec');
  const fsBtn    = document.getElementById('fs-btn');

  if (fmt24) {
    fmt24.checked = AppState.settings.use24Hour;
    fmt24.addEventListener('change', e => {
      AppState.settings.use24Hour = e.target.checked;
      saveSettings();
      updateTimeUI();
      updateWorldClock();
    });
  }

  if (showSec) {
    showSec.checked = AppState.settings.showSeconds;
    showSec.addEventListener('change', e => {
      AppState.settings.showSeconds = e.target.checked;
      saveSettings();
      updateTimeUI();
    });
  }

  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);
}

function toggleFullscreen() {
  const el = document.documentElement; // Fullscreen the whole app for clock view
  if (!document.fullscreenElement) {
    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
  } else {
    (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
  }
}

/* ============================================================
   FOOTER YEAR
============================================================ */
function initFooterYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   ALARM MODULE
============================================================ */
let activeRingingAlarm = null;
let alarmAudio = null;

function initAlarmModule() {
  renderAlarmList();
  
  const setBtn = document.getElementById('set-alarm-btn');
  if (setBtn) {
    setBtn.addEventListener('click', () => {
      saveAlarm();
    });
  }

  const ampmBtns = document.querySelectorAll('.ampm-btn');
  ampmBtns.forEach(b => {
    b.addEventListener('click', () => {
      ampmBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  const th = document.getElementById('a-hour');
  const tm = document.getElementById('a-min');
  if (th) {
    th.addEventListener('blur', () => {
      let v = parseInt(th.value, 10);
      if (isNaN(v) || v < 1) v = 12;
      if (v > 12) v = 12;
      th.value = v.toString();
    });
  }
  if (tm) {
    tm.addEventListener('blur', () => {
      let v = parseInt(tm.value, 10);
      if (isNaN(v) || v < 0) v = 0;
      if (v > 59) v = 59;
      tm.value = v.toString().padStart(2, '0');
    });
  }

  // Preset Alarms
  document.querySelectorAll('#alarm .preset').forEach(p => {
    p.addEventListener('click', () => {
      const h = p.dataset.h;
      const m = p.dataset.m;
      const ampm = p.dataset.p;
      if (th) th.value = h;
      if (tm) tm.value = m.padStart(2, '0');
      ampmBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.v === ampm);
      });
    });
  });

  // Repeat Options
  const repeatBtns = document.querySelectorAll('#alarm .r-btn[data-v]');
  const dayPicker = document.getElementById('day-picker');
  repeatBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      repeatBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const v = btn.dataset.v;
      
      const dayBtns = document.querySelectorAll('.day-btn');
      dayBtns.forEach(b => b.classList.remove('active'));

      if (v === 'daily') {
        dayBtns.forEach(b => b.classList.add('active'));
      } else if (v === 'weekdays') {
        [1,2,3,4,5].forEach(d => {
          const b = document.querySelector(`.day-btn[data-d="${d}"]`);
          if(b) b.classList.add('active');
        });
      } else if (v === 'weekends') {
        [0,6].forEach(d => {
          const b = document.querySelector(`.day-btn[data-d="${d}"]`);
          if(b) b.classList.add('active');
        });
      }
      
      if (v === 'custom') {
        if(dayPicker) dayPicker.classList.add('show');
      } else {
        if(dayPicker) dayPicker.classList.remove('show');
      }
    });
  });

  // Day Buttons
  document.querySelectorAll('.day-btn').forEach(b => {
    b.addEventListener('click', () => {
      b.classList.toggle('active');
      // Switch to custom repeat if manual toggle
      repeatBtns.forEach(rb => {
        rb.classList.toggle('active', rb.dataset.v === 'custom');
      });
      if(dayPicker) dayPicker.classList.add('show');
    });
  });
}

function saveAlarm() {
  const hEl = document.getElementById('a-hour');
  const mEl = document.getElementById('a-min');
  const lblEl = document.getElementById('a-label');
  const ampmAct = document.querySelector('.ampm-btn.active');

  let h = parseInt(hEl.value, 10);
  let m = parseInt(mEl.value, 10);
  if (isNaN(h) || isNaN(m)) return showToast('Invalid time');

  const isPM = ampmAct && ampmAct.dataset.v === 'PM';
  
  // Normalize to 24h for internal state
  let h24 = h;
  if (isPM && h !== 12) h24 += 12;
  else if (!isPM && h === 12) h24 = 0;

  const days = Array.from(document.querySelectorAll('.day-btn.active')).map(b => parseInt(b.dataset.d, 10));

  const newAlarm = {
    id: Date.now().toString(),
    h24, m, 
    label: lblEl.value.trim() || 'Alarm',
    days: days, // empty means one-time
    enabled: true,
    lastFired: 0
  };

  AppState.alarms.push(newAlarm);
  try { localStorage.setItem('cf-alarms', JSON.stringify(AppState.alarms)); } catch(e){}
  
  // reset form
  hEl.value = '07';
  mEl.value = '00';
  lblEl.value = '';
  document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));

  renderAlarmList();
  updateTimeUI(); // update stats
  showToast('Alarm saved');
}

function renderAlarmList() {
  const list = document.getElementById('alarm-list');
  const empty = document.getElementById('alarm-empty');
  const badge = document.getElementById('alarm-badge');
  if (!list) return;

  if (AppState.alarms.length === 0) {
    list.innerHTML = '';
    if(empty) empty.style.display = 'block';
    if(badge) badge.textContent = '0';
    return;
  }
  if(empty) empty.style.display = 'none';

  list.innerHTML = '';
  
  // Sort alarms chronologically
  const sorted = [...AppState.alarms].sort((a,b) => {
    if (a.h24 !== b.h24) return a.h24 - b.h24;
    return a.m - b.m;
  });

  sorted.forEach(a => {
    const isPM = a.h24 >= 12;
    let h12 = a.h24 % 12;
    if (h12 === 0) h12 = 12;
    const timeStr = `${h12}:${a.m.toString().padStart(2,'0')} ${isPM ? 'PM' : 'AM'}`;
    
    let daysStr = 'Once';
    if (a.days.length === 7) daysStr = 'Everyday';
    else if (a.days.length > 0) {
      const map = ['Su','Mo','Tu','We','Th','Fr','Sa'];
      daysStr = a.days.map(d => map[d]).join(', ');
    }

    const item = document.createElement('div');
    item.className = 'alarm-item';
    item.innerHTML = `
      <div class="ai-info">
        <div class="ai-time" style="color: ${a.enabled ? 'var(--text)' : 'var(--text-muted)'}">${timeStr}</div>
        <div class="ai-lbl">${a.label} • ${daysStr}</div>
      </div>
      <div class="ai-acts">
        <label class="toggle-control" style="margin:0">
          <input type="checkbox" onchange="toggleAlarm('${a.id}', this.checked)" ${a.enabled ? 'checked' : ''}>
          <div class="toggle-track"><div class="toggle-thumb"></div></div>
        </label>
        <button class="btn-ghost ai-del" onclick="deleteAlarm('${a.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
        </button>
      </div>
    `;
    list.appendChild(item);
  });

  }

window.toggleAlarm = function(id, enabled) {
  const al = AppState.alarms.find(x => x.id === id);
  if (al) {
    al.enabled = enabled;
    try { localStorage.setItem('cf-alarms', JSON.stringify(AppState.alarms)); } catch(e){}
    renderAlarmList();
    updateTimeUI();
  }
}

window.deleteAlarm = function(id) {
  AppState.alarms = AppState.alarms.filter(x => x.id !== id);
  try { localStorage.setItem('cf-alarms', JSON.stringify(AppState.alarms)); } catch(e){}
  renderAlarmList();
  updateTimeUI();
}

function checkAlarms() {
  if (activeRingingAlarm) return;

  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const d = now.getDay();
  // We check only once per minute by tracking lastFired
  // We'll use a simple threshold: if it fired less than 60s ago, ignore

  for (let al of AppState.alarms) {
    if (!al.enabled) continue;
    
    // Day check
    if (al.days.length > 0 && !al.days.includes(d)) continue;

    if (al.h24 === h && al.m === m) {
      if (Date.now() - al.lastFired > 60000) {
        triggerAlarm(al);
        break; // trigger one at a time
      }
    }
  }
}

function triggerAlarm(al) {
  activeRingingAlarm = al;
  al.lastFired = Date.now();

  // If one-time, disable it
  if (al.days.length === 0) {
    al.enabled = false;
  }
  try { localStorage.setItem('cf-alarms', JSON.stringify(AppState.alarms)); } catch(e){}
  renderAlarmList();
  updateTimeUI();

  // Show UI
  const isPM = al.h24 >= 12;
  let h12 = al.h24 % 12;
  if (h12 === 0) h12 = 12;
  const timeStr = `${h12}:${al.m.toString().padStart(2,'0')} ${isPM ? 'PM' : 'AM'}`;
  
  const mLabel = document.getElementById('modal-label');
  const mTime = document.getElementById('modal-time');
  if (mLabel) mLabel.textContent = al.label || 'Alarm';
  if (mTime) mTime.textContent = timeStr;

  const aSound = document.getElementById('modal-a-sound');
  const aVol = document.getElementById('modal-a-vol');
  
  if (!alarmAudio) {
    alarmAudio = new Audio(aSound ? aSound.value : 'assets/sound/mixkit-alarm-tone-996.wav');
    alarmAudio.loop = true;
  } else if (aSound) {
    alarmAudio.src = aSound.value;
  }
  
  if(aVol) alarmAudio.volume = parseFloat(aVol.value);
  alarmAudio.muted = false;
  
  const muteBtn = document.getElementById('modal-a-mute');
  if(muteBtn) muteBtn.textContent = '🔊';

  document.getElementById('alarm-modal').classList.add('show');
  playAlarmAudio();
}

function playAlarmAudio() {
  if (!alarmAudio) {
    alarmAudio = new Audio('assets/sound/mixkit-alarm-tone-996.wav');
    alarmAudio.loop = true;
  }
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch(e => {
    console.warn("Autoplay blocked, user interaction required");
  });
}

function changeRingSound(src) {
  if(alarmAudio) {
    alarmAudio.src = src;
    alarmAudio.play();
  }
}

function changeRingVol(vol) {
  if(alarmAudio) {
    alarmAudio.volume = parseFloat(vol);
  }
}

function toggleRingMute() {
  if(alarmAudio) {
    alarmAudio.muted = !alarmAudio.muted;
    const btnA = document.getElementById('modal-a-mute');
    const btnT = document.getElementById('modal-t-mute');
    const icon = alarmAudio.muted ? '🔇' : '🔊';
    if(btnA) btnA.textContent = icon;
    if(btnT) btnT.textContent = icon;
  }
}

function stopRingingAlarm() {
  if (alarmAudio) { alarmAudio.pause(); alarmAudio.currentTime = 0; }
  document.getElementById('alarm-modal').classList.remove('show');
  activeRingingAlarm = null;
}

function stopTimerRing() {
  if (alarmAudio) { alarmAudio.pause(); alarmAudio.currentTime = 0; }
  document.getElementById('timer-modal').classList.remove('show');
}

function snoozeAlarm(min = 5) {
  if (alarmAudio) { alarmAudio.pause(); alarmAudio.currentTime = 0; }
  document.getElementById('alarm-modal').classList.remove('show');
  
  if (activeRingingAlarm) {
    // Create temporary snooze alarm X mins from now
    const now = new Date();
    now.setMinutes(now.getMinutes() + min);
    const snz = {
      id: Date.now().toString(),
      h24: now.getHours(),
      m: now.getMinutes(),
      label: 'Snoozed: ' + activeRingingAlarm.label,
      days: [],
      enabled: true,
      lastFired: 0
    };
    AppState.alarms.push(snz);
    try { localStorage.setItem('cf-alarms', JSON.stringify(AppState.alarms)); } catch(e){}
    renderAlarmList();
    showToast(`Snoozed for ${min} minutes`);
  }
  activeRingingAlarm = null;
}

// Add global event listener for snooze buttons in modal
document.querySelectorAll('.snooze-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const min = parseInt(btn.dataset.min, 10) || 5;
    snoozeAlarm(min);
  });
});

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  const wrap = document.getElementById('toast-wrap');
  if (wrap) {
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }
}

/* ============================================================
   TIMER MODULE
============================================================ */
let timerInterval = null;
let timerTotalMs = 0;
let timerRemainingMs = 0;
let timerEndTime = 0;

function initTimerModule() {
  const startBtn = document.getElementById('t-start');
  const stopBtn = document.getElementById('t-pause');
  const resetBtn = document.getElementById('t-reset');

  if (startBtn) startBtn.addEventListener('click', () => {
    startTimer();
    startBtn.classList.add('is-running');
    setTimeout(() => startBtn.classList.remove('is-running'), 400);
  });
  if (stopBtn) stopBtn.addEventListener('click', () => {
    stopTimer();
    stopBtn.classList.add('is-paused');
    setTimeout(() => stopBtn.classList.remove('is-paused'), 400);
  });
  if (resetBtn) resetBtn.addEventListener('click', () => {
    resetTimer();
    resetBtn.classList.add('is-resetting');
    setTimeout(() => resetBtn.classList.remove('is-resetting'), 400);
  });

  const presets = document.querySelectorAll('#timer .preset');
  presets.forEach(p => {
    p.addEventListener('click', () => {
      const sec = parseInt(p.dataset.s, 10);
      const m = Math.floor(sec / 60);
      document.getElementById('t-m').value = m;
      document.getElementById('t-h').value = '';
      document.getElementById('t-s').value = '';
      resetTimer();
    });
  });

  ['t-h','t-m','t-s'].forEach(id => {
    const el = document.getElementById(id);
    if(el) {
      el.addEventListener('input', () => {
        if(el.value.length > 2) el.value = el.value.slice(0,2);
      });
      el.addEventListener('blur', () => {
        let v = parseInt(el.value, 10);
        if(isNaN(v) || v < 0) v = 0;
        if(id !== 't-h' && v > 59) v = 59;
        el.value = v > 0 ? v.toString().padStart(2,'0') : '';
        resetTimer();
      });
    }
  });
}

function getTimerInputMs() {
  const h = parseInt(document.getElementById('t-h').value, 10) || 0;
  const m = parseInt(document.getElementById('t-m').value, 10) || 0;
  const s = parseInt(document.getElementById('t-s').value, 10) || 0;
  return (h * 3600 + m * 60 + s) * 1000;
}

function updateTimerUI(ms) {
  const totalS = Math.ceil(ms / 1000);
  const h = Math.floor(totalS / 3600);
  const m = Math.floor((totalS % 3600) / 60);
  const s = totalS % 60;

  let str = '';
  if(h > 0) str += `${h}:`;
  str += `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  
  const display = document.getElementById('timer-disp');
  if(display) display.textContent = str;

  const prog = document.getElementById('timer-ring-fg');
  if(prog) {
    if(timerTotalMs <= 0) {
      prog.style.strokeDashoffset = 0;
    } else {
      const pct = ms / timerTotalMs;
      // 553 is dasharray
      prog.style.strokeDashoffset = 553 - (553 * pct);
    }
  }
}

function startTimer() {
  if (timerInterval) return;
  if (timerRemainingMs <= 0) {
    const ms = getTimerInputMs();
    if(ms <= 0) return;
    timerTotalMs = ms;
    timerRemainingMs = ms;
  }
  
  timerEndTime = Date.now() + timerRemainingMs;
  
  const startBtn = document.getElementById('t-start');
  const stopBtn = document.getElementById('t-pause');
  if(startBtn) {
    startBtn.disabled = true;
    startBtn.classList.add('is-running');
  }
  if(stopBtn) {
    stopBtn.disabled = false;
    stopBtn.classList.remove('is-paused');
  }

  timerInterval = setInterval(() => {
    timerRemainingMs = timerEndTime - Date.now();
    if(timerRemainingMs <= 0) {
      timerRemainingMs = 0;
      stopTimer();
      triggerTimerEnd();
    }
    updateTimerUI(timerRemainingMs);
  }, 100); // 10fps for smooth ring
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  const startBtn = document.getElementById('t-start');
  const stopBtn = document.getElementById('t-pause');
  if(startBtn) {
    startBtn.disabled = false;
    startBtn.classList.remove('is-running');
  }
  if(stopBtn) {
    stopBtn.disabled = true;
    stopBtn.classList.add('is-paused');
  }
}

function resetTimer() {
  stopTimer();
  timerTotalMs = getTimerInputMs();
  timerRemainingMs = timerTotalMs;
  updateTimerUI(timerRemainingMs);
  
  const startBtn = document.getElementById('t-start');
  const stopBtn = document.getElementById('t-pause');
  const resetBtn = document.getElementById('t-reset');
  if(startBtn) startBtn.classList.remove('is-running');
  if(stopBtn) stopBtn.classList.remove('is-paused');
  if(resetBtn) {
    resetBtn.classList.add('is-resetting');
    setTimeout(() => resetBtn.classList.remove('is-resetting'), 300);
  }
}

function triggerTimerEnd() {
  // Get custom label
  const tLabelInput = document.getElementById('t-label');
  const labelText = (tLabelInput && tLabelInput.value.trim() !== '') ? tLabelInput.value : 'Timer';
  const mLabel = document.getElementById('t-modal-lbl');
  if(mLabel) mLabel.textContent = labelText;

  // Sync the UI values with default
  const tSound = document.getElementById('modal-t-sound');
  const tVol = document.getElementById('modal-t-vol');
  
  if (!alarmAudio) {
    alarmAudio = new Audio(tSound ? tSound.value : 'assets/sound/mixkit-alarm-tone-996.wav');
    alarmAudio.loop = true;
  } else if (tSound) {
    alarmAudio.src = tSound.value;
  }
  
  if(tVol) alarmAudio.volume = parseFloat(tVol.value);
  alarmAudio.muted = false;
  
  const muteBtn = document.getElementById('modal-t-mute');
  if(muteBtn) muteBtn.textContent = '🔊';

  playAlarmAudio();
  document.getElementById('timer-modal').classList.add('show');
}

/* ============================================================
   STOPWATCH MODULE
============================================================ */
let swInterval = null;
let swStartMs = 0;
let swElapsedMs = 0;
let swLaps = [];

function initStopwatchModule() {
  const startBtn = document.getElementById('sw-start');
  const resetBtn = document.getElementById('sw-reset');
  const lapBtn = document.getElementById('sw-lap');
  const clearLapsBtn = document.getElementById('sw-clear-laps');

  if(startBtn) startBtn.addEventListener('click', () => {
    startSw();
    if(swInterval) {
      startBtn.classList.add('is-running');
      setTimeout(() => startBtn.classList.remove('is-running'), 400);
    }
  });
  if(resetBtn) resetBtn.addEventListener('click', () => {
    resetSw();
    resetBtn.classList.add('is-resetting');
    setTimeout(() => resetBtn.classList.remove('is-resetting'), 400);
  });
  if(lapBtn) lapBtn.addEventListener('click', () => {
    lapSw();
    lapBtn.classList.add('is-running');
    setTimeout(() => lapBtn.classList.remove('is-running'), 400);
  });
  if(clearLapsBtn) clearLapsBtn.addEventListener('click', () => { swLaps = []; renderLaps(); });

  const exportBtn = document.getElementById('sw-export');
  if(exportBtn) exportBtn.addEventListener('click', exportSwCSV);
}

function updateSwUI(ms) {
  const totalS = Math.floor(ms / 1000);
  const m = Math.floor(totalS / 60);
  const s = totalS % 60;
  const cs = Math.floor((ms % 1000) / 10); // centiseconds

  const ts = document.getElementById('sw-time');
  if(ts) {
    ts.innerHTML = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}<span class="sw-ms">.${cs.toString().padStart(2,'0')}</span>`;
  }
}

function startSw() {
  if(swInterval) {
    stopSw();
    return;
  }
  swStartMs = Date.now() - swElapsedMs;
  
  const startBtn = document.getElementById('sw-start');
  if(startBtn) {
    startBtn.textContent = 'Pause';
    startBtn.classList.add('is-running');
    startBtn.classList.remove('is-paused');
  }
  const lapBtn = document.getElementById('sw-lap');
  if(lapBtn) lapBtn.disabled = false;
  
  swInterval = setInterval(() => {
    swElapsedMs = Date.now() - swStartMs;
    updateSwUI(swElapsedMs);
  }, 10); // 100fps for smooth ms
}

function stopSw() {
  if(swInterval) clearInterval(swInterval);
  swInterval = null;
  const startBtn = document.getElementById('sw-start');
  if(startBtn) {
    startBtn.textContent = 'Start';
    startBtn.classList.remove('is-running');
    startBtn.classList.add('is-paused');
  }
}

function resetSw() {
  stopSw();
  swElapsedMs = 0;
  swLaps = [];
  updateSwUI(0);
  renderLaps();
  
  const startBtn = document.getElementById('sw-start');
  const resetBtn = document.getElementById('sw-reset');
  if(startBtn) {
    startBtn.classList.remove('is-running');
    startBtn.classList.remove('is-paused');
  }
  if(resetBtn) {
    resetBtn.classList.add('is-resetting');
    setTimeout(() => resetBtn.classList.remove('is-resetting'), 300);
  }
}

function lapSw() {
  if(swElapsedMs === 0) return;
  const current = swElapsedMs;
  const prev = swLaps.length > 0 ? swLaps[0].total : 0;
  const diff = current - prev;
  
  swLaps.unshift({ total: current, diff: diff });
  renderLaps();
}

function formatSwTime(ms) {
  const totalS = Math.floor(ms / 1000);
  const m = Math.floor(totalS / 60);
  const s = totalS % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}.${cs.toString().padStart(2,'0')}`;
}

function renderLaps() {
  const list = document.getElementById('sw-laps');
  const panel = document.getElementById('sw-laps-panel');
  if(!list) return;
  
  if (swLaps.length === 0) {
    list.innerHTML = `<div class="empty-st"><span>⏱</span><p>No laps recorded</p></div>`;
    if(panel) panel.style.display = 'none';
    return;
  }
  if(panel) panel.style.display = 'block';
  
  list.innerHTML = '';
  const total = swLaps.length;
  
  swLaps.forEach((lap, i) => {
    const item = document.createElement('div');
    item.className = 'lap-item';
    
    // Check if fastest or slowest
    let isFastest = false;
    let isSlowest = false;
    if(swLaps.length > 1) {
      const diffs = swLaps.map(l => l.diff);
      const min = Math.min(...diffs);
      const max = Math.max(...diffs);
      if(lap.diff === min) isFastest = true;
      if(lap.diff === max) isSlowest = true;
    }
    
    let color = 'var(--text)';
    if(isFastest) color = '#4ade80'; // green
    if(isSlowest) color = '#f87171'; // red
    
    item.style.color = color;
    
    item.innerHTML = `
      <div class="lap-idx">${total - i}</div>
      <div class="lap-diff">+${formatSwTime(lap.diff)}</div>
      <div class="lap-val">${formatSwTime(lap.total)}</div>
    `;
    list.appendChild(item);
  });

  }

/* ============================================================
   WORLD CLOCK MODULE
============================================================ */
const timezones = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Phoenix", 
  "America/Toronto", "America/Mexico_City", "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
  "Europe/London", "Europe/Dublin", "Europe/Paris", "Europe/Berlin", "Europe/Rome", "Europe/Madrid",
  "Europe/Amsterdam", "Europe/Brussels", "Europe/Zurich", "Europe/Vienna", "Europe/Stockholm",
  "Europe/Oslo", "Europe/Helsinki", "Europe/Moscow", "Europe/Istanbul",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Singapore", "Asia/Hong_Kong", "Asia/Shanghai",
  "Asia/Tokyo", "Asia/Seoul", "Asia/Jakarta", "Asia/Manila",
  "Australia/Sydney", "Australia/Melbourne", "Australia/Perth", "Australia/Brisbane", "Australia/Adelaide",
  "Pacific/Auckland", "Pacific/Honolulu", "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi"
];

function initWorldClockModule() {
  const inp = document.getElementById('wc-search');
  const sugg = document.getElementById('wc-suggestions');
  if(!inp || !sugg) return;
  
  // load saved
  try {
    const w = localStorage.getItem('cf-wc');
    if(w) AppState.wc = JSON.parse(w);
    else AppState.wc = [
      "America/New_York", "Europe/London", "Asia/Tokyo", 
      "Europe/Paris", "Asia/Dubai", "Asia/Kolkata", 
      "Australia/Sydney", "America/Sao_Paulo", "Asia/Singapore"
    ];
  } catch(e) { AppState.wc = ["America/New_York"]; }

  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    if(q.length < 2) { sugg.classList.remove('active'); return; }
    
    const matches = timezones.filter(tz => tz.toLowerCase().includes(q) && !AppState.wc.includes(tz));
    
    if(matches.length > 0) {
      sugg.innerHTML = matches.map(tz => {
        const parts = tz.split('/');
        const name = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz;
        return `<div class="wc-sugg-item" data-tz="${tz}">${name} <small>(${tz})</small></div>`;
      }).join('');
      sugg.classList.add('active');
    } else {
      sugg.classList.remove('active');
    }
  });

  sugg.addEventListener('click', (e) => {
    if(e.target.classList.contains('wc-sugg-item')) {
      const tz = e.target.dataset.tz;
      if(!AppState.wc.includes(tz)) {
        AppState.wc.push(tz);
        try { localStorage.setItem('cf-wc', JSON.stringify(AppState.wc)); } catch(e){}
        updateWorldClock();
      }
      inp.value = '';
      sugg.classList.remove('active');
    }
  });

  document.addEventListener('click', (e) => {
    if(!inp.contains(e.target) && !sugg.contains(e.target)) sugg.classList.remove('active');
  });

  updateWorldClock();
  setInterval(updateWorldClock, 1000);
}

function updateWorldClock() {
  const grid = document.getElementById('wc-grid');
  if(!grid) return;
  
  if(!AppState.wc) AppState.wc = [];
  
  const now = new Date();
  let html = '';
  
  AppState.wc.forEach(tz => {
    try {
      const parts = tz.split('/');
      const city = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz;
      
      const timeOpts = { timeZone: tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: !AppState.settings.use24Hour };
      const timeStr = now.toLocaleTimeString('en-US', timeOpts);
      
      const dateOpts = { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' };
      const dateStr = now.toLocaleDateString('en-US', dateOpts);
      
      // Calculate diff
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const localNow = new Date(now.toLocaleString("en-US", {timeZone: localTz}));
      const remoteNow = new Date(now.toLocaleString("en-US", {timeZone: tz}));
      const diffHrs = Math.round((remoteNow - localNow) / 3600000);
      let diffStr = diffHrs === 0 ? 'Same time' : (diffHrs > 0 ? `+${diffHrs}h` : `${diffHrs}h`);

      html += `
        <div class="wc-card liquid-glass" onclick="openCityView('${tz}')">
          <div class="wc-info">
            <h3>${city}</h3>
            <p>${diffStr}</p>
          </div>
          <div class="wc-right">
            <div class="wc-right-inner">
              <div class="wc-time" style="font-variant-numeric: tabular-nums;">${timeStr}</div>
              <p>${dateStr}</p>
            </div>
            <button class="wc-del" onclick="event.stopPropagation(); removeWorldClock('${tz}')">✕</button>
          </div>
        </div>
      `;
    } catch(e) {}
  });
  
  grid.innerHTML = html;
}

window.removeWorldClock = function(tz) {
  AppState.wc = AppState.wc.filter(x => x !== tz);
  try { localStorage.setItem('cf-wc', JSON.stringify(AppState.wc)); } catch(e){}
  updateWorldClock();
}

window.openCityView = function(tz) {
  AppState.activeCityTz = tz;
  switchView('city-view');
  updateCityView();
}

function updateCityView() {
  const tz = AppState.activeCityTz;
  if(!tz || window.location.hash !== '#city-view') return;
  
  const locEl = document.getElementById('cv-loc');
  const timeEl = document.getElementById('cv-time');
  const dateEl = document.getElementById('cv-date');
  const tzEl = document.getElementById('cv-tz');
  const offEl = document.getElementById('cv-off');
  
  const now = new Date();
  const parts = tz.split('/');
  const city = parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : tz;
  
  const timeStr = now.toLocaleTimeString('en-US', { 
    timeZone: tz, 
    hour: 'numeric', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: !AppState.settings.use24Hour 
  });
  
  const dateStr = now.toLocaleDateString('en-US', { 
    timeZone: tz, 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  // Offset
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localNow = new Date(now.toLocaleString("en-US", {timeZone: localTz}));
  const remoteNow = new Date(now.toLocaleString("en-US", {timeZone: tz}));
  const diffHrs = Math.round((remoteNow - localNow) / 3600000);
  const diffStr = diffHrs === 0 ? 'Local Time' : (diffHrs > 0 ? `${diffHrs} hours ahead` : `${Math.abs(diffHrs)} hours behind`);

  if(locEl) locEl.textContent = `// ${city}`;
  if(timeEl) timeEl.textContent = timeStr;
  if(dateEl) dateEl.textContent = dateStr;
  if(tzEl) tzEl.textContent = tz;
  if(offEl) offEl.textContent = diffStr;
}

// Update city view loop
setInterval(updateCityView, 1000);

/* ============================================================
   SETTINGS MODULE
============================================================ */
function initSettingsModule() {
  const themeSegs = document.querySelectorAll('.seg-ctrl .seg[data-theme]');
  themeSegs.forEach(s => {
    s.addEventListener('click', () => {
      const th = s.dataset.theme;
      applyTheme(th, document.documentElement);
      localStorage.setItem('cf-theme', th);
      themeSegs.forEach(x => x.classList.remove('active'));
      s.classList.add('active');
    });
  });

  const fmtSegs = document.querySelectorAll('.seg-ctrl .seg[data-fmt]');
  fmtSegs.forEach(s => {
    s.addEventListener('click', () => {
      AppState.settings.use24Hour = (s.dataset.fmt === '24');
      saveSettings();
      updateTimeUI();
      updateWorldClock();
      fmtSegs.forEach(x => x.classList.remove('active'));
      s.classList.add('active');
      
      // sync with home clock toggles if present
      const home24 = document.getElementById('fmt24');
      if(home24) home24.checked = AppState.settings.use24Hour;
    });
  });

  const secCheck = document.getElementById('s-sec');
  if(secCheck) {
    secCheck.checked = AppState.settings.showSeconds;
    secCheck.addEventListener('change', e => {
      AppState.settings.showSeconds = e.target.checked;
      saveSettings();
      updateTimeUI();
      
      const homeSec = document.getElementById('show-sec');
      if(homeSec) homeSec.checked = AppState.settings.showSeconds;
    });
  }

  const sSound = document.getElementById('s-sound');
  if(sSound) {
    sSound.value = AppState.settings.alarmSound;
    sSound.addEventListener('change', e => {
      AppState.settings.alarmSound = e.target.value;
      saveSettings();
      // Premium touch: Preview the sound
      const preview = new Audio(e.target.value);
      preview.volume = 0.5;
      preview.play().catch(() => {});
      setTimeout(() => { preview.pause(); preview.currentTime = 0; }, 2000);
    });
  }

  const snoozeSegs = document.querySelectorAll('.seg-ctrl .seg[data-snooze]');
  snoozeSegs.forEach(s => {
    s.addEventListener('click', () => {
      AppState.settings.snoozeDuration = parseInt(s.dataset.snooze);
      saveSettings();
      snoozeSegs.forEach(x => x.classList.remove('active'));
      s.classList.add('active');
    });
  });

  const curTheme = localStorage.getItem('cf-theme') || 'dark';
  themeSegs.forEach(s => {
    s.classList.toggle('active', s.dataset.theme === curTheme);
  });
  
  fmtSegs.forEach(s => {
    s.classList.toggle('active', (s.dataset.fmt === '24') === AppState.settings.use24Hour);
  });
  
  snoozeSegs.forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.snooze) === AppState.settings.snoozeDuration);
  });

  const clrBtn = document.getElementById('clear-data-btn');
  if(clrBtn) {
    clrBtn.addEventListener('click', () => {
      if(confirm("Are you sure you want to clear all data? This will reset the app.")) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }

  const notifBtn = document.getElementById('notif-btn');
  const notifStatus = document.getElementById('notif-status');
  if(notifBtn) {
    notifBtn.addEventListener('click', () => {
      if (!("Notification" in window)) {
        notifStatus.textContent = "Notifications not supported.";
        return;
      }
      Notification.requestPermission().then(p => {
        notifStatus.textContent = p === "granted" ? "Enabled." : "Denied.";
      });
    });
  }
}

function exportSwCSV() {
  if (swLaps.length === 0) return showToast("No laps to export");
  
  let csv = "Lap,Split Time,Total Time\n";
  const total = swLaps.length;
  swLaps.forEach((lap, i) => {
    csv += `${total - i},${formatSwTime(lap.diff)},${formatSwTime(lap.total)}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clockivo-stopwatch-${new Date().getTime()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("CSV Exported");
}

