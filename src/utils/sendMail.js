"use strict";
const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.MAIL_APP_PASSWORD,
      },
      debug: true, // Enable debugging
    });

    // Define the email options
    const mailOptions = {
      from: {
        name: "E-Commerce Platform by Charles Caleb - Tunga Impact Academy",
        address: process.env.USER_MAIL,
      }, // sender address
      to: options.userMail, // recipient address
      subject: "Reset Your Password", // Subject line
      text: "Your password reset token (valid for 10 minutes).", // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1F2937; color: #FFFFFF; padding: 20px; text-align: center; border-radius: 8px;">
          <h1 style="color: #B97743;">Password Reset Request</h1>
          <p style="color: #FFFFFF;">You requested a password reset for your account. Please click the button below to reset your password. This link will expire in 10 minutes.</p>
          <a href="${options.resetURL}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #B97743; color: #FFFFFF; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px; color: #FFFFFF;">If you did not request this password reset, please ignore this email.</p>
        </div>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendMail;
