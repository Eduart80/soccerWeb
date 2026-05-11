// ─────────────────────────────────────────────────────────────────────────────
// Eagle Stars Soccer Academy — Coach Schedule
//
// IMPORTANT: Set COACH_TOKEN to the same value as COACH_TOKEN in
//            google-apps-script.js  (default: 'eagles-coach-2026')
// ─────────────────────────────────────────────────────────────────────────────

const SHEETS_URL  = 'https://script.google.com/macros/s/AKfycbyQjVvBQaKi8K0JQUdLWcB4GzixkUR4JDJ3WOvFC9j_pAyfjg0dDoP7488MGQxplNX3/exec';
const COACH_TOKEN = 'eagles-coach-2026'; // must match COACH_TOKEN in Apps Script

// ── TEST MODE ─────────────────────────────────────────────────────────────────
// Set to true to use fake data (no sheet needed). Set to false for live data.
// NOTE: Live data requires HTTPS hosting (e.g. Netlify). Will not work from http://localhost.
const TEST_MODE = true;

// ── DB MODE ───────────────────────────────────────────────────────────────────
// Set to true to fetch from the Ionos MySQL database via /api/get-schedule.php.
// Set to false to use the Google Sheets JSONP source instead.
const DB_MODE    = true;
const DB_API_URL = '/api/get-schedule.php';

