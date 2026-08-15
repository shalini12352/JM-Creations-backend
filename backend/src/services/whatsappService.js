const https = require("https");
const { URL } = require("url");

/**
 * Sends a WhatsApp notification for a new enquiry using Meta WhatsApp Cloud API.
 * @param {Object} enquiry - The saved enquiry object/document from MongoDB.
 * @returns {Promise<{ success: boolean, configured: boolean, message?: string, error?: string }>}
 */
const sendWhatsAppNotification = async (enquiry) => {
    try {
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const whatsappNumber = process.env.JM_CREATIONS_WHATSAPP_NUMBER;
        const apiBaseUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v18.0";

        // Check if WhatsApp service credentials are configured
        if (!accessToken || !phoneNumberId || !whatsappNumber) {
            console.log("WhatsApp service not configured");
            return {
                success: false,
                configured: false,
                message: "WhatsApp service not configured"
            };
        }

        const messageBody = `New JM Creations Enquiry

Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Service: ${enquiry.service}

Message:
${enquiry.message}

Enquiry ID:
${enquiry._id}`;

        const payload = JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: whatsappNumber,
            type: "text",
            text: {
                preview_url: false,
                body: messageBody
            }
        });

        const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/${phoneNumberId}/messages`;

        // Use global fetch if available, else fallback to node https module
        if (typeof fetch === "function") {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: payload
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                const errMsg = data?.error?.message || `HTTP ${response.status}`;
                console.error("WhatsApp API error response:", errMsg);
                return {
                    success: false,
                    configured: true,
                    error: errMsg
                };
            }

            console.log("WhatsApp notification sent successfully:", data?.messages?.[0]?.id || "OK");
            return {
                success: true,
                configured: true,
                data
            };
        } else {
            const parsedUrl = new URL(endpoint);
            return new Promise((resolve) => {
                const req = https.request(
                    parsedUrl,
                    {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                            "Content-Length": Buffer.byteLength(payload)
                        }
                    },
                    (res) => {
                        let responseData = "";
                        res.on("data", (chunk) => { responseData += chunk; });
                        res.on("end", () => {
                            try {
                                const parsed = JSON.parse(responseData);
                                if (res.statusCode >= 200 && res.statusCode < 300) {
                                    console.log("WhatsApp notification sent successfully");
                                    resolve({ success: true, configured: true, data: parsed });
                                } else {
                                    const errMsg = parsed?.error?.message || `HTTP ${res.statusCode}`;
                                    console.error("WhatsApp API error response:", errMsg);
                                    resolve({ success: false, configured: true, error: errMsg });
                                }
                            } catch (e) {
                                resolve({ success: false, configured: true, error: "Invalid API response" });
                            }
                        });
                    }
                );

                req.on("error", (err) => {
                    console.error("WhatsApp request error:", err.message);
                    resolve({ success: false, configured: true, error: err.message });
                });

                req.write(payload);
                req.end();
            });
        }
    } catch (error) {
        console.error("WhatsApp notification error:", error.message || error);
        return {
            success: false,
            configured: true,
            error: error.message || "Failed to send WhatsApp notification"
        };
    }
};

module.exports = {
    sendWhatsAppNotification
};
