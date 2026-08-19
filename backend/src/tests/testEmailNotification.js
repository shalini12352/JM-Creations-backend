require("dotenv").config();
const { sendEmailNotification } = require("../services/emailService");

async function testEmail() {
  console.log("==========================================");
  console.log("TESTING BREVO SMTP EMAIL DELIVERY");
  console.log("==========================================");
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST || "smtp-relay.brevo.com");
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT || 587);
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "(Configured)" : "(NOT CONFIGURED)");
  console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "(Configured)" : "(NOT CONFIGURED)");
  console.log("NOTIFICATION RECIPIENT:", process.env.JM_CREATIONS_NOTIFICATION_EMAIL || "jmcreationinfo@gmail.com");
  console.log("------------------------------------------");

  const mockEnquiry = {
    _id: "test_" + Date.now(),
    name: "JM Creations Test User",
    email: "test.customer@example.com",
    phone: "+91 90429 86355",
    service: "Website Design & Development",
    message: "This is an automated test enquiry for verifying Brevo SMTP email notification delivery to jmcreationinfo@gmail.com.",
    createdAt: new Date()
  };

  const result = await sendEmailNotification(mockEnquiry);
  console.log("Test Result:", JSON.stringify(result, null, 2));

  if (result.success) {
    console.log("\n✅ Brevo SMTP Email Delivery Verified Successfully!");
  } else if (!result.configured) {
    console.log("\n⚠️ Brevo SMTP credentials not configured in backend/.env.");
    console.log("To complete email delivery, add EMAIL_USER and EMAIL_PASSWORD to backend/.env and re-run.");
  } else {
    console.log("\n❌ Brevo SMTP Error:", result.error);
  }
}

testEmail();
