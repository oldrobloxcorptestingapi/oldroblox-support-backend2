import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { recipients, subject, message } = req.body;
    if (!recipients || !subject || !message)
      return res.status(400).json({ error: "Missing fields" });

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "no-reply@oldrobloxcorpdataconsole.work.gd",
        pass: process.env.ZOHO_PASS, // Use Zoho App Password here
      },
    });

    await transporter.sendMail({
      from: '"OldrobloxCorp" <no-reply@oldrobloxcorpdataconsole.work.gd>',
      to: recipients.join(", "),
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
