import { Resend } from "resend";
import config from "../../config/env";
import logger from "../../config/logger";

const resend = new Resend(config.resendApiKey);

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: config.mailFrom,
      to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    logger.info({ messageId: data?.id }, "Email delivered");
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
