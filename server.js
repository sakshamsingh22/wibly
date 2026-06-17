import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wibly2025';
const DATA_DIR = join(__dirname, 'server-data');
const DATA_FILE = join(DATA_DIR, 'submissions.json');

// ── Email Config ──
// Set these environment variables to enable email notifications:
//   EMAIL_USER     = your Gmail address (e.g. hello@wibly.in)
//   EMAIL_PASS     = your Gmail App Password (NOT your regular password)
//   EMAIL_TO       = where to receive notifications (defaults to EMAIL_USER)
const EMAIL_USER = process.env.EMAIL_USER || 'wibly.in@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_TO = process.env.EMAIL_TO || 'wibly.in@gmail.com';

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  });
  transporter.verify().then(() => {
    console.log('✅ Email notifications enabled');
  }).catch((err) => {
    console.log('⚠️  Email setup failed:', err.message);
    console.log('   Submissions will still be saved. Fix email config to get notifications.');
    transporter = null;
  });
} else {
  console.log('📧 Email notifications disabled (set EMAIL_USER & EMAIL_PASS to enable)');
}

async function sendNotificationEmail(submission) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: `"WIBLY Notifications" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: `🔔 New Lead: ${submission.name} — ${submission.need || 'General Inquiry'}`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0C29; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #4F46E5, #A78BFA); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 20px; color: #fff;">📬 New Contact Form Submission</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #9CA3AF; width: 120px;">Name</td><td style="padding: 8px 0; color: #fff; font-weight: 600;">${submission.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF;">Email</td><td style="padding: 8px 0;"><a href="mailto:${submission.email}" style="color: #A78BFA;">${submission.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF;">Business</td><td style="padding: 8px 0; color: #fff;">${submission.business || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px 0; color: #9CA3AF;">Service</td><td style="padding: 8px 0; color: #fff;">${submission.need || 'Not specified'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; border-left: 3px solid #4F46E5;">
              <p style="margin: 0 0 4px; color: #9CA3AF; font-size: 12px;">MESSAGE</p>
              <p style="margin: 0; color: #D1D5DB; line-height: 1.6;">${submission.message}</p>
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${submission.email}?subject=Re: Your inquiry to WIBLY" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reply to ${submission.name}</a>
            </div>
            <p style="margin-top: 24px; color: #6B7280; font-size: 12px; text-align: center;">${new Date(submission.timestamp).toLocaleString()} · WIBLY Admin</p>
          </div>
        </div>
      `
    });
    console.log(`📧 Email notification sent for ${submission.name}`);
  } catch (err) {
    console.log(`⚠️  Failed to send email:`, err.message);
  }
}

// Ensure data directory exists
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, '[]');

app.use(cors());
app.use(express.json());

// Helper to read/write submissions
function getSubmissions() {
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf-8')); }
  catch { return []; }
}
function saveSubmissions(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST - Receive form submission
app.post('/api/contact', (req, res) => {
  const { name, email, business, need, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const submission = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, email, business: business || '', need: need || '', message,
    timestamp: new Date().toISOString(),
    read: false
  };
  const submissions = getSubmissions();
  submissions.unshift(submission);
  saveSubmissions(submissions);
  console.log(`📩 New submission from ${name} (${email})`);
  // Send email notification (non-blocking — doesn't delay the response)
  sendNotificationEmail(submission);
  res.json({ success: true, message: 'Submission received!' });
});

// POST - Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: Buffer.from(`wibly:${Date.now()}`).toString('base64') });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Middleware to check admin auth
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    if (decoded.startsWith('wibly:')) return next();
  } catch {}
  res.status(401).json({ error: 'Unauthorized' });
}

// GET - All submissions (admin only)
app.get('/api/submissions', requireAdmin, (req, res) => {
  res.json(getSubmissions());
});

// PATCH - Mark as read
app.patch('/api/submissions/:id/read', requireAdmin, (req, res) => {
  const submissions = getSubmissions();
  const sub = submissions.find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Not found' });
  sub.read = true;
  saveSubmissions(submissions);
  res.json({ success: true });
});

// DELETE - Delete submission
app.delete('/api/submissions/:id', requireAdmin, (req, res) => {
  let submissions = getSubmissions();
  submissions = submissions.filter(s => s.id !== req.params.id);
  saveSubmissions(submissions);
  res.json({ success: true });
});

// Serve static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  app.get('*', (req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')));
}

app.listen(PORT, () => {
  console.log(`\n🚀 WIBLY Server running on http://localhost:${PORT}`);
  console.log(`🔑 Admin password: ${ADMIN_PASSWORD}`);
  console.log(`📁 Submissions stored in: ${DATA_FILE}`);
  if (EMAIL_USER) console.log(`📧 Email notifications → ${EMAIL_TO}`);
  console.log('');
});
