function atEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const rowNumber = range.getRow();
  const rowValues = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
  Logger.log(rowValues);
  addDataToAppSheet(rowValues[1], rowValues[3], rowValues[2], rowValues[4]);
}

function addDataToAppSheet(positionId, applicantEmail, applicantName, resumeLink) {
  const appId = "14e08b42-30d9-49a7-acf2-9785c99adbfa";
  const apiKey = "your_api_key";
  const tableName = "Recruitment Applicants";

  const url = `https://www.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  const requestBody = {
    Action: "Add",
    Properties: {
      Locale: "en-US"
    },
    Rows: [
      {
        "Position Id": positionId,
        "Applicant": applicantEmail,
        "Applicant Name": applicantName,
        "Resume": resumeLink,
        "Stage": "INITIAL",
      }
    ],
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "ApplicationAccessKey": apiKey,
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    if (responseCode === 200) {
      const data = JSON.parse(responseBody);
      return data;
    } else {
      Logger.log(`Error: Unexpected response code ${responseCode}`);
      return null;
    }
  } catch (error) {
    Logger.log(`Error: ${error.message}`);
    return null;
  }
}

function generateUniqueId() {
  return Utilities.getUuid();
}
