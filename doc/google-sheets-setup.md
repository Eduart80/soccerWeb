# Google Sheets Form Integration

Connect the registration form on `contact.html` to a Google Sheet so every submission is saved as a row.

---

## Step 1 — Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Name it: `Eagle Stars Registrations`
3. Add these headers in row 1 (exact order matters):

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | First Name | Last Name | Age | Date of Birth | Parent Name | Parent Phone | Parent Email | Level | Medical Notes | Soccer Goals | Waiver |

---

## Step 2 — Create the Apps Script

1. In the sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.first_name,
    data.last_name,
    data.age,
    data.dob,
    data.parent_name,
    data.parent_phone,
    data.parent_email,
    data.level,
    data.medical_notes,
    data.soccer_goals,
    data.waiver
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (name the project anything, e.g. `EagleStarsForm`)

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon next to "Select type" → choose **Web app**
3. Set:
   - **Description**: `Eagle Stars Form Handler`
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** and follow the Google login prompts
6. Copy the **Web app URL** — looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Step 4 — Add the URL to contact.html

In `contact.html`, find this line in the script block:

```javascript
const SHEETS_URL = 'YOUR_APPS_SCRIPT_URL';
```

Replace `YOUR_APPS_SCRIPT_URL` with the URL you copied in Step 3.

---

## Step 5 — Test it

1. Open `contact.html` in a browser
2. Fill out and submit the form
3. Check the Google Sheet — a new row should appear within a few seconds

---

## Notes

- The Apps Script URL is safe to be public — it only accepts POST requests and only appends rows, it cannot read or delete data
- If you need to change the script later, go back to Apps Script and create a **new deployment** (do not edit the existing one) — then update the URL in contact.html
- Free Google account is sufficient — no billing required
- The sheet can be shared with others (coaches, admin) via normal Google Sheets sharing

---

## Current Status in contact.html

The form JS already has placeholders for both EmailJS and Google Sheets:

```javascript
emailjs.init('YOUR_PUBLIC_KEY');           // EmailJS public key
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)  // EmailJS IDs
const SHEETS_URL = 'YOUR_APPS_SCRIPT_URL'; // Google Apps Script URL
```

Once all three are filled in, every form submission will:
1. Save a row in Google Sheets
2. Send an email notification via EmailJS
