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
      html: `
          <div style="background-color:#dfe2e5; padding:20px; font-family:Arial, sans-serif;">
      <div style="max-width:700px; margin:auto; background:#fff; border-radius:8px; padding:40px; color:#333; line-height:1.6;">
        
        <!-- Logo -->
        <div margin-bottom:20px;">
          <img src="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/oldroblox.png" alt="OldrobloxCorp" style="height:40px;">
        </div>

        <!-- Message Body -->
        <p>Hi there,</p>

        <p>${message.replace(/\n/g, "<br>")}</p>

        <p>For assistance in the future, please make sure to contact us here: 
          <a href="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/support" style="color:#1155cc;">https://www.oldrobloxcorp.com/support</a>
        </p>

        <p>We appreciate your patience and will be responding to you soon.</p>

        <p>Sincerely,<br>
        Announcement Team<br>
        OldrobloxCorp</p>

        <!-- Footer Logo -->
        <div style="text-align:center; margin-top:30px;">
          <img src="https://oldrobloxcorpdatabaseplusxr-14932265.codehs.me/oldroblox.png" alt="OldrobloxCorp" style="height:35px;">
        </div>
      </div>
    </div>`
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
