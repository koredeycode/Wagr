// src/email.ts
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});

export async function sendEmailNotification(
  to: string,
  subject: string,
  text: string
): Promise<void> {
  try {
    await transporter.sendMail({ from: user, to, subject, text });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Email error:", err);
  }
}