const FAKE_DATA = [
  { _sheet:'Registrations', _id:1, _table:'contact_registrations', 'Submitted At':'05/01/2026 09:12:00', 'Player Name':'Mateo Rivera',    'Age':8,  'Date of Birth':'2017-03-12', 'Level':'Beginner',         'Parent Name':'Carlos Rivera',   'Parent Phone':'4695551001', 'Parent Email':'carlos.r@email.com',   'Preferred Days':'Tuesday, Wednesday',  'Preferred Time':'6:15 - 7:15 PM',           'Assigned Coach':'Coach Lulzim',  'Medical Notes':'None',             'Goals':'Improve dribbling and confidence', 'Waiver':'Yes' },
  { _sheet:'Registrations', _id:2, _table:'contact_registrations', 'Submitted At':'05/02/2026 10:30:00', 'Player Name':'Sofia Nguyen',     'Age':10, 'Date of Birth':'2015-07-22', 'Level':'Intermediate',     'Parent Name':'Linda Nguyen',     'Parent Phone':'4695551002', 'Parent Email':'linda.n@email.com',    'Preferred Days':'Tuesday, Thursday',   'Preferred Time':'7:20 - 8:20 PM',           'Assigned Coach':'Coach Klaudio', 'Medical Notes':'Mild asthma',      'Goals':'First touch and passing',          'Waiver':'Yes' },
  { _sheet:'Registrations', _id:3, _table:'contact_registrations', 'Submitted At':'05/02/2026 11:05:00', 'Player Name':'Liam Torres',      'Age':12, 'Date of Birth':'2013-11-05', 'Level':'Private',          'Parent Name':'Maria Torres',     'Parent Phone':'4695551003', 'Parent Email':'maria.t@email.com',    'Preferred Days':'Friday',              'Preferred Time':'Private (7:20 - 8:20 PM)', 'Assigned Coach':'Coach Lulzim',  'Medical Notes':'None',             'Goals':'1v1 defending and shooting',       'Waiver':'Yes' },
  { _sheet:'Registrations', _id:4, _table:'contact_registrations', 'Submitted At':'05/03/2026 08:45:00', 'Player Name':'Aiden Park',       'Age':7,  'Date of Birth':'2018-01-30', 'Level':'Beginner',         'Parent Name':'James Park',       'Parent Phone':'4695551004', 'Parent Email':'james.p@email.com',    'Preferred Days':'Tuesday, Thursday',   'Preferred Time':'6:15 - 7:15 PM',           'Assigned Coach':'Coach Klaudio', 'Medical Notes':'Peanut allergy',   'Goals':'Ball control and fun',             'Waiver':'Yes' },
  { _sheet:'Registrations', _id:5, _table:'contact_registrations', 'Submitted At':'05/03/2026 14:20:00', 'Player Name':'Isabella Gomez',   'Age':11, 'Date of Birth':'2014-09-18', 'Level':'Intermediate',     'Parent Name':'Rosa Gomez',       'Parent Phone':'4695551005', 'Parent Email':'rosa.g@email.com',     'Preferred Days':'Tuesday, Thursday',   'Preferred Time':'7:20 - 8:20 PM',           'Assigned Coach':'Coach Lulzim',  'Medical Notes':'None',             'Goals':'Speed and stamina',                'Waiver':'Yes' },
  { _sheet:'Registrations', _id:6, _table:'contact_registrations', 'Submitted At':'05/04/2026 09:00:00', 'Player Name':'Noah Kim',         'Age':9,  'Date of Birth':'2016-05-14', 'Level':'Beginner',         'Parent Name':'Susan Kim',        'Parent Phone':'4695551006', 'Parent Email':'susan.k@email.com',    'Preferred Days':'Wednesday',           'Preferred Time':'6:15 - 7:15 PM',           'Assigned Coach':'',              'Medical Notes':'None',             'Goals':'Finishing and confidence',         'Waiver':'Yes' },
  { _sheet:'Registrations', _id:7, _table:'contact_registrations', 'Submitted At':'05/04/2026 15:10:00', 'Player Name':'Emma Davis',       'Age':13, 'Date of Birth':'2012-12-01', 'Level':'Private',          'Parent Name':'Paul Davis',        'Parent Phone':'4695551007', 'Parent Email':'paul.d@email.com',     'Preferred Days':'Friday',              'Preferred Time':'Private (6:15 - 7:15 PM)', 'Assigned Coach':'Coach Klaudio', 'Medical Notes':'None',             'Goals':'Tactical awareness',               'Waiver':'Yes' },
  { _sheet:'Registrations', _id:8, _table:'contact_registrations', 'Submitted At':'05/05/2026 10:00:00', 'Player Name':'Kol Doe',          'Age':5,  'Date of Birth':'2022-02-15', 'Level':'Beginner',         'Parent Name':'Milla Doe',        'Parent Phone':'1234567890', 'Parent Email':'zinaeduart@gmail.com', 'Preferred Days':'Tuesday, Thursday',   'Preferred Time':'6:15 - 7:15 PM',           'Assigned Coach':'Coach Lulzim',  'Medical Notes':'NA',               'Goals':'Running',                          'Waiver':'Yes' },
  { _sheet:'Tryouts',       _id:1, _table:'tryout_registrations',  'Submitted At':'05/05/2026 11:30:00', 'Player Name':'Lucas Martinez',   'Age':10, 'Date of Birth':'2015-04-08', 'Level':'Intermediate',     'Parent Name':'Ana Martinez',     'Parent Phone':'4695552001', 'Parent Email':'ana.m@email.com',      'Preferred Days':'Tuesday, Wednesday',  'Preferred Time':'7:20 - 8:20 PM',           'Assigned Coach':'Coach Klaudio', 'Medical Notes':'None',             'Goals':'Dribbling under pressure',         'Waiver':'Yes' },
  { _sheet:'Tryouts',       _id:2, _table:'tryout_registrations',  'Submitted At':'05/06/2026 09:15:00', 'Player Name':'Olivia Chen',      'Age':8,  'Date of Birth':'2017-08-25', 'Level':'Beginner',         'Parent Name':'Wei Chen',         'Parent Phone':'4695552002', 'Parent Email':'wei.c@email.com',      'Preferred Days':'Wednesday',           'Preferred Time':'6:15 - 7:15 PM',           'Assigned Coach':'',              'Medical Notes':'None',             'Goals':'Ball control and teamwork',        'Waiver':'Yes' },
  { _sheet:'Tryouts',       _id:3, _table:'tryout_registrations',  'Submitted At':'05/06/2026 13:00:00', 'Player Name':'Ethan Brown',      'Age':14, 'Date of Birth':'2011-06-17', 'Level':'Advanced',         'Parent Name':'Kevin Brown',      'Parent Phone':'4695552003', 'Parent Email':'kevin.b@email.com',    'Preferred Days':'Tuesday, Thursday',   'Preferred Time':'7:20 - 8:20 PM',           'Assigned Coach':'Coach Lulzim',  'Medical Notes':'Knee brace needed','Goals':'College prep / advanced tactics',   'Waiver':'Yes' },
  { _sheet:'Tryouts',       _id:4, _table:'tryout_registrations',  'Submitted At':'05/07/2026 08:30:00', 'Player Name':'Ava Wilson',       'Age':9,  'Date of Birth':'2016-10-03', 'Level':'Private',          'Parent Name':'Diane Wilson',     'Parent Phone':'4695552004', 'Parent Email':'diane.w@email.com',    'Preferred Days':'Friday',              'Preferred Time':'Private (6:15 - 7:15 PM)', 'Assigned Coach':'Coach Klaudio', 'Medical Notes':'None',             'Goals':'Fun and fitness',                  'Waiver':'Yes' },
  { _sheet:'Tryouts',       _id:5, _table:'tryout_registrations',  'Submitted At':'05/07/2026 16:45:00', 'Player Name':'Jackson Lee',      'Age':11, 'Date of Birth':'2014-02-20', 'Level':'Intermediate',     'Parent Name':'Grace Lee',        'Parent Phone':'4695552005', 'Parent Email':'grace.l@email.com',    'Preferred Days':'Thursday',            'Preferred Time':'Private (7:20 - 8:20 PM)', 'Assigned Coach':'',              'Medical Notes':'None',             'Goals':'Improve passing accuracy',         'Waiver':'Yes' },
];

