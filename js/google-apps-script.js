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
//  5. Paste that URL into contact-form.js and tryout-form.js
//     where it says PASTE_YOUR_WEB_APP_URL_HERE
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const isReg = data.form_type === 'Registration';
    const tabName = isReg ? 'Registrations' : 'Tryouts';

    let tab = ss.getSheetByName(tabName);
    if (!tab) {
      tab = ss.insertSheet(tabName);
      writeHeaders(tab, isReg);
    }

    const now = Utilities.formatDate(
      new Date(), 'America/Chicago', 'MM/dd/yyyy HH:mm:ss'
    );

    if (isReg) {
      tab.appendRow([
        now,
        data.player_name,
        data.player_age,
        data.dob,
        data.player_level,
        data.parent_name,
        data.parent_phone,
        data.parent_email,
        data.medical_notes,
        data.goals,
        data.waiver
      ]);
    } else {
      tab.appendRow([
        now,
        data.player_name,
        data.player_age,
        data.dob,
        data.player_level,
        data.parent_name,
        data.parent_phone,
        data.parent_email,
        data.preferred_days,
        data.referral,
        data.medical_notes,
        data.goals,
        data.waiver
      ]);
    }

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
    'Medical Notes', 'Goals', 'Waiver'
  ];
  const tryoutHeaders = [
    'Submitted At', 'Player Name', 'Age', 'Date of Birth', 'Level',
    'Parent Name', 'Parent Phone', 'Parent Email',
    'Preferred Days', 'Referral', 'Medical Notes', 'Goals', 'Waiver'
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
