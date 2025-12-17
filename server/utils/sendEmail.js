import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // ✅ your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD,    // ✅ your 16-char app password
      },
    });

    const mailOptions = {
      from: '"Job Portal" <process.env.GMAIL_USER>',
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};

export default sendEmail;
