import nodemailer from "nodemailer";

const sendEmail = async function (email, subject, message) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use TLS (false for 587, true for 465)
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD, // App password for Gmail
    },
  });

  try {
    await transporter.sendMail({
      from: `LMS Skills <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: subject,
      text: message,
    });

    console.log("Email sent successfully to", email);
  } catch (error) {
    console.error("Error sending email:", error);
    console.error(
      "Error details:",
      error.response ? error.response.body : error.message
    );
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
