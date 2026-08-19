const nodemailer = require("nodemailer");

/**
 * Sends an email notification for a new enquiry via Brevo SMTP.
 * @param {Object} enquiry - The saved enquiry object/document from MongoDB.
 * @returns {Promise<{ success: boolean, configured: boolean, messageId?: string, error?: string, message?: string }>}
 */
const sendEmailNotification = async (enquiry) => {
    try {
        const host = process.env.EMAIL_HOST || "smtp-relay.brevo.com";
        const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASSWORD;
        const recipient = process.env.JM_CREATIONS_NOTIFICATION_EMAIL || "jmcreationinfo@gmail.com";

        // Check if email service credentials are configured
        if (!user || !pass) {
            console.log("[EMAIL SERVICE] Brevo SMTP credentials not configured in environment (EMAIL_USER / EMAIL_PASSWORD missing)");
            return {
                success: false,
                configured: false,
                message: "Brevo SMTP credentials not configured in environment"
            };
        }

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === 465,
            auth: {
                user: user,
                pass: pass
            }
        });

        const createdAtStr = enquiry.createdAt
            ? new Date(enquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
            : new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry — JM Creations</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #131313; color: #ffffff; margin: 0; padding: 20px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #1b1b1b; border: 1px solid #333333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
    <!-- Header -->
    <tr>
      <td style="background-color: #0e0e0e; padding: 24px; text-align: center; border-bottom: 2px solid #EAB308;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px;">JM CREATIONS</h1>
        <p style="color: #FFD165; margin: 6px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 2px;">New Website Enquiry Notification</p>
      </td>
    </tr>
    <!-- Content Body -->
    <tr>
      <td style="padding: 24px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td width="35%" style="color: #A3A3A3; font-size: 13px; font-weight: bold;">Customer Name:</td>
            <td style="color: #ffffff; font-size: 15px; font-weight: bold;">${enquiry.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="color: #A3A3A3; font-size: 13px; font-weight: bold;">Email Address:</td>
            <td style="color: #FFD165; font-size: 14px;"><a href="mailto:${enquiry.email}" style="color: #FFD165; text-decoration: none;">${enquiry.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="color: #A3A3A3; font-size: 13px; font-weight: bold;">Phone Number:</td>
            <td style="color: #ffffff; font-size: 14px;"><a href="tel:${enquiry.phone}" style="color: #ffffff; text-decoration: none;">${enquiry.phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="color: #A3A3A3; font-size: 13px; font-weight: bold;">Required Service:</td>
            <td style="color: #EAB308; font-size: 14px; font-weight: bold;">${enquiry.service}</td>
          </tr>
          <tr style="border-bottom: 1px solid #2a2a2a;">
            <td style="color: #A3A3A3; font-size: 13px; font-weight: bold;">Submission Date:</td>
            <td style="color: #cccccc; font-size: 13px;">${createdAtStr}</td>
          </tr>
          <tr>
            <td style="color: #A3A3A3; font-size: 13px; font-weight: bold;">Enquiry Status:</td>
            <td style="color: #10B981; font-size: 13px; font-weight: bold;">New</td>
          </tr>
        </table>
        
        <!-- Customer Message Box -->
        <div style="margin-top: 24px; padding: 18px; background-color: #131313; border-left: 4px solid #EAB308; border-radius: 6px;">
          <p style="color: #A3A3A3; margin: 0 0 8px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Customer Message:</p>
          <p style="color: #ffffff; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${enquiry.message}</p>
        </div>
        
        <p style="color: #666666; font-size: 11px; margin-top: 24px; text-align: center;">Enquiry ID: ${enquiry._id}</p>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="background-color: #0e0e0e; padding: 16px; text-align: center; border-top: 1px solid #222222;">
        <p style="color: #888888; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} JM Creations. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
        `;

        const mailOptions = {
            from: `"JM Creations Website" <${user}>`,
            to: recipient,
            subject: "New Website Enquiry — JM Creations",
            text: `JM CREATIONS — NEW WEBSITE ENQUIRY

Customer Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Service: ${enquiry.service}

Message:
${enquiry.message}

Submission Date: ${createdAtStr}
Enquiry Status: New
Enquiry ID: ${enquiry._id}`,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("[EMAIL SERVICE SUCCESS] Brevo SMTP notification delivered. Message ID:", info.messageId);

        return {
            success: true,
            configured: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error("[EMAIL SERVICE ERROR] Brevo SMTP notification delivery failed:", error.message || error);
        return {
            success: false,
            configured: true,
            error: error.message || "Failed to send email notification"
        };
    }
};

module.exports = {
    sendEmailNotification
};
