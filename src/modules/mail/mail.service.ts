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
      const providerError = error as {
        name?: string;
        message?: string;
        statusCode?: number;
      };

      throw Object.assign(
        new Error(providerError.message || "Resend rejected the email"),
        {
          name: providerError.name || "ResendError",
          statusCode: providerError.statusCode,
        },
      );
    }

    logger.info({ messageId: data?.id }, "Email delivered");
  } catch (error) {
    const mailError = error as {
      name?: string;
      message?: string;
      statusCode?: number;
    };

    logger.error(
      {
        mailProvider: "resend",
        errorName: mailError.name || "UnknownError",
        errorMessage: mailError.message || "Unknown error",
        statusCode: mailError.statusCode,
      },
      "Email delivery failed",
    );
    throw error;
  }
}
