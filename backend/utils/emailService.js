const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const sendOtpEmail = async (email, otp) => {
  const subject = 'Password Reset OTP - OurWardrobe';
  const text = `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #047857;">Password Reset Request</h2>
      <p>Your OTP for password reset is:</p>
      <h1 style="background-color: #f3f4f6; padding: 20px; text-align: center; letter-spacing: 5px; font-size: 24px;">
        ${otp}
      </h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return await sendEmail(email, subject, text, html);
};

const sendDonationNotification = async (donorEmail, recipientEmail, itemName) => {
  const subject = 'New Donation - OurWardrobe';
  const text = `${donorEmail} has sent you "${itemName}" as a donation.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #047857;">New Donation Received!</h2>
      <p><strong>${donorEmail}</strong> has sent you a clothing item:</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #374151;">${itemName}</h3>
        <p>Login to your OurWardrobe account to view this donation.</p>
      </div>
      <p>Thank you for being part of our community!</p>
    </div>
  `;

  return await sendEmail(recipientEmail, subject, text, html);
};

module.exports = {
  sendOtpEmail,
  sendDonationNotification
};