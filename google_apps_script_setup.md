# Google Apps Script Setup for Brochure Download

To store the brochure download data (Name, Email, Mobile) in a Google Sheet, follow these steps:

## 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com).
2. Create a new sheet named `MindKraft Brochure Leads`.
3. In the first row, add the following headers:
   - Column A: `Timestamp`
   - Column B: `Name`
   - Column C: `Email`
   - Column D: `Mobile`

## 2. Create the Apps Script
1. In the Google Sheet, go to **Extensions > Apps Script**.
2. Delete any code in the editor and paste the following code:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get data from the request
  var data = JSON.parse(e.postData.contents);
  
  // Append row
  sheet.appendRow([
    new Date(), // Timestamp
    data.name,
    data.email,
    data.mobile
  ]);
  
  // Return success response
  return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy the Script
1. Click on the **Deploy** button (blue button top right) > **New deployment**.
2. Click the "Select type" gear icon > **Web app**.
3. Fill in the details:
   - **Description**: Brochure Download API
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (This is important!)
4. Click **Deploy**.
5. Authorize the script if prompted.
6. Copy the **Web App URL** (it starts with `https://script.google.com/macros/s/...`).

## 4. Update the Website Code
1. Open `brochure.js` in your project.
2. Find the line:
   ```javascript
   const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_PLACEHOLDER_YOUR_SCRIPT_ID_HERE/exec';
   ```
3. Replace the placeholder URL with your actual Web App URL.
4. Uncomment the `fetch` code block and remove the simulation code (setTimeout block) as instructed in the comments.

## 5. Upload the Brochure PDF
1. Ensure your brochure PDF file is named `MindKraft_Brochure.pdf`.
2. Place it in the `assets/` folder of your website.
