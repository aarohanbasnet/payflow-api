import { minimum } from "zod/mini";

interface ITransactionTemplateParams {
  name : string,
  accountNumber : string,
  amount : number
  reference : string,
}

interface IOtpTemplateParams {
  name : string
  otpCode : string
}


export const getWelcomeOtpEmailTemplate = ({ name, otpCode }: IOtpTemplateParams) => {

    const formattedOtp = otpCode.length === 6 ? `${otpCode.slice(0, 3)} ${otpCode.slice(3)}` : otpCode;
    return { subject : `Welcome to PayFlow! Here is your verification code`,
    html :
     `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your PayFlow Account</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![if !mso]><!-->
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
        <!--<![endif]-->
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #F8FAFC;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1E293B;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #F8FAFC;
            padding: 40px 16px;
          }
          .main-card {
            max-width: 520px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 16px;
            border: 1px solid #E2E8F0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }
          .header {
            padding: 32px 32px 24px 32px;
            text-align: left;
          }
          .brand-logo {
            font-size: 24px;
            font-weight: 800;
            color: #2563EB;
            letter-spacing: -0.5px;
            text-decoration: none;
            display: inline-block;
          }
          .brand-logo span {
            color: #0F172A;
          }
          .divider {
            height: 1px;
            background-color: #F1F5F9;
            margin: 0 32px;
          }
          .content {
            padding: 32px;
          }
          .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 12px 0;
            letter-spacing: -0.3px;
          }
          .paragraph {
            font-size: 15px;
            line-height: 1.6;
            color: #475569;
            margin: 0 0 24px 0;
          }
          .otp-container {
            background: linear-gradient(135deg, #F0F6FF 0%, #E0EDFF 100%);
            border: 1px solid #BFDBFE;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            margin: 24px 0;
          }
          .otp-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #2563EB;
            margin-bottom: 8px;
          }
          .otp-code {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: 8px;
            color: #1E3A8A;
            font-family: 'Courier New', Courier, monospace;
            margin: 4px 0;
          }
          .otp-expiry {
            font-size: 13px;
            color: #64748B;
            margin-top: 8px;
            font-weight: 500;
          }
          .security-note {
            font-size: 13px;
            color: #64748B;
            background-color: #F8FAFC;
            border-left: 3px solid #2563EB;
            padding: 12px 16px;
            border-radius: 4px 8px 8px 4px;
            margin-top: 24px;
          }
          .footer {
            padding: 24px 32px 32px 32px;
            background-color: #FAFAFA;
            border-top: 1px solid #F1F5F9;
            text-align: center;
          }
          .footer-text {
            font-size: 13px;
            line-height: 1.5;
            color: #94A3B8;
            margin: 0 0 8px 0;
          }
          .heart {
            color: #EF4444;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="main-card">
            
            <!-- Header / Brand -->
            <div class="header">
              <a href="https://payflow.com" class="brand-logo">Pay<span>Flow</span></a>
            </div>

            <div class="divider"></div>

            <!-- Body Content -->
            <div class="content">
              <h1 class="greeting">Welcome to PayFlow, ${name}! 👋</h1>
              <p class="paragraph">
                Thank you for choosing PayFlow for your seamless payments. To complete your setup and verify your account, please use the One-Time Password (OTP) below:
              </p>

              <!-- OTP Card -->
              <div class="otp-container">
                <div class="otp-label">Verification Code</div>
                <div class="otp-code">${formattedOtp}</div>
                <div class="otp-expiry">⏳ Valid for the next <strong>10 minutes</strong></div>
              </div>

              <div class="security-note">
                <strong>Security Tip:</strong> PayFlow team members will never ask for your OTP. If you didn't request this code, please ignore this email.
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p class="footer-text">
                Thank you for choosing <strong>PayFlow</strong> — simplifying modern payments.
              </p>
              <p class="footer-text" style="font-size: 12px;">
                &copy; ${new Date().getFullYear()} PayFlow Inc. All rights reserved.
              </p>
            </div>

          </div>
        </div>
      </body>
    </html>
  `};
};


export const getTransactionTemplate = ({
  name,
  accountNumber, 
  amount,
  reference,

} : ITransactionTemplateParams) => {

  const formattedCurrency = (val : number) => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits : 2,
    maximumFractionDigits : 2,
  }).format(val);
};
  const formattedDate = new Date().toLocaleString('en-US', {
    dateStyle : 'medium',
    timeStyle :'short',
  });

  const formattedAmount = formattedCurrency(amount);
  return {
    subject : `Payflow Transaction Alert : NPR ${formattedAmount}`,
    html : `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Alert</title>
  </head>
  <body style="margin: 0; padding: 24px; font-family: system-ui, -apple-system, sans-serif; color: #1E293B; background-color: #FFFFFF;">
    <table role="presentation" style="width: 100%; max-width: 480px; margin: 0 auto; border-collapse: collapse;">
      
      <!-- PayFlow Brand Logo -->
      <tr>
        <td style="padding-bottom: 20px; border-bottom: 1px solid #E2E8F0;">
          <a href="https://payflow.com" style="font-size: 22px; font-weight: 800; color: #2563EB; text-decoration: none;">
            Pay<span style="color: #0F172A;">Flow</span>
          </a>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding: 20px 0 16px 0;">
          <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.5;">
            Dear <strong>${name}</strong>,<br>
            Please find the details of your recent PayFlow transaction below:
          </p>
        </td>
      </tr>

      <!-- Transaction Details Table -->
      <tr>
        <td>
          <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B;">Account Number</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 600; color: #0F172A; font-family: monospace;">${accountNumber}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B;">Date & Time</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 500; color: #0F172A;">${formattedDate}</td>
            </tr>
            <tr style="border-bottom: 1px solid #F1F5F9;">
              <td style="padding: 10px 0; color: #64748B;">Reference</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 500; color: #0F172A; font-family: monospace;">${reference}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748B; font-weight: 600;">Amount</td>
              <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #2563EB; font-size: 16px;">
                NPR ${formattedAmount}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer Security Note -->
      <tr>
        <td style="padding-top: 24px; border-top: 1px solid #E2E8F0; margin-top: 20px;">
          <p style="margin: 0; font-size: 12px; color: #94A3B8; line-height: 1.4;">
            If you did not recognize or authorize this transaction, please contact PayFlow support immediately.
          </p>
        </td>
      </tr>

    </table>
  </body>
</html>
    `
  }
}