const TIME_ORDER = [
  '6:15 - 7:15 PM',
  '7:20 - 8:20 PM',
  '6:15 - 7:15 PM',
  '7:20 - 8:20 PM'
];
const DAY_NAMES = ['Tuesday','Wednesday','Thursday','Friday'];
const COACHES   = ['Coach Lulzim', 'Coach Klaudio'];
const TRYOUT_DAYS = 7;

let allData   = [];
let activeTab = 'day'; // 'day' | 'all'

// ── LOGIN ────────────────────────────────────────────────────────────────────
document.getElementById('login-btn').addEventListener('click', handleLogin);
document.getElementById('pwd-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') handleLogin();
});

function handleLogin() {
  const pwd = document.getElementById('pwd-input').value;
  if (pwd === COACH_TOKEN) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    initDashboard();
  } else {
    document.getElementById('login-error').textContent = 'Incorrect access code. Try again.';
    document.getElementById('pwd-input').value = '';
    document.getElementById('pwd-input').focus();
  }
}

document.getElementById('logout-btn').addEventListener('click', function() {
  allData    = [];
  activeTab  = 'day';
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('pwd-input').value = '';
  document.getElementById('login-error').textContent = '';
});

// ── DASHBOARD INIT ───────────────────────────────────────────────────────────
function initDashboard() {
  const picker = document.getElementById('date-picker');
  picker.value = todayStr();
  updateDateLabel();
  fetchData();

  picker.addEventListener('change', function() { updateDateLabel(); renderSchedule(); });
  document.getElementById('prev-day').addEventListener('click', function() { changeDay(-1); });
  document.getElementById('next-day').addEventListener('click', function() { changeDay(1); });
  document.getElementById('today-btn').addEventListener('click', function() {
    document.getElementById('date-picker').value = todayStr();
    updateDateLabel();
    renderSchedule();
  });
  document.getElementById('refresh-btn').addEventListener('click', fetchData);

  document.getElementById('tab-day').addEventListener('click', function() {
    activeTab = 'day';
    document.getElementById('tab-day').classList.add('active');
    document.getElementById('tab-all').classList.remove('active');
    document.getElementById('date-nav') && (document.querySelector('.date-nav').style.opacity = '1');
    renderSchedule();
  });
  document.getElementById('tab-all').addEventListener('click', function() {
    activeTab = 'all';
    document.getElementById('tab-all').classList.add('active');
    document.getElementById('tab-day').classList.remove('active');
    renderSchedule();
  });
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}

