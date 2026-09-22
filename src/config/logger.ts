import appConfig from "./env";
import pino from "pino";

const apiEnv = appConfig.nodeEnv === "production";

const logger = pino({
  level: apiEnv ? "info" : "debug",

  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "req.body.password",
      "req.body.token",
      "req.body.code",
      "req.body.refreshToken",
    ],
    remove: true,
  },

  base: {
    service: "shelter-api",
  },

  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
