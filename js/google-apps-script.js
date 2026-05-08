// ─────────────────────────────────────────────────────────────────────────────
// Eagle Stars Soccer Academy — Google Apps Script
//
// HOW TO SET UP:
//  1. Go to https://script.google.com  →  New Project
//  2. Delete everything in the editor, paste this entire file
//  3. Click Deploy → New Deployment
//       Type: Web App
//       Execute as: Me
//       Who has access: Anyone
//  4. Click Deploy → copy the Web App URL
//  5. Paste that URL into contact-form.js, tryout-form.js, and js/schedule.js
//     where it says PASTE_YOUR_WEB_APP_URL_HERE
//
// COACH SCHEDULE:
//  Set COACH_TOKEN below to a private password, then set the same value in
//  js/schedule.js so the coach dashboard can fetch data.
// ─────────────────────────────────────────────────────────────────────────────

const COACH_TOKEN = 'eagles-coach-2026'; // ← change to your own private password

function doPost(e) {
  try {
    if (!e || !e.postData) return ContentService.createTextOutput('doPost called without parameters (editor test only)').setMimeType(ContentService.MimeType.TEXT);
    const data    = JSON.parse(e.postData.contents);
    const ss      = SpreadsheetApp.getActiveSpreadsheet();
    const isReg   = data.form_type === 'Registration';
    const tabName = isReg ? 'Registrations' : 'Tryouts';

    let tab = ss.getSheetByName(tabName);
    if (!tab) {
      tab = ss.insertSheet(tabName);
      writeHeaders(tab, isReg);
    } else {
      ensureColumns(tab, isReg); // add any missing columns to existing sheet
    }

    const now = Utilities.formatDate(
      new Date(), 'America/Chicago', 'MM/dd/yyyy HH:mm:ss'
    );

    const rowData = isReg ? {
      'Submitted At':   now,
      'Player Name':    data.player_name,
      'Age':            data.player_age,
      'Date of Birth':  data.dob,
      'Level':          data.player_level,
      'Parent Name':    data.parent_name,
      'Parent Phone':   data.parent_phone,
      'Parent Email':   data.parent_email,
      'Preferred Days': data.preferred_days  || '',
      'Preferred Time': data.preferred_time  || '',
      'Medical Notes':  data.medical_notes,
      'Goals':          data.goals,
      'Waiver':         data.waiver
    } : {
      'Submitted At':   now,
      'Player Name':    data.player_name,
      'Age':            data.player_age,
      'Date of Birth':  data.dob,
      'Level':          data.player_level,
      'Parent Name':    data.parent_name,
      'Parent Phone':   data.parent_phone,
      'Parent Email':   data.parent_email,
      'Preferred Days': data.preferred_days  || '',
      'Preferred Time': data.preferred_time  || '',
      'Referral':       data.referral,
      'Medical Notes':  data.medical_notes,
      'Goals':          data.goals,
      'Waiver':         data.waiver
    };

    appendRowByHeaders(tab, rowData);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeHeaders(tab, isRegistration) {
  const regHeaders = [
    'Submitted At', 'Player Name', 'Age', 'Date of Birth', 'Level',
    'Parent Name', 'Parent Phone', 'Parent Email',
    'Preferred Days', 'Preferred Time', 'Assigned Coach', 'Medical Notes', 'Goals', 'Waiver'
  ];
  const tryoutHeaders = [
    'Submitted At', 'Player Name', 'Age', 'Date of Birth', 'Level',
    'Parent Name', 'Parent Phone', 'Parent Email',
    'Preferred Days', 'Preferred Time', 'Referral', 'Assigned Coach', 'Medical Notes', 'Goals', 'Waiver'
  ];
  const headers = isRegistration ? regHeaders : tryoutHeaders;
  tab.appendRow(headers);

  // Bold + freeze the header row
  const headerRange = tab.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1a73e8');
  headerRange.setFontColor('#ffffff');
  tab.setFrozenRows(1);
}

// Adds any columns that exist in the expected list but are missing from the sheet.
// Runs automatically on existing sheets so old data is preserved and new columns appear.
function ensureColumns(tab, isReg) {
  const required = isReg
    ? ['Submitted At','Player Name','Age','Date of Birth','Level',
       'Parent Name','Parent Phone','Parent Email',
       'Preferred Days','Preferred Time','Assigned Coach','Medical Notes','Goals','Waiver']
    : ['Submitted At','Player Name','Age','Date of Birth','Level',
       'Parent Name','Parent Phone','Parent Email',
       'Preferred Days','Preferred Time','Referral','Assigned Coach','Medical Notes','Goals','Waiver'];

  const lastCol   = tab.getLastColumn();
  const headerRow = tab.getRange(1, 1, 1, lastCol).getValues()[0];

  required.forEach(function(col) {
    if (headerRow.indexOf(col) === -1) {
      const newColIdx = tab.getLastColumn() + 1;
      const cell = tab.getRange(1, newColIdx);
      cell.setValue(col);
      cell.setFontWeight('bold');
      cell.setBackground('#1a73e8');
      cell.setFontColor('#ffffff');
      headerRow.push(col); // keep local copy in sync
    }
  });
}

// Writes a data object to the next row, matching values to column headers by name.
// This means column order in the sheet never matters.
function appendRowByHeaders(tab, data) {
  const lastCol = tab.getLastColumn();
  const headers = tab.getRange(1, 1, 1, lastCol).getValues()[0];
  const row     = headers.map(function(h) {
    return data[h] !== undefined ? data[h] : '';
  });
  tab.appendRow(row);
}

// ── COACH SCHEDULE — read all registrations & tryouts ────────────────────────
function doGet(e) {
  if (!e) return ContentService.createTextOutput('doGet called without parameters (editor test only)').setMimeType(ContentService.MimeType.TEXT);
  const token    = (e.parameter && e.parameter.token)    ? e.parameter.token    : '';
  const callback = (e.parameter && e.parameter.callback) ? e.parameter.callback : '';

  if (token !== COACH_TOKEN) {
    const denied = JSON.stringify({ status: 'unauthorized' });
    const out    = callback ? callback + '(' + denied + ')' : denied;
    return ContentService
      .createTextOutput(out)
      .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
  }

  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const result = [];

  ['Registrations', 'Tryouts'].forEach(function(tabName) {
    const tab = ss.getSheetByName(tabName);
    if (!tab) return;
    const rows = tab.getDataRange().getValues();
    if (rows.length < 2) return;
    const headers = rows[0];
    for (let i = 1; i < rows.length; i++) {
      const row = { _sheet: tabName };
      headers.forEach(function(h, j) { row[h] = rows[i][j]; });
      result.push(row);
    }
  });

  const json = JSON.stringify({ status: 'ok', data: result });
  const out  = callback ? callback + '(' + json + ')' : json;
  return ContentService
    .createTextOutput(out)
    .setMimeType(callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON);
}