function changeDay(delta) {
  const picker = document.getElementById('date-picker');
  const d = new Date(picker.value + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  picker.value = y + '-' + m + '-' + day;
  updateDateLabel();
  renderSchedule();
}

function updateDateLabel() {
  const picker = document.getElementById('date-picker');
  const d = new Date(picker.value + 'T12:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('date-label').textContent = d.toLocaleDateString('en-US', options);
}

// ── FETCH DATA ───────────────────────────────────────────────────────────────
function fetchData() {
  const content = document.getElementById('schedule-content');
  const status  = document.getElementById('status-bar');
  content.innerHTML = '<div class="loading">Loading schedule…</div>';

  if (TEST_MODE) {
    allData = FAKE_DATA;
    status.textContent = '⚠️ TEST MODE — ' + allData.length + ' fake records loaded. Set TEST_MODE = false for live data.';
    renderSchedule();
    return;
  }

  status.textContent = 'Fetching data…';

  // ── DB path (Ionos MySQL via PHP) ─────────────────────────────────────────
  if (DB_MODE) {
    fetch(DB_API_URL + '?token=' + encodeURIComponent(COACH_TOKEN))
      .then(function(response) {
        if (!response.ok) { throw new Error('HTTP ' + response.status); }
        return response.json();
      })
      .then(function(res) {
        if (res && res.status === 'ok') {
          allData = res.data;
          status.textContent = allData.length + ' total record' + (allData.length !== 1 ? 's' : '') + ' loaded from database.';
          renderSchedule();
        } else {
          status.textContent = '';
          content.innerHTML = '<div class="empty-state">Access denied — check that COACH_TOKEN matches in schedule.js and api/get-schedule.php.</div>';
        }
      })
      .catch(function() {
        status.textContent = '';
        content.innerHTML = '<div class="empty-state">Could not reach the database API. Check that api/get-schedule.php is uploaded to your Ionos server.</div>';
      });
    return;
  }

  // ── Google Sheets JSONP path ───────────────────────────────────────────────
  var old = document.getElementById('jsonp-script');
  if (old) old.parentNode.removeChild(old);

  window.__scheduleCallback = function(res) {
    var s = document.getElementById('jsonp-script');
    if (s) s.parentNode.removeChild(s);
    delete window.__scheduleCallback;
    if (res && res.status === 'ok') {
      allData = res.data;
      status.textContent = allData.length + ' total record' + (allData.length !== 1 ? 's' : '') + ' loaded.';
      renderSchedule();
    } else {
      status.textContent = '';
      content.innerHTML = '<div class="empty-state">Access denied — check that COACH_TOKEN matches in both files and the script is redeployed.</div>';
    }
  };

  var script    = document.createElement('script');
  script.id     = 'jsonp-script';
  script.src    = SHEETS_URL + '?token=' + encodeURIComponent(COACH_TOKEN) + '&callback=__scheduleCallback';
  script.onerror = function() {
    delete window.__scheduleCallback;
    status.textContent = '';
    content.innerHTML = '<div class="empty-state">Could not reach the Apps Script. Check your internet connection and that the deployment is live.</div>';
  };
  document.head.appendChild(script);
}

// ── RENDER SCHEDULE ──────────────────────────────────────────────────────────
function renderSchedule() {
  const content = document.getElementById('schedule-content');

  if (activeTab === 'all') {
    renderAll(content);
  } else {
    renderDay(content);
  }
}

// Day View — players whose Preferred Days includes the selected weekday
function renderDay(content) {
  const picker  = document.getElementById('date-picker');
  const d       = new Date(picker.value + 'T12:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });

  const withDay = allData.filter(function(row) {
    if (row._sheet === 'Tryouts' && isExpired(row)) return false;
    const days = String(row['Preferred Days'] || '').trim();
    return days !== '' && days.split(',').map(function(s){ return s.trim(); }).indexOf(dayName) !== -1;
  });
  const noDay = allData.filter(function(row) {
    if (row._sheet === 'Tryouts' && isExpired(row)) return false;
    return String(row['Preferred Days'] || '').trim() === '';
  });

  if (withDay.length === 0 && noDay.length === 0) {
    content.innerHTML = '<div class="empty-state">No records found for ' + dayName + '.</div>';
    return;
  }

  var html = '';

  if (withDay.length > 0) {
    html += renderTimeGroups(withDay);
  }

  if (noDay.length > 0) {
    html += '<div class="time-group">';
    html += '<div class="time-heading" style="border-color:#444;color:var(--muted);">'
          + '<span class="time-icon">&#9888;</span> No Day / Time Set'
          + '<span class="count-badge" style="background:#444;">' + noDay.length + '</span></div>';
    html += '<div class="cards">' + renderCards(noDay) + '</div></div>';
  }

  content.innerHTML = html || '<div class="empty-state">No players prefer ' + dayName + '.</div>';
}

// All Players View — everyone, grouped by Registration vs Tryout
function renderAll(content) {
  if (allData.length === 0) {
    content.innerHTML = '<div class="empty-state">No records found in the sheet.</div>';
    return;
  }

  var regs    = allData.filter(function(r){ return r._sheet === 'Registrations'; });
  var tryouts = allData.filter(function(r){ return r._sheet === 'Tryouts' && !isExpired(r); });
  var html    = '';

  if (regs.length > 0) {
    html += '<div class="time-group">';
    html += '<div class="time-heading"><span class="time-icon">&#9917;</span> Registrations'
          + '<span class="count-badge">' + regs.length + '</span></div>';
    html += '<div class="cards">' + renderCards(regs) + '</div></div>';
  }
  if (tryouts.length > 0) {
    html += '<div class="time-group">';
    html += '<div class="time-heading"><span class="time-icon">&#128203;</span> Tryouts'
          + '<span class="count-badge">' + tryouts.length + '</span></div>';
    html += '<div class="cards">' + renderCards(tryouts) + '</div></div>';
  }

  content.innerHTML = html;
}

// Group an array of rows by Preferred Time, sorted in TIME_ORDER
function renderTimeGroups(rows) {
  var groups = {};
  rows.forEach(function(row) {
    var time = String(row['Preferred Time'] || 'No Time Specified').trim() || 'No Time Specified';
    if (!groups[time]) groups[time] = [];
    groups[time].push(row);
  });

  var sortedTimes = Object.keys(groups).sort(function(a, b) {
    var ai = TIME_ORDER.indexOf(a);
    var bi = TIME_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  var html = '';
  sortedTimes.forEach(function(time) {
    var records = groups[time];
    html += '<div class="time-group">';
    html += '<div class="time-heading"><span class="time-icon">⏰</span>' + esc(time)
          + '<span class="count-badge">' + records.length + '</span></div>';
    html += '<div class="cards">' + renderCards(records) + '</div></div>';
  });
  return html;
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function isExpired(row) {
  if (!row['Submitted At']) return false;
  var submitted = new Date(row['Submitted At']);
  var diffDays  = Math.floor((Date.now() - submitted.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays > TRYOUT_DAYS;
}

function daysLeft(row) {
  if (!row['Submitted At']) return null;
  var submitted = new Date(row['Submitted At']);
  return TRYOUT_DAYS - Math.floor((Date.now() - submitted.getTime()) / (1000 * 60 * 60 * 24));
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── BUILD PLAYER CARDS ────────────────────────────────────────────────────────
function renderCards(records) {
  var html = '';
  records.forEach(function(row) {
    var isReg  = row._sheet === 'Registrations';
    var isTry  = row._sheet === 'Tryouts';
    var phone  = String(row['Parent Phone'] || '').replace(/\D/g, '');
    var level  = String(row['Level']        || '—');
    var age    = String(row['Age']          || '—');
    var days   = String(row['Preferred Days'] || '—');
    var time   = String(row['Preferred Time'] || '—');
    var coach  = String(row['Assigned Coach'] || '').trim();
    var rowId  = row._id    || 0;
    var table  = row._table || '';

    html += '<div class="player-card" data-id="' + rowId + '" data-table="' + esc(table) + '">';
    html += '<div class="card-top">';
    html += '<div class="player-name">' + esc(row['Player Name'] || '—') + '</div>';
    html += '<span class="type-badge ' + (isReg ? 'badge-reg' : 'badge-try') + '">'
          + (isReg ? 'Registration' : 'Tryout') + '</span>';
    html += '</div>';
    html += '<div class="card-details">';
    html += '<span>Age: <strong>' + esc(age) + '</strong></span>';
    html += '<span>Level: <strong>' + esc(level) + '</strong></span>';
    html += '</div>';
    html += '<div class="card-days">📅 ' + esc(days) + ' &nbsp;&#9679;&nbsp; ⏰ ' + esc(time) + '</div>';

    // Coach assign dropdown
    var opts = '<option value="">&#8212; Unassigned &#8212;</option>';
    COACHES.forEach(function(c) {
      opts += '<option value="' + esc(c) + '"' + (coach === c ? ' selected' : '') + '>' + esc(c) + '</option>';
    });
    html += '<div class="card-coach-row">'
          + '<select class="coach-select" name="assigned_coach_' + rowId + '" id="coach_' + rowId + '_' + esc(table) + '">' + opts + '</select>'
          + '<button class="coach-save-btn" onclick="saveCoach(this)">Save</button>'
          + '<span class="coach-save-status"></span>'
          + '</div>';

    // Tryout expiry countdown + convert button
    if (isTry) {
      var left    = daysLeft(row);
      var urgency = left !== null && left <= 2 ? 'color:#e74c3c;font-weight:700;' : 'color:#f39c12;';
      var leftStr = left !== null ? left + ' day' + (left !== 1 ? 's' : '') + ' left' : '';
      html += '<div class="tryout-actions">';
      if (leftStr) {
        html += '<span class="tryout-expiry" style="' + urgency + '">⏳ ' + leftStr + ' to convert</span>';
      }
      html += '<button class="convert-btn" onclick="convertToRegistration(this)">&#10003; Convert to Registration</button>';
      html += '</div>';
    }

    html += '<div class="card-parent">' + esc(row['Parent Name'] || '') + '</div>';
    if (phone) {
      html += '<a class="card-phone" href="tel:+1' + phone + '">📞 '
            + esc(String(row['Parent Phone'])) + '</a>';
    }
    html += '</div>';
  });
  return html;
}

// ── SAVE COACH ────────────────────────────────────────────────────────────────
function saveCoach(btn) {
  var card   = btn.closest('.player-card');
  var id     = parseInt(card.dataset.id, 10);
  var table  = card.dataset.table;
  var select = card.querySelector('.coach-select');
  var status = card.querySelector('.coach-save-status');
  var coach  = select.value;

  if (!id || !table) {
    status.textContent = '(test mode)';
    status.style.color = '#888';
    return;
  }

  btn.disabled = true;
  status.textContent = 'Saving…';
  status.style.color = '#888';

  fetch('/api/update-coach.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: COACH_TOKEN, id: id, table: table, coach: coach })
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (res.success) {
      status.textContent = '✓ Saved';
      status.style.color = '#27ae60';
    } else {
      status.textContent = '✗ Failed';
      status.style.color = '#e74c3c';
    }
  })
  .catch(function() {
    status.textContent = '✗ Error';
    status.style.color = '#e74c3c';
  })
  .finally(function() { btn.disabled = false; });
}

// ── CONVERT TRYOUT TO REGISTRATION ───────────────────────────────────────────
function convertToRegistration(btn) {
  var card = btn.closest('.player-card');
  var id   = parseInt(card.dataset.id, 10);

  if (!id) {
    alert('(test mode — no action taken)');
    return;
  }

  if (!confirm('Convert this tryout to a full registration?')) return;

  btn.disabled = true;
  btn.textContent = 'Converting…';

  fetch('/api/convert-tryout.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: COACH_TOKEN, id: id })
  })
  .then(function(r) { return r.json(); })
  .then(function(res) {
    if (res.success) {
      card.style.opacity = '0.4';
      card.style.pointerEvents = 'none';
      btn.textContent = '✓ Converted';
    } else {
      btn.disabled = false;
      btn.textContent = '✓ Convert to Registration';
      alert('Failed: ' + (res.error || 'unknown error'));
    }
  })
  .catch(function() {
    btn.disabled = false;
    btn.textContent = '✓ Convert to Registration';
    alert('Network error — try again.');
  });
}
