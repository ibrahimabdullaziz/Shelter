import nodemailer from "nodemailer";
import config from "../../config/env";
import logger from "../../config/logger";

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: config.sendGridApiKey,
  },
});

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const mailOptions = {
    from: config.mailFrom,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId }, "Email delivered");
  } catch (error) {
    logger.error(
      {
        error: {
          name: error instanceof Error ? error.name : "UnknownError",
          message: error instanceof Error ? error.message : "Unknown error",
        },
      },
      "Email delivery failed",
    );
    throw error;
  }
}
