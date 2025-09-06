import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const { recipients, subject, message } = req.body;

    if (!recipients || !subject || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",       // Zoho SMTP
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd", 
        pass: process.env.ZOHO_PASS // Set this in Vercel Environment Variables
      }
    });

    // Send email
    await transporter.sendMail({
      from: '"OldrobloxCorp" <no-reply@oldrobloxcorpdataconsole.work.gd>',
      to: recipients.join(","),
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>` // converts line breaks to <br>
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
