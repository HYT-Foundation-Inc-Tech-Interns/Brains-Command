const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brains-centra.vercel.app/';

const FONT = "Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif";
const MONO = "ui-monospace, 'SFMono-Regular', 'Roboto Mono', 'Courier New', Courier, monospace";

/**
 * Universal Luxury Cyberpunk Black & Purple Theme
 */
const C = {
  page: '#050713',       // Ultra-dark background
  card: '#0c0f24',       // Container card surface
  cardBorder: '#31275c', // Glowing purple card border
  border: '#251e44',     // Internal divider / table border
  ink: '#ffffff',        // Crisp white headings & bold text
  body: '#cbd5e1',       // High-contrast readable slate/silver body text
  muted: '#94a3b8',      // Secondary metadata & subtle labels
  soft: '#080a18',       // Inset panels, detail tables, code backgrounds
  accent: '#a855f7',     // Electric purple
  accentInk: '#c084fc',  // Bright glowing violet
  accentSoft: '#1e1438', // Muted violet highlight
  btnGradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
  btnBg: '#7e22ce',      // Solid fallback button color
  btnBorder: '#c084fc',
  glow: 'rgba(168, 85, 247, 0.25)',
  footerText: '#64748b',
  footerLink: '#c084fc',
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

const DEFAULT_FOOTER = `
  <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.footerText};">
    This is an automated transmission from Brains Central Command.
  </p>
  <p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.footerText};">
    Need assistance? Reach technical operations at <a href="mailto:hello@brains.asia" style="color:${C.footerLink};text-decoration:none;font-weight:bold;">hello@brains.asia</a>
  </p>`;

/**
 * Wraps content in a 600px, table-based, inline-styled Black & Purple shell.
 * Uses tables and inline styles for maximum cross-client compatibility (Gmail, Outlook, Apple Mail).
 */
function layout({ preheader, title, content, footer, theme = 'dark' }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;color-scheme:dark;">

  <!-- Inbox preview line, hidden in the body -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.page};">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.cardBorder};border-radius:16px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.8),0 0 35px ${C.glow};">

          <!-- Brand Header -->
          <tr>
            <td style="padding:24px 32px;background:${C.soft};border-bottom:1px solid ${C.border};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <span style="font-family:${FONT};font-size:18px;font-weight:900;letter-spacing:4px;color:${C.ink};">BRAINS</span>
                    <span style="display:block;margin-top:3px;font-family:${FONT};font-size:9px;font-weight:700;letter-spacing:2.5px;color:${C.accentInk};">INFINITE INNOVATIONS</span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block;padding:5px 12px;background:${C.accentSoft};border:1px solid #7c3aed;border-radius:12px;font-family:${MONO};font-size:9px;font-weight:700;letter-spacing:1.5px;color:#d8b4fe;text-transform:uppercase;">
                      CENTRAL COMMAND
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px 32px 28px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 32px;background:${C.soft};border-top:1px solid ${C.border};">
              ${footer ?? DEFAULT_FOOTER}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function heading(text) {
  return `<h1 style="margin:0 0 14px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:800;color:${C.ink};letter-spacing:-0.3px;">${text}</h1>`;
}

function paragraph(text, { last = false } = {}) {
  const mb = last ? '0' : '16px';
  return `<p style="margin:0 0 ${mb};font-family:${FONT};font-size:15px;line-height:1.7;color:${C.body};">${text}</p>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;">
  <tr>
    <td align="center" bgcolor="${C.btnBg}" style="border-radius:10px;">
      <a href="${href}" style="display:inline-block;padding:14px 34px;background:${C.btnBg};background-image:${C.btnGradient};border:1px solid ${C.btnBorder};border-radius:10px;font-family:${FONT};font-size:13px;font-weight:800;letter-spacing:1.2px;color:#ffffff;text-decoration:none;text-transform:uppercase;box-shadow:0 0 24px rgba(168,85,247,0.4);">${label}</a>
    </td>
  </tr>
</table>`;
}

function notice(inner) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
  <tr>
    <td style="padding:14px 18px;background:${C.soft};border:1px solid ${C.border};border-left:4px solid ${C.accent};border-radius:0 10px 10px 0;">
      <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.65;color:${C.muted};">${inner}</p>
    </td>
  </tr>
</table>`;
}

function detailRow(label, value) {
  return `<tr>
    <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:130px;vertical-align:top;text-transform:uppercase;letter-spacing:0.8px;">${label}</td>
    <td style="padding:10px 0;font-family:${FONT};font-size:13px;color:${C.ink};vertical-align:top;">${value}</td>
  </tr>`;
}

function detailTable(rowsHtml) {
  return `<div style="margin:20px 0;background:${C.soft};border:1px solid ${C.border};border-radius:12px;padding:12px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${rowsHtml}
    </table>
  </div>`;
}

function codeBox(code, label = 'Verification Code') {
  return `
    <p style="margin:24px 0 8px;font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${C.accentInk};">${label}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td align="center" style="padding:20px 16px;background:${C.soft};border:1px solid #7c3aed;border-radius:12px;box-shadow:inset 0 0 25px rgba(124,58,237,0.25), 0 0 15px rgba(168,85,247,0.15);">
          <span style="font-family:${MONO};font-size:32px;font-weight:900;letter-spacing:10px;color:#f5d0fe;text-shadow:0 0 16px rgba(168,85,247,0.7);">${escapeHtml(code)}</span>
        </td>
      </tr>
    </table>
  `;
}

export function passwordChangedEmail({ email, changedAt }) {
  const when = changedAt || new Date().toUTCString();

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:5px 14px;background:${C.accentSoft};border:1px solid ${C.accent};border-radius:20px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#c084fc;box-shadow:0 0 8px #a855f7;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#f5d0fe;text-transform:uppercase;vertical-align:middle;">
            SECURITY AUDIT &bull; PASSWORD UPDATED
          </span>
        </td>
      </tr>
    </table>`;

  const rows = [
    detailRow('Account', escapeHtml(email)),
    detailRow('Changed', escapeHtml(when)),
  ].join('');

  const content = [
    statusBadge,
    heading('Your Password Was Changed'),
    paragraph('The password for your Brains Central Command account was successfully updated. You can now sign in with your new password.'),
    detailTable(rows),
    notice(`<strong style="color:${C.ink};">Didn't do this?</strong> If you did not authorize this change, reset your password immediately and alert our security desk at <a href="mailto:hello@brains.asia" style="color:${C.accentInk};text-decoration:none;font-weight:bold;">hello@brains.asia</a>.`),
    button(`${SITE_URL}/`, 'Sign In to Central Command'),
  ].join('');

  return {
    subject: 'Your Brains Central Command password was changed',
    html: layout({
      preheader: 'Your account password was updated successfully.',
      title: 'Password changed',
      content,
    }),
    text: [
      'Your Brains Central Command password was changed.',
      '',
      `Account: ${email}`,
      `Changed: ${when}`,
      '',
      'If you did not authorize this change, reset your password immediately and',
      'contact hello@brains.asia.',
      '',
      `Sign in: ${SITE_URL}/`,
    ].join('\n'),
  };
}

