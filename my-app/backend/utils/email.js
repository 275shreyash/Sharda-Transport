import nodemailer from 'nodemailer'

// Create a transporter using environment variables for security
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred provider (e.g. 'sendgrid', 'smtp.mailtrap.io')
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

/**
 * Sends a notification email to the admin when a new inquiry is submitted.
 * @param {Object} inquiryData - The details of the new inquiry
 */
export const sendAdminNotification = async (inquiryData) => {
    try {
        // Determine the admin email address from env, or fallback for testing
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

        if (!adminEmail) {
            console.warn('⚠️ No ADMIN_EMAIL or EMAIL_USER configured. Skipping email notification.')
            return
        }

        const { service, name, phone, pickup, drop, date, message } = inquiryData

        const mailOptions = {
            from: `"Sharda Transport" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `🚨 New Inquiry Received: ${service} from ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e3a8a;">New Customer Inquiry</h2>
          <p style="font-size: 16px; color: #334155;">You have received a new request on your platform.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 30%;">Service:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${service || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Customer Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${phone || 'N/A'}</td>
            </tr>
            ${pickup ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Pickup Location:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${pickup}</td>
            </tr>` : ''}
            ${drop ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Drop Location:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${drop}</td>
            </tr>` : ''}
            ${date ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Preferred Date:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${date}</td>
            </tr>` : ''}
          </table>

          ${message ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #475569;">Additional Message:</p>
            <p style="margin: 5px 0 0 0; color: #334155;">${message}</p>
          </div>` : ''}
          
          <p style="margin-top: 25px; font-size: 14px; color: #64748b; text-align: center;">
            This is an automated message from your website's booking system.
          </p>
        </div>
      `
        }

        const info = await transporter.sendMail(mailOptions)
        // Removed console.log for security
        return true
    } catch (error) {
        // Removed console.error for security
        // We don't throw the error so the main client request still succeeds
        return false
    }
}

/**
 * Sends a notification email to the customer when their inquiry is approved.
 * @param {Object} inquiryData - The details of the approved inquiry
 */
export const sendCustomerApprovalNotification = async (inquiryData) => {
    try {
        const { service, name, email } = inquiryData

        if (!email) {
            console.warn('⚠️ No customer email provided. Skipping approval notification.')
            return
        }

        const mailOptions = {
            from: `"Sharda Transport" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `✅ Your Inquiry is Approved! Executive calling soon.`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #10b981;">Good News, ${name}!</h2>
          <p style="font-size: 16px; color: #334155;">Your inquiry for <strong>${service}</strong> has been successfully accepted by our team.</p>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #065f46;">What happens next?</p>
            <p style="margin: 5px 0 0 0; color: #047857;">One of our dedicated executives will call you at your registered phone number within the next <strong>30 minutes</strong> to finalize your booking details.</p>
          </div>
          
          <p style="margin-top: 25px; font-size: 14px; color: #64748b;">
            Thank you for choosing us! If you have any immediate questions, feel free to reply to this email.
          </p>
        </div>
      `
        }

        const info = await transporter.sendMail(mailOptions)
        // Removed console.log per user request
        return true
    } catch (error) {
        // Removed console.error per user request
        return false
    }
}
