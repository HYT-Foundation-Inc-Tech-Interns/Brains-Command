import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailer';
import { getAdmin } from '@/lib/requireAdmin';
import { maintenanceAlertEmail } from '@/lib/emailTemplates';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

// Admin-only: secure endpoint for operational alerts and admin dispatches
export async function POST(request) {
  const { error, status } = await getAdmin(request);
  if (error) return NextResponse.json({ error }, { status });

  try {
    const body = await request.json();
    const {
      to,
      subject,
      message,
      html,
      text,
      type,
      customerName,
      activated,
      preview,
      attachment
    } = body;

    let emailSubject = subject;
    let emailHtml = html;
    let emailText = text || message;

    // Handle high-fidelity maintenance alert template
    if (type === 'maintenance') {
      const template = maintenanceAlertEmail({
        customerName: customerName || '',
        activated: activated !== false,
      });
      emailSubject = subject || template.subject;
      emailHtml = html || template.html;
      emailText = text || template.text;
    } else if (!emailHtml && message) {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #cbd5e1; line-height: 1.6; max-width: 640px; margin: 0 auto; padding: 28px; border: 1px solid #3b2d6b; border-radius: 14px; background: #0c0f24; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="border-bottom: 1px solid #2e2556; padding-bottom: 14px; margin-bottom: 18px;">
            <span style="font-size: 17px; font-weight: 900; letter-spacing: 4px; color: #ffffff;">BRAINS</span>
            <span style="display: block; font-size: 9px; font-weight: 700; letter-spacing: 2.5px; color: #c084fc; margin-top: 3px;">INFINITE INNOVATIONS</span>
          </div>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7;">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    // If this is a preview request, return the compiled email without sending
    if (preview) {
      return NextResponse.json({
        success: true,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      });
    }

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email address (to) is required' },
        { status: 400 }
      );
    }

    if (!emailSubject || (!emailHtml && !emailText)) {
      return NextResponse.json(
        { error: 'Subject and message body are required' },
        { status: 400 }
      );
    }

    const attachments = attachment?.base64Content
      ? [{
          filename: attachment.filename,
          content: attachment.base64Content,
          encoding: 'base64',
        }]
      : undefined;

    await sendMail({
      to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      attachments,
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Sending Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
