import twilio from 'twilio'
import sgMail from '@sendgrid/mail'

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function sendSMS(to: string, message: string): Promise<void> {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })
  } catch (error) {
    console.error('Failed to send SMS:', error)
    throw error
  }
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: subject,
      html: html,
    }

    await sgMail.send(msg)
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export function generateDeadlineReminderMessage(
  transactionTitle: string,
  deadlineTitle: string,
  daysUntil: number
): string {
  const urgency = daysUntil <= 1 ? 'URGENT' : daysUntil <= 3 ? 'Important' : 'Reminder'
  
  return `${urgency}: ${deadlineTitle} for ${transactionTitle} is due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}. Please take action to avoid delays.`
}

export function generateStatusUpdateMessage(
  transactionTitle: string,
  newStatus: string,
  clientName: string
): string {
  return `Hi ${clientName}, your transaction "${transactionTitle}" has been updated to: ${newStatus}. Check your client portal for more details.`
}

export function generateDocumentUploadMessage(
  transactionTitle: string,
  documentTitle: string,
  uploadedBy: string
): string {
  return `New document "${documentTitle}" has been uploaded for "${transactionTitle}" by ${uploadedBy}. Please review in your client portal.`
}
