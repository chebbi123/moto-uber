import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReceipt = async (email, receiptDetails) => {
  try {
    const { amount, date, transactionId } = receiptDetails;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Payment Receipt',
      html: `
        <h1>Payment Receipt</h1>
        <p>Thank you for your payment. Here are the details:</p>
        <ul>
          <li><strong>Amount:</strong> $${amount}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
        </ul>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Receipt sent successfully');
  } catch (error) {
    console.error('Failed to send receipt:', error);
  }
};
