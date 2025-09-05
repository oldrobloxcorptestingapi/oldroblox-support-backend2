import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Always set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Reject other methods
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { recipients, subject, message } = req.body;

    if (!recipients || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_PASS, // must be set in Vercel env vars
      },
    });

    // Send email
    await transporter.sendMail({
      from: "no-reply@oldrobloxcorpdataconsole.work.gd",
      bcc: recipients,
      subject,
      html: `<p>${message}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
