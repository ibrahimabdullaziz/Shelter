import app from "./app";
import config from "./config/env";
import logger from "./config/logger";

app.listen(config.port, "0.0.0.0", () => {
  logger.info(`Server is running on ${config.port}`);
});
