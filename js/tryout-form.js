const EMAILJS_SERVICE          = 'service_kvekqai';
const EMAILJS_TEMPLATE_WELCOME = 'template_rxcawui';
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyZ6OpoP4zFFmXZDxvjviS9WrMxaHJ9TIDLFI8dpwtgNhq30k8IRFM5uY3dYgVtzkhaWg/exec';
const DB_API_URL = '/api/save-tryout.php'; // Ionos MySQL endpoint

function saveToDB(payload) {
  return fetch(DB_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(res) { return res.json(); })
  .catch(function() { return { success: false }; });
}

function saveToSheets(payload) {
  if (!SHEETS_URL || SHEETS_URL === 'PASTE_YOUR_WEB_APP_URL_HERE') return;
  fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(function() {});
}

document.getElementById('tryout-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn    = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const f = this;
  const levelVal = f['Player Level'].value;
  function getDaysFromLevel(lvl) {
    if (lvl === 'Private') return 'Friday';
    return 'Monday, Tuesday, Wednesday, Thursday';
  }
  function getTimeFromLevel(lvl) {
    if (lvl === 'Advanced') return '7:20 - 8:20 PM';
    if (lvl === 'Private') return 'Private (6:15 - 7:15 PM / 7:20 - 8:20 PM)';
    return '6:15 - 7:15 PM';
  }
  const data = {
    first_name:     f['Player First Name'].value,
    last_name:      f['Player Last Name'].value,
    age:            f['Player Age'].value,
    dob:            f['Date of Birth'].value,
    parent_name:    f['Parent Guardian Name'].value,
    parent_phone:   f['Parent Phone'].value,
    parent_email:   f['Parent Email'].value,
    level:          levelVal,
    preferred_days: getDaysFromLevel(levelVal),
    preferred_time: getTimeFromLevel(levelVal),
    referral:       f['How Did You Hear'].value,
    medical_notes:  f['Medical Notes'].value,
    goals:          f['Goals'].value,
    waiver:         f['Waiver Accepted'].checked ? 'Yes' : 'No',
    form_type:      'Session Booked'
  };

  const emailData = {
    form_type:      data.form_type,
    to_name:        data.parent_name,
    to_email:       data.parent_email,
    player_name:    data.first_name + ' ' + data.last_name,
    player_age:     data.age,
    player_level:   data.level,
    parent_phone:   data.parent_phone,
    preferred_days:   data.preferred_days,
    preferred_time:   data.preferred_time,
    selected_package: f['Selected Package'].value || 'Free Tryout Session',
    referral:         data.referral,
    goals:            data.goals,
    medical_notes:    data.medical_notes,
    waiver:           data.waiver,
    reply_to:         data.parent_email
  };

  saveToDB({
    first_name:     data.first_name,
    last_name:      data.last_name,
    age:            data.age,
    dob:            data.dob,
    parent_name:    data.parent_name,
    parent_phone:   data.parent_phone,
    parent_email:   data.parent_email,
    level:          data.level,
    preferred_days: data.preferred_days,
    preferred_time: data.preferred_time,
    referral:       data.referral,
    medical_notes:  data.medical_notes,
    goals:          data.goals,
    waiver:         data.waiver
  });

  saveToSheets({
    form_type:      'Session Booked',
    player_name:    data.first_name + ' ' + data.last_name,
    player_age:     data.age,
    dob:            data.dob,
    player_level:   data.level,
    parent_name:    data.parent_name,
    parent_phone:   data.parent_phone,
    parent_email:   data.parent_email,
    preferred_days: data.preferred_days,
    preferred_time: data.preferred_time,
    referral:       data.referral,
    medical_notes:  data.medical_notes,
    goals:          data.goals,
    waiver:         data.waiver
  });

  emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE_WELCOME, emailData)
    .then(function() {
      status.style.color = '#16a34a';
      status.textContent = 'Request received! We will contact you shortly to schedule your free tryout.';
      btn.textContent = 'Sent!';
      f.reset();
    })
    .catch(function() {
      status.style.color = '#cc1e2e';
      status.textContent = 'Something went wrong. Please email us directly at info.eaglestars.sc@gmail.com';
      btn.disabled = false;
      btn.textContent = 'Submit & Claim Free Tryout';
    });
});