export function resetCodeEmail({ email, code, link, expiresIn = '1 hour' }) {
  const content = [
    heading('Reset Your Password'),
    paragraph(`We received a request to reset the password for <strong style="color:${C.ink};">${escapeHtml(email)}</strong>. Enter the verification code below, or use the direct button to reset it instantly.`),
    codeBox(code, 'Verification Code'),
    button(link, 'Reset My Password'),
    notice(`This code and link expire in ${expiresIn} and can each be used only once. If you did not request a reset, you can safely ignore this email — your password will not change.`),
  ].join('');

  return {
    subject: `${code} is your Brains Central Command reset code`,
    html: layout({
      preheader: `Your password reset code is ${code}. It expires in ${expiresIn}.`,
      title: 'Reset your password',
      content,
    }),
    text: [
      'Reset your Brains Central Command password',
      '',
      `Verification code: ${code}`,
      `Or open this link: ${link}`,
      '',
      `This code and link expire in ${expiresIn} and can each be used only once.`,
      'If you did not request this, ignore this email — your password will not change.',
    ].join('\n'),
  };
}

export function adminAccessEmail({ firstName, email, code, tempPassword, expiresIn = '15 minutes' }) {
  const greeting = firstName ? `Hello ${escapeHtml(firstName)},` : 'Hello,';

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:5px 14px;background:${C.accentSoft};border:1px solid ${C.accent};border-radius:20px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e879f9;box-shadow:0 0 8px #d946ef;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#f5d0fe;text-transform:uppercase;vertical-align:middle;">
            SECURITY ACCESS &bull; TIER 1 ADMIN
          </span>
        </td>
      </tr>
    </table>`;

  const rows = [
    detailRow('Email', escapeHtml(email)),
    tempPassword
      ? detailRow('Temp Password', `<span style="font-family:${MONO};color:${C.accentInk};font-weight:bold;background:${C.accentSoft};border:1px solid #7c3aed;padding:2px 8px;border-radius:6px;">${escapeHtml(tempPassword)}</span>`)
      : detailRow('Password', 'Your existing password'),
    detailRow('Code Expires', `${expiresIn} after transmission`),
  ].join('');

  const content = [
    statusBadge,
    heading('Administrator Access Granted'),
    paragraph(`${greeting} You have been granted Tier 1 Administrator access to Brains Central Command.`),
    codeBox(code, 'One-Time Access Code'),
    paragraph('Sign in with your email and password, then enter this code once. After verification, your standard credentials will give you direct access.', { last: true }),
    detailTable(rows),
    button(`${SITE_URL}/`, 'Sign In to Central Command'),
    notice('Change your temporary password immediately upon signing in. If you were not expecting administrator privileges, ignore this transmission and contact hello@brains.asia.'),
  ].join('');

  return {
    subject: 'Your Brains Central Command administrator access code',
    html: layout({
      preheader: `Your one-time admin access code is ${code}. It expires in ${expiresIn}.`,
      title: 'Administrator access granted',
      content,
    }),
    text: [
      'Administrator access granted',
      '',
      greeting,
      'You have been added as an administrator to Brains Central Command.',
      '',
      `One-time access code: ${code}`,
      `Email: ${email}`,
      `Temporary password: ${tempPassword}`,
      '',
      'Sign in, then enter the code once. After that your email and password alone will work.',
      `The code expires ${expiresIn} after this email was sent.`,
      '',
      'Change your temporary password immediately after signing in.',
    ].join('\n'),
  };
}

export function adminReplyEmail({ customerName, subject, body }) {
  const greeting = customerName ? `Hello ${escapeHtml(customerName)},` : 'Hello,';

  const content = [
    heading(escapeHtml(subject || 'Reply from Brains Central Command')),
    paragraph(greeting),
    `<div style="margin:0 0 18px;padding:18px 20px;background:${C.soft};border:1px solid ${C.border};border-left:4px solid ${C.accent};border-radius:0 12px 12px 0;font-family:${FONT};font-size:14px;line-height:1.75;color:${C.body};white-space:pre-wrap;">${escapeHtml(body)}</div>`,
    notice('Reply to this email to continue the conversation. Your response is delivered straight back to our request tracker, so nothing gets lost.'),
  ].join('');

  return {
    subject: subject || 'Reply from Brains Central Command',
    html: layout({
      preheader: escapeHtml(String(body).slice(0, 120)),
      title: subject || 'Reply from Brains Central Command',
      content,
    }),
    text: [greeting, '', body, '', 'Reply to this email to continue the conversation.'].join('\n'),
  };
}

export function passwordChangeCodeEmail({ email, code, expiresIn = '15 minutes' }) {
  const content = [
    heading('Confirm Your Password Change'),
    paragraph(`We received a request to change the password for <strong style="color:${C.ink};">${escapeHtml(email)}</strong>. Enter the verification code below to finish. Your current password remains active until confirmed.`),
    codeBox(code, 'Confirmation Code'),
    notice(`This code expires in ${expiresIn} and can be used only once. If you did not request this change, ignore this email — your password will stay exactly as it is.`),
  ].join('');

  return {
    subject: `${code} is your Brains Central Command password change code`,
    html: layout({
      preheader: `Your password change code is ${code}. It expires in ${expiresIn}.`,
      title: 'Confirm your password change',
      content,
    }),
    text: [
      'Confirm your Brains Central Command password change',
      '',
      `Verification code: ${code}`,
      '',
      `This code expires in ${expiresIn} and can be used only once.`,
      'If you did not request this change, ignore this email — your password will not change.',
    ].join('\n'),
  };
}

export function billingReceiptEmail({
  firstName,
  email,
  invoiceNumber,
  amount,
  currency = 'PHP',
  description,
  modules = [],
  paidAt,
  last4,
}) {
  const greeting = firstName ? `Hello ${escapeHtml(firstName)},` : 'Hello,';
  const total = `${currency} ${Number(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  const when = paidAt ? new Date(paidAt).toUTCString() : new Date().toUTCString();

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:6px 16px;background:#14231b;border:1px solid #10b981;border-radius:24px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #10b981;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#6ee7b7;text-transform:uppercase;vertical-align:middle;">
            PAYMENT CONFIRMED &bull; RECEIPT GENERATED
          </span>
        </td>
      </tr>
    </table>`;

  const rows = [
    detailRow('Invoice', `<span style="font-family:${MONO};color:${C.accentInk};font-weight:bold;">${escapeHtml(invoiceNumber)}</span>`),
    detailRow('Date', escapeHtml(when)),
    detailRow('Description', escapeHtml(description || 'Module subscription')),
    modules.length ? detailRow('Modules', modules.map(escapeHtml).join(', ')) : '',
    last4 ? detailRow('Card', `•••• ${escapeHtml(last4)}`) : '',
    detailRow('Total Paid', `<strong style="font-family:${MONO};font-size:15px;color:#34d399;">${total}</strong>`),
  ].join('');

  const content = [
    statusBadge,
    heading('Payment Received &amp; Confirmed'),
    paragraph(`${greeting} Your payment was successfully processed and your subscribed modules remain fully operational.`),
    detailTable(rows),
    button(`${SITE_URL}/user-dashboard`, 'Open Billing & Subscription'),
    notice('Keep this email as your official receipt. Invoices and transaction history are also available 24/7 under Billing &amp; Subscription in your user dashboard.'),
  ].join('');

  return {
    subject: `Receipt ${invoiceNumber} — Brains Central Command`,
    html: layout({
      preheader: `Payment of ${total} received. Invoice ${invoiceNumber}.`,
      title: 'Payment received',
      content,
    }),
    text: [
      'Payment received — Brains Central Command',
      '',
      greeting,
      '',
      `Invoice: ${invoiceNumber}`,
      `Date: ${when}`,
      `Description: ${description || 'Module subscription'}`,
      modules.length ? `Modules: ${modules.join(', ')}` : '',
      last4 ? `Card: **** ${last4}` : '',
      `Total paid: ${total}`,
      '',
      `View your billing: ${SITE_URL}/user-dashboard`,
    ].filter(Boolean).join('\n'),
  };
}

export function subscriptionCanceledEmail({ firstName, email, modules = [], canceledAt }) {
  const greeting = firstName ? `Hello ${escapeHtml(firstName)},` : 'Hello,';
  const when = canceledAt ? new Date(canceledAt).toUTCString() : new Date().toUTCString();
  const list = modules.length ? modules.map(escapeHtml).join(', ') : 'All modules';

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:6px 16px;background:#241220;border:1px solid #f43f5e;border-radius:24px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#fb7185;box-shadow:0 0 8px #f43f5e;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#fda4af;text-transform:uppercase;vertical-align:middle;">
            SUBSCRIPTION CANCELED
          </span>
        </td>
      </tr>
    </table>`;

  const rows = [
    detailRow('Canceled', escapeHtml(when)),
    detailRow('Modules', escapeHtml(list)),
    detailRow('Account', escapeHtml(email)),
  ].join('');

  const content = [
    statusBadge,
    heading('Subscription Canceled'),
    paragraph(`${greeting} Your subscription has been canceled and access to the modules listed below has ended.`),
    detailTable(rows),
    paragraph('Your organization data and configurations are retained, allowing you to reactivate any module at any time without reconfiguration.', { last: true }),
    button(`${SITE_URL}/user-dashboard`, 'Review Billing & Subscription'),
    notice(`<strong style="color:${C.ink};">Didn't ask for this?</strong> Contact us immediately at <a href="mailto:hello@brains.asia" style="color:${C.accentInk};text-decoration:none;font-weight:bold;">hello@brains.asia</a> to restore access.`),
  ].join('');

  return {
    subject: 'Your Brains Central Command subscription was canceled',
    html: layout({
      preheader: `Subscription canceled for ${list}.`,
      title: 'Subscription canceled',
      content,
    }),
    text: [
      'Subscription canceled — Brains Central Command',
      '',
      greeting,
      '',
      `Canceled: ${when}`,
      `Modules: ${list}`,
      `Account: ${email}`,
      '',
      'Your data is retained, so you can re-subscribe at any time.',
      'If you did not request this, contact hello@brains.asia.',
    ].join('\n'),
  };
}

/**
 * Marketing / announcement email composed in the admin dashboard.
 * Supports inline CID attachments and remote URLs.
 */
export function campaignEmail({
  subject,
  body,
  images = [],
  recipientName,
  unsubscribeUrl: optOutUrl,
}) {
  const safeSubject = escapeHtml(subject || 'News from Brains Infinite Innovations');
  const firstName = String(recipientName || '').trim().split(/\s+/)[0];
  const greeting = firstName ? `Hello ${escapeHtml(firstName)},` : 'Hello,';

  const paragraphs = String(body || '')
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => paragraph(escapeHtml(chunk).replace(/\n/g, '<br>')))
    .join('');

  const gallery = (images || [])
    .map((item) => {
      let src = '';
      if (typeof item === 'object' && item !== null) {
        src = item.cid ? `cid:${item.cid}` : (item.url || item.src || '');
      } else {
        src = String(item || '');
      }
      if (!src) return '';
      return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 10px;">
          <tr>
            <td align="center">
              <img src="${escapeHtml(src)}" alt="Brains Campaign Announcement" width="536" border="0"
                   style="display:block;width:100%;max-width:536px;height:auto;margin:0 auto;border:1px solid ${C.cardBorder};border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,0.7),0 0 25px ${C.glow};outline:none;text-decoration:none;">
            </td>
          </tr>
        </table>
      `;
    })
    .filter(Boolean)
    .join('');

  const optOut = optOutUrl || `${SITE_URL}/`;

  const footer = `
  <p style="margin:0 0 8px;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.footerText};">
    You are receiving this communication as an authorized contact of Brains Infinite Innovations.
  </p>
  <p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.footerText};">
    Brains Infinite Innovations &middot; <a href="mailto:hello@brains.asia" style="color:${C.footerLink};text-decoration:none;">hello@brains.asia</a>
    &middot; <a href="${escapeHtml(optOut)}" style="color:#a5b4fc;text-decoration:underline;">Unsubscribe</a>
  </p>`;

  const content = [
    paragraph(greeting),
    paragraphs,
    gallery,
  ].join('');

  return {
    subject: subject || 'News from Brains Infinite Innovations',
    html: layout({
      preheader: escapeHtml(String(body || '').replace(/\s+/g, ' ').slice(0, 120)),
      title: safeSubject,
      content,
      footer,
    }),
    text: [
      greeting,
      '',
      String(body || ''),
      '',
      `Unsubscribe: ${optOut}`,
      'Brains Infinite Innovations · hello@brains.asia',
    ].join('\n'),
  };
}

export function welcomeEmail({ firstName, lastName, email, company, createdAt }) {
  const name = firstName ? firstName.trim() : 'there';
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const when = createdAt || new Date().toUTCString();

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:5px 14px;background:${C.accentSoft};border:1px solid ${C.accent};border-radius:20px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e879f9;box-shadow:0 0 8px #d946ef;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#f5d0fe;text-transform:uppercase;vertical-align:middle;">
            ACCOUNT PROVISIONED &bull; ACTIVE
          </span>
        </td>
      </tr>
    </table>`;

  const rows = [
    detailRow('Account', escapeHtml(email)),
    detailRow('Name', escapeHtml(fullName || 'Not provided')),
    detailRow('Company', escapeHtml(company || 'Not provided')),
    detailRow('Created', escapeHtml(when)),
  ].join('');

  const content = [
    statusBadge,
    heading(`Welcome aboard, ${escapeHtml(name)}`),
    paragraph(`Your Brains Central Command account has been successfully initialized. You can sign in at any time with <strong style="color:${C.ink};">${escapeHtml(email)}</strong> and configure the core management modules provisioned for your organization.`),
    detailTable(rows),
    button(`${SITE_URL}/`, 'Sign In to Central Command'),
    notice(`Retain this email for your records. If you did not create this account, contact our security desk immediately at <a href="mailto:hello@brains.asia" style="color:${C.accentInk};text-decoration:none;font-weight:bold;">hello@brains.asia</a>.`),
  ].join('');

  return {
    subject: 'Your Brains Central Command account is ready',
    html: layout({
      preheader: `Your account for ${email} has been created.`,
      title: 'Account created',
      content,
    }),
    text: [
      `Welcome aboard, ${name}.`,
      '',
      'Your Brains Central Command account has been created.',
      '',
      `Account: ${email}`,
      `Company: ${company || 'Not provided'}`,
      `Created: ${when}`,
      '',
      `Sign in: ${SITE_URL}/`,
      '',
      'If you did not create this account, contact hello@brains.asia.',
    ].join('\n'),
  };
}

export function trialApprovedEmail({ firstName, email, modules = [], trialDays = 14, adminNote = '' }) {
  const name = firstName ? firstName.trim() : 'Valued Partner';
  const moduleLabels = {
    hms: 'Frontdesk — Hotel & Hospitality Management System',
    pms: 'Landlord — Property Management System',
    hvms: 'Butler — High-Value Property & Villa Suite',
    bms: 'Sekyu — Building Management & Security Surveillance',
    iot: 'Housekeeper — IoT Sensor Telemetry & Automation',
  };

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:6px 16px;background:#14231b;border:1px solid #10b981;border-radius:24px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 8px #10b981;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#6ee7b7;text-transform:uppercase;vertical-align:middle;">
            ACCESS PROVISIONED &bull; ${trialDays}-DAY TRIAL ACTIVE
          </span>
        </td>
      </tr>
    </table>`;

  const moduleListHtml = modules && modules.length > 0
    ? `<ul style="margin:10px 0 16px 20px;padding:0;color:${C.body};font-family:${FONT};font-size:14px;line-height:1.75;">` +
      modules.map(m => `<li><strong style="color:${C.ink};">${m.toUpperCase()}</strong>: <span style="color:${C.body};">${moduleLabels[m] || m.toUpperCase()}</span></li>`).join('') +
      `</ul>`
    : `<p style="margin:10px 0 16px;color:${C.accentInk};font-family:${FONT};font-size:14px;font-weight:bold;">All Core Facilities &amp; Connected Suites</p>`;

  const adminNoteBlock = adminNote ? `
    <div style="background:#1b152e;border:1px solid #7c3aed;border-left:4px solid ${C.accent};border-radius:0 10px 10px 0;padding:14px 18px;margin:18px 0;">
      <p style="margin:0 0 4px;font-family:${FONT};font-size:10px;font-weight:800;color:${C.accentInk};text-transform:uppercase;letter-spacing:1.5px;">Message from Central Command:</p>
      <p style="margin:0;font-family:${FONT};font-size:13px;color:#e2e8f0;line-height:1.6;">${escapeHtml(adminNote)}</p>
    </div>` : '';

  const content = [
    statusBadge,
    heading('Access Granted: Your Free Trial is Active!'),
    paragraph(`Hello ${escapeHtml(name)},`),
    paragraph(`Great news! Your application for a <strong style="color:${C.ink};">${trialDays}-day free trial</strong> of Brains Central Command has been validated and approved.`),
    adminNoteBlock,
    `<div style="background:${C.soft};border:1px solid ${C.border};border-radius:12px;padding:18px 20px;margin:20px 0;">
      <p style="margin:0 0 8px;font-family:${FONT};font-size:11px;font-weight:800;letter-spacing:1.2px;color:#a5b4fc;text-transform:uppercase;">
        Unlocked Systems &amp; Modules:
      </p>
      ${moduleListHtml}
      <p style="margin:0;font-family:${FONT};font-size:12px;color:${C.muted};">
        Your access is active for ${trialDays} days starting today. The provisioned modules in your dashboard are now unlocked.
      </p>
    </div>`,
    paragraph('You can immediately sign in to your dashboard to begin exploring the provisioned suites.'),
    button(`${SITE_URL}/`, 'Launch Central Command Dashboard'),
    paragraph(`Need a custom walkthrough or technical assistance? Reply directly to this email or reach our enterprise team at <a href="mailto:hello@brains.asia" style="color:${C.accentInk};text-decoration:none;font-weight:bold;">hello@brains.asia</a>.`, { last: true }),
  ].join('');

  return {
    subject: 'Central Command: Free Trial Approved & Modules Unlocked!',
    html: layout({
      preheader: `Your ${trialDays}-day trial is active with unlocked modules.`,
      title: 'Free Trial Approved',
      content,
    }),
    text: [
      `Hello ${name},`,
      '',
      `Your ${trialDays}-day free trial for Brains Central Command has been approved!`,
      `Unlocked modules: ${modules.join(', ').toUpperCase()}`,
      adminNote ? `Admin note: ${adminNote}\n` : '',
      `Sign in to your dashboard: ${SITE_URL}/`,
      '',
      'Brains Infinite Innovations',
    ].join('\n'),
  };
}

export function trialRejectedEmail({ firstName, email, reason = '' }) {
  const name = firstName ? firstName.trim() : 'Applicant';

  const statusBadge = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding:6px 16px;background:#241220;border:1px solid #f43f5e;border-radius:24px;">
          <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#fb7185;box-shadow:0 0 8px #f43f5e;margin-right:8px;vertical-align:middle;"></span>
          <span style="font-family:${FONT};font-size:10px;font-weight:800;letter-spacing:1.5px;color:#fda4af;text-transform:uppercase;vertical-align:middle;">
            APPLICATION STATUS &bull; UNABLE TO APPROVE
          </span>
        </td>
      </tr>
    </table>`;

  const customReason = reason ? `
    <div style="background:#200d19;border:1px solid #831843;border-left:4px solid #f43f5e;border-radius:0 10px 10px 0;padding:14px 18px;margin:18px 0;">
      <p style="margin:0 0 4px;font-family:${FONT};font-size:10px;font-weight:800;color:#fda4af;text-transform:uppercase;letter-spacing:1.5px;">Validation Note:</p>
      <p style="margin:0;font-family:${FONT};font-size:13px;color:#fecdd3;line-height:1.6;">${escapeHtml(reason)}</p>
    </div>` : '';

  const content = [
    statusBadge,
    heading('Update Regarding Your Free Trial Request'),
    paragraph(`Hello ${escapeHtml(name)},`),
    paragraph('Thank you for your interest in Brains Central Command.'),
    customReason,
    paragraph('After careful review of your application details, we were unable to approve your free trial request at this time. This may be due to incomplete organizational credentials, unverified domain information, or unmet eligibility criteria for this preview cycle.'),
    paragraph(`If you believe this is in error or would like to discuss private enterprise deployment options, please contact our support team at <a href="mailto:hello@brains.asia" style="color:${C.accentInk};text-decoration:none;font-weight:bold;">hello@brains.asia</a>.`),
  ].join('');

  return {
    subject: 'Central Command: Free Trial Request Update',
    html: layout({
      preheader: 'Update regarding your Central Command free trial request.',
      title: 'Trial Request Update',
      content,
    }),
    text: [
      `Hello ${name},`,
      '',
      'Thank you for your interest in Brains Central Command.',
      'We are unable to approve your free trial request at this time.',
      reason ? `Reason: ${reason}\n` : '',
      'Please reach out to hello@brains.asia if you have any questions.',
    ].join('\n'),
  };
}

export function maintenanceAlertEmail({ customerName, activated = true }) {
  const name = customerName ? escapeHtml(customerName) : 'Valued Partner';
  const isActivated = Boolean(activated);

  const statusBadge = isActivated
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
        <tr>
          <td style="padding:7px 18px;background:#24103f;border:1px solid #a855f7;border-radius:24px;">
            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#e879f9;box-shadow:0 0 10px #d946ef;margin-right:8px;vertical-align:middle;"></span>
            <span style="font-family:${FONT};font-size:11px;font-weight:800;letter-spacing:2px;color:#f5d0fe;text-transform:uppercase;vertical-align:middle;">
              SYSTEM ALERT: MAINTENANCE ACTIVE
            </span>
          </td>
        </tr>
      </table>`
    : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
        <tr>
          <td style="padding:7px 18px;background:#141738;border:1px solid #7c3aed;border-radius:24px;">
            <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#a855f7;box-shadow:0 0 10px #a855f7;margin-right:8px;vertical-align:middle;"></span>
            <span style="font-family:${FONT};font-size:11px;font-weight:800;letter-spacing:2px;color:#e0e7ff;text-transform:uppercase;vertical-align:middle;">
              SYSTEMS NORMAL: ALL OPERATIONAL
            </span>
          </td>
        </tr>
      </table>`;

  const titleText = isActivated
    ? 'Platform Maintenance in Progress'
    : 'Maintenance Complete — Systems Restored';

  const introText = isActivated
    ? 'Brains Central Command has initiated a scheduled maintenance window to implement critical system enhancements, security firmware updates, and infrastructure telemetry calibrations.'
    : 'The scheduled maintenance on Brains Central Command has concluded successfully. All core facilities, connector suites, and telemetry endpoints have returned to 100% operational capacity.';

  const rows = isActivated
    ? `
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Status</td>
        <td style="padding:10px 0;vertical-align:middle;"><span style="display:inline-block;padding:3px 10px;background:#3b1359;border:1px solid #a855f7;border-radius:6px;font-family:${MONO};font-size:11px;font-weight:700;color:#f5d0fe;letter-spacing:0.5px;">MAINTENANCE ACTIVE</span></td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Estimated Window</td>
        <td style="padding:10px 0;font-family:${MONO};font-size:12px;font-weight:700;color:#f1f5f9;vertical-align:middle;">30 &ndash; 60 MINUTES</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Affected Scope</td>
        <td style="padding:10px 0;font-family:${FONT};font-size:13px;color:#cbd5e1;vertical-align:middle;">Core Facilities, Connectors &amp; Integrations</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Data Protection</td>
        <td style="padding:10px 0;font-family:${FONT};font-size:13px;color:#d8b4fe;font-weight:600;vertical-align:middle;">&#128274; 100% Encrypted &amp; Safeguarded (Zero Data Loss)</td>
      </tr>
    `
    : `
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Status</td>
        <td style="padding:10px 0;vertical-align:middle;"><span style="display:inline-block;padding:3px 10px;background:#1e1438;border:1px solid #7c3aed;border-radius:6px;font-family:${MONO};font-size:11px;font-weight:700;color:#d8b4fe;letter-spacing:0.5px;">SYSTEMS NORMAL</span></td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Cluster Latency</td>
        <td style="padding:10px 0;font-family:${MONO};font-size:12px;font-weight:700;color:#f1f5f9;vertical-align:middle;">OPTIMAL (&lt; 20ms across edge nodes)</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Module Access</td>
        <td style="padding:10px 0;font-family:${FONT};font-size:13px;color:#cbd5e1;vertical-align:middle;">All subscribed facilities &amp; suites fully restored</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:${FONT};font-size:11px;font-weight:700;color:#a5b4fc;width:135px;vertical-align:middle;text-transform:uppercase;letter-spacing:0.8px;">Verified At</td>
        <td style="padding:10px 0;font-family:${MONO};font-size:12px;color:#d8b4fe;vertical-align:middle;">${new Date().toUTCString()}</td>
      </tr>
    `;

  const advisoryBlock = isActivated
    ? `<div style="background:#160f2b;border-left:4px solid #a855f7;border-radius:0 10px 10px 0;padding:16px 18px;margin:22px 0;">
        <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;font-weight:800;color:#e9d5ff;text-transform:uppercase;letter-spacing:1px;">
          Operational Advisory:
        </p>
        <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.65;color:#cbd5e1;">
          Non-administrative dashboard sessions may experience temporary restrictions while core infrastructure is upgraded. Normal operations will resume automatically once updates conclude.
        </p>
      </div>`
    : `<div style="background:#0f1738;border-left:4px solid #818cf8;border-radius:0 10px 10px 0;padding:16px 18px;margin:22px 0;">
        <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;font-weight:800;color:#c7d2fe;text-transform:uppercase;letter-spacing:1px;">
          Resolution Summary:
        </p>
        <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.65;color:#cbd5e1;">
          All scheduled maintenance tasks, database validations, and security optimizations have passed health checks. You can safely resume all operations immediately.
        </p>
      </div>`;

  const ctaLabel = isActivated ? 'Check System Status' : 'Launch Central Command';

  const content = [
    statusBadge,
    `<h1 style="margin:0 0 12px;font-family:${FONT};font-size:23px;line-height:1.3;font-weight:900;color:#ffffff;letter-spacing:-0.3px;">${titleText}</h1>`,
    `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.65;color:#cbd5e1;">Hello ${name},</p>`,
    `<p style="margin:0 0 20px;font-family:${FONT};font-size:14px;line-height:1.7;color:#94a3b8;">${introText}</p>`,
    `<div style="margin:20px 0;background:#080a18;border:1px solid #2e2556;border-radius:12px;padding:14px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
    </div>`,
    advisoryBlock,
    button(`${SITE_URL}/`, ctaLabel),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
      <tr>
        <td style="padding:14px 18px;background:#090c1e;border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;">
          <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.65;color:#94a3b8;">
            If your team experiences unexpected behavior or requires emergency escalation, our 24/7 technical operations desk is on standby at <a href="mailto:hello@brains.asia" style="color:#c084fc;text-decoration:none;font-weight:bold;">hello@brains.asia</a>.
          </p>
        </td>
      </tr>
    </table>`,
  ].join('');

  const subject = isActivated
    ? 'Brains Central Command: Scheduled Maintenance Window'
    : 'Brains Central Command: Systems Restored to Operational Capacity';

  return {
    subject,
    html: layout({
      preheader: isActivated
        ? 'Scheduled maintenance active across Central Command infrastructure.'
        : 'Maintenance completed. All systems and telemetry online.',
      title: subject,
      content,
      theme: 'dark',
    }),
    text: [
      subject,
      '',
      `Hello ${name},`,
      '',
      introText,
      '',
      `Status: ${isActivated ? 'MAINTENANCE ACTIVE' : 'SYSTEMS NORMAL'}`,
      isActivated ? 'Estimated Window: 30 - 60 Minutes' : 'All facilities restored.',
      '',
      `Dashboard: ${SITE_URL}/`,
      'Brains Central Command · hello@brains.asia',
    ].join('\n'),
  };
}
