const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, last_name, email, phone, message } = req.body || {};

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const html = `
      <h2>New contact form message</h2>
      <p><b>Name:</b> ${name || ''} ${last_name || ''}</p>
      <p><b>Email:</b> ${email || ''}</p>
      <p><b>Phone:</b> ${phone || ''}</p>
      <p><b>Message:</b></p>
      <p>${(message || '').replace(/\n/g, '<br>')}</p>
    `;

    await transporter.sendMail({
      from: `"Sight‑Terp Contact" <${process.env.SMTP_USER}>`,
      to: 'contact@sightterp.com',
      replyTo: email || undefined,
      subject: 'New message from Sight‑Terp contact form',
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
};
// api/send-email.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { name, last_name, email, phone, message } = req.body || {};

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,      // smtp.hostinger.com
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,                     // SSL
      auth: {
        user: process.env.SMTP_USER,    // contact@sightterp.com
        pass: process.env.SMTP_PASS,    // app password (NOT your main password)
      },
    });

    const html = `
      <h2>New contact form message</h2>
      <p><b>Name:</b> ${name || ''} ${last_name || ''}</p>
      <p><b>Email:</b> ${email || ''}</p>
      <p><b>Phone:</b> ${phone || ''}</p>
      <p><b>Message:</b></p>
      <p>${(message || '').replace(/\n/g, '<br>')}</p>
    `;

    await transporter.sendMail({
      from: `"Sight‑Terp Contact" <${process.env.SMTP_USER}>`,
      to: 'contact@sightterp.com',
      replyTo: email || undefined,
      subject: 'New message from Sight‑Terp contact form',
      html,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
};