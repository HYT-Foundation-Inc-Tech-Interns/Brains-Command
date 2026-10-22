const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brains.asia';

const FONT = 'Arial, Helvetica, sans-serif';
const MONO = "'Courier New', Courier, monospace";

const C = {
  page: '#eef1f8',
  card: '#ffffff',
  ink: '#0f172a',
  body: '#475569',
  muted: '#94a3b8',
  border: '#e2e8f0',
  soft: '#f8fafc',
  accent: '#a21caf',
  accentInk: '#86198f',
};

/**
 * Wraps content in a 600px, table-based, inline-styled shell.
 * Tables + inline styles because Gmail strips <style> blocks and Outlook
 * has no support for flexbox/grid.
 */
function layout({ preheader, title, content }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">

  <!-- Inbox preview line, hidden in the body -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${C.page};">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.border};border-radius:14px;overflow:hidden;">

          <!-- Brand bar -->
          <tr>
            <td style="padding:24px 32px;border-bottom:1px solid ${C.border};">
              <span style="font-family:${FONT};font-size:17px;font-weight:800;letter-spacing:4px;color:${C.ink};">BRAINS</span>
              <span style="display:block;margin-top:4px;font-family:${FONT};font-size:9px;font-weight:700;letter-spacing:2.5px;color:${C.accent};">INFINITE INNOVATIONS</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:${C.soft};border-top:1px solid ${C.border};">
              <p style="margin:0 0 6px;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.muted};">
                This is an automated message from Brains Infinite Innovations. Replies are not monitored.
              </p>
              <p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.6;color:${C.muted};">
                Need help? Contact <a href="mailto:hello@brains.asia" style="color:${C.accent};text-decoration:none;">hello@brains.asia</a>
              </p>
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
  return `<h1 style="margin:0 0 10px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:800;color:${C.ink};">${text}</h1>`;
}

function paragraph(text, { last = false } = {}) {
  const mb = last ? '0' : '16px';
  return `<p style="margin:0 0 ${mb};font-family:${FONT};font-size:15px;line-height:1.65;color:${C.body};">${text}</p>`;
}

function button(href, label) {
  // bgcolor on the <td> is the fallback Outlook understands.
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;">
  <tr>
    <td align="center" bgcolor="${C.accent}" style="border-radius:10px;">
      <a href="${href}" style="display:inline-block;padding:14px 30px;font-family:${FONT};font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:10px;">${label}</a>
    </td>
  </tr>
</table>`;
}

function notice(inner) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;">
  <tr>
    <td style="padding:14px 16px;background:${C.soft};border-left:3px solid ${C.accent};border-radius:0 8px 8px 0;">
      <p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.65;color:${C.body};">${inner}</p>
    </td>
  </tr>
</table>`;
}

function detailRow(label, value) {
  return `<tr>
    <td style="padding:8px 0;font-family:${FONT};font-size:12px;color:${C.muted};width:110px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-family:${FONT};font-size:12px;color:${C.ink};vertical-align:top;">${value}</td>
  </tr>`;
}

export function passwordChangedEmail({ email, changedAt }) {
  const when = changedAt || new Date().toUTCString();

  const content = [
    heading('Your password was changed'),
    paragraph('The password for your Brains Central Command account was successfully updated. You can now sign in with your new password.'),
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};">`
      + detailRow('Account', email)
      + detailRow('Changed', when)
      + '</table>',
    notice(`<strong style="color:${C.ink};">Didn't do this?</strong> If you did not authorize this change, reset your password immediately and contact us at <a href="mailto:hello@brains.asia" style="color:${C.accentInk};text-decoration:none;font-weight:bold;">hello@brains.asia</a>.`),
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
    heading('Reset your password'),
    paragraph(`We received a request to reset the password for <strong style="color:${C.ink};">${email}</strong>. Enter the code below, or use the button to reset it instantly.`),

    `<p style="margin:24px 0 8px;font-family:${FONT};font-size:10px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">Verification code</p>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:18px 12px;background:${C.soft};border:1px solid ${C.border};border-radius:10px;">
          <span style="font-family:${MONO};font-size:28px;font-weight:bold;letter-spacing:8px;color:${C.accentInk};">${code}</span>
        </td>
      </tr>
    </table>`,

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
  const greeting = firstName ? `Hello ${firstName},` : 'Hello,';

  const content = [
    heading('Administrator access granted'),
    paragraph(`${greeting} You have been added as an administrator to Brains Central Command.`),

    `<p style="margin:24px 0 8px;font-family:${FONT};font-size:10px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">One-time access code</p>`,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:18px 12px;background:${C.soft};border:1px solid ${C.border};border-radius:10px;">
          <span style="font-family:${MONO};font-size:28px;font-weight:bold;letter-spacing:8px;color:${C.accentInk};">${code}</span>
        </td>
      </tr>
    </table>`,

    paragraph('Sign in with your email and password, then enter this code once. After that, your email and password alone will get you in.', { last: true }),

    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};">`
      + detailRow('Email', email)
      + (tempPassword
          ? detailRow('Temporary password', `<span style="font-family:${MONO};color:${C.accentInk};font-weight:bold;">${tempPassword}</span>`)
          : detailRow('Password', 'Your existing password'))
      + detailRow('Code expires', `${expiresIn} after this email was sent`)
      + '</table>',

    button(`${SITE_URL}/`, 'Sign In to Central Command'),
    notice('Change your temporary password immediately after signing in. If you were not expecting administrator access, ignore this email and contact hello@brains.asia.'),
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
