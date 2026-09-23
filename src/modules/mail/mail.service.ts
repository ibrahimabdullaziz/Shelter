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
    from: config.mailUser,
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(
        {
          error: {
            name: error.name,
            message: error.message,
          },
        },
        "Email delivery failed",
      );
    } else {
      logger.info("Email delivered");
    }
  });
}
