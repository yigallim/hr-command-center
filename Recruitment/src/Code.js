function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("index");
}

function sendOfferLetter(recipient_name, job_title, salary_amount, start_date, recipient_email) {
  try {
      generateOfferLetterPDF({
        date: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        recipient_name,
        job_title,
        salary_amount,
        start_date,
      }, recipient_email);
  } catch (error) {
    Logger.log(error.toString());
  }
}

function generateOfferLetterPDF(params, recipient_email) {
  const templateId = "1_ULWBmcCYT0U2eWpPKaakKzaWcyWoDYj7q7Fx4rDXJI";
  const template = DriveApp.getFileById(templateId);
  const copy = template.makeCopy();
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  for (let key in params) {
    body.replaceText(`{{${key}}}`, params[key]);
  }

  doc.saveAndClose();
  const blob = copy.getAs("application/pdf");
  const pdfBlob = Utilities.newBlob(blob.getBytes(), blob.getContentType(), "offer_letter.pdf");

  const subject = "Job Offer";
  const message = "Please find your job offer attached.";

  var options = {
    htmlBody: message,
    attachments: [pdfBlob],
  };

  MailApp.sendEmail(recipient_email, subject, "", options);
  DriveApp.getFileById(copy.getId()).setTrashed(true);
}


function getAppSheetData() {
  const appId = "14e08b42-30d9-49a7-acf2-9785c99adbfa";
  const apiKey = "your_api_key";
  const tableName = "Recruitment Budget";

  const url = `https://www.appsheet.com/api/v2/apps/${appId}/tables/${tableName}/Action`;

  const requestBody = {
    Action: "Find",
    Properties: {},
    Rows: [],
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      ApplicationAccessKey: apiKey,
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());

    const openPositions = data.filter(item => item.Status === "OPEN");
    Logger.log(openPositions);
    return openPositions;
  } catch (error) {
    Logger.log(`Error: ${error.message}`);
    return [];
  }
}

function sendScheduleInterview(recipient_name, recipient_email) {
  try {
    Logger.log("recipient_name: " + recipient_name);
    Logger.log("recipient_email: " + recipient_email);
    if (!recipient_name || !recipient_email) {
      throw new Error("Missing required parameters");
    }

    const subject = "Interview Invitation";
    const message = `Hi ${recipient_name},<br><br>
    We have reviewed your resume and would like to schedule an interview with you.<br>
    <a href="https://calendar.app.google/cTuUedd9zijdLSoBA">Book an appointment</a><br><br>
    Thanks.<br><br>
    Best regards,<br>
    Ragged Coders HR`;

    var options = {
      htmlBody: message,
    };

    MailApp.sendEmail(recipient_email, subject, "", options);
  } catch (error) {
    Logger.log(error.toString());
  }
}

function sendRejectionEmail(recipient_name, job_title, recipient_email) {
  try {
    Logger.log("recipient_name: " + recipient_name);
    Logger.log("job_title: " + job_title);
    Logger.log("recipient_email: " + recipient_email);

    if (!recipient_name || !job_title || !recipient_email) {
      throw new Error("Missing required parameters");
    }

    const subject = "Application for " + job_title + " Position";
    const message = `Dear ${recipient_name},<br><br>
    Thank you for applying for the ${job_title} position at Ragged Coders. We appreciate your interest in our company.<br><br>
    After careful consideration, we have decided to proceed with other candidates whose skills and experiences more closely match our needs.<br><br>
    We encourage you to apply for future openings and wish you success in your job search.<br><br>
    Best regards,<br><br>
    Ragged Coders HR`;


    var options = {
      htmlBody: message,
    };

    MailApp.sendEmail(recipient_email, subject, "", options);
  } catch (error) {
    Logger.log(error.toString());
  }
}
