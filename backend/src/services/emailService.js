const nodemailer = require("nodemailer");

/**
 * Sends an email notification for a new enquiry.
 * @param {Object} enquiry - The saved enquiry object/document from MongoDB.
 * @returns {Promise<{ success: boolean, configured: boolean, message?: string, error?: string }>}
 */
const sendEmailNotification = async (enquiry) => {
    try {
        const host = process.env.EMAIL_HOST || "smtp.gmail.com";
        const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASSWORD;
        const recipient = process.env.JM_CREATIONS_NOTIFICATION_EMAIL;

        // Check if email service credentials are configured
        if (!user || !pass || !recipient) {
            console.log("Email service not configured");
            return {
                success: false,
                configured: false,
                message: "Email service not configured"
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
            ? new Date(enquiry.createdAt).toISOString()
            : new Date().toISOString();

        const mailOptions = {
            from: `"JM Creations" <${user}>`,
            to: recipient,
            subject: "New JM Creations Enquiry",
            text: `New Customer Enquiry

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Service: ${enquiry.service}

Message:
${enquiry.message}

Enquiry ID:
${enquiry._id}

Created At:
${createdAtStr}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Gmail notification sent successfully:", info.messageId);

        return {
            success: true,
            configured: true,
            messageId: info.messageId
        };
    } catch (error) {
        console.error("Email notification error:", error.message || error);
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
