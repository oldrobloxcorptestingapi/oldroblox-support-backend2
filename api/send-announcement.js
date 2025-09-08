import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // ⚠️ replace * with your frontend domain in production
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { recipients, subject, message } = req.body;

    // Validate inputs
    if (
      !Array.isArray(recipients) ||
      recipients.length === 0 ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({ success: false, error: "Missing or invalid fields" });
    }

    // Basic sanitization for HTML
    const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_PASS // set this in Vercel Environment Variables
      }
    });

    await transporter.sendMail({
      from: '"OldrobloxCorp" <no-reply@oldrobloxcorpdataconsole.work.gd>',
      to: recipients.join(","),
      subject,
      text: message,
      html: `<a href="https://oldrobloxcorpdataconsole.work.gd" target="_blank">
            <img src="https://oldrobloxcorpdataconsole.work.gd/oldroblox.png" alt="Oldroblox Logo" style="max-width:190px;">
          </a>
          <p>${safeMessage.replace(/\n/g, "<br>")}</p>
          <p> - OldrobloxCorp<p>
          <a href="https://oldrobloxcorpdataconsole.work.gd" target="_blank">
            <img src="https://oldrobloxcorpdataconsole.work.gd/oldroblox.png" alt="Oldroblox Logo" style="max-width:190px;">
          </a>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
