import express = require("express");
import crypto from "node:crypto";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import config from "./config/env";
import logger from "./config/logger";
import metrics from "./config/metrics";
import authRoutes from "./modules/auth/auth.routes";
import errorHandler from "./common/middleware/errorHandler";
import countriesRouter from "./modules/countries/countries.routes";
import citiesRouter from "./modules/cities/city.routes";
import currenciesRouter from "./modules/currencies/currency.routes";
import categoriesRouter from "./modules/categories/category.routes";
import unitsRoutes from "./modules/units/units.route";
import photoUnitsRoutes from "./modules/unit-photos/unit-photos.routes";
import bookingRoutes from "./modules/bookings/bookings.routes";
import unitReviewsRoutes from "./modules/unit-reviews/unit-reviews.routes";
import {
  unitFavoriteGetRoutes,
  unitFavoriteRoutes,
} from "./modules/unit-favorites/unit-favorites.routes";
import { swaggerDocument, swaggerUi } from "./config/swagger";
import metricsMiddleware from "./common/middleware/metrics";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: isProduction ? config.corsOrigins : true,
    credentials: false,
  }),
);

app.use(
  pinoHttp({
    logger,

    genReqId: (req) => {
      const requestId = req.headers["x-request-id"];
      if (typeof requestId === "string" && /^[a-zA-Z0-9._:-]{1,100}$/.test(requestId)) {
        return requestId;
      }

      return crypto.randomUUID();
    },
  }),
);

app.use(metricsMiddleware);

if (!isProduction) {
  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", metrics.register.contentType);
    res.end(await metrics.register.metrics());
  });
}

app.use(express.json({ limit: "1mb" }));

if (!isProduction) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/api/auth", authRoutes);
app.use("/api/countries", countriesRouter);
app.use("/api/cities", citiesRouter);
app.use("/api/currencies", currenciesRouter);
app.use("/api/unit-categories", categoriesRouter);
app.use("/api/units", photoUnitsRoutes);
app.use("/api/units", unitsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/units/:unitId/reviews", unitReviewsRoutes);
app.use("/api/units/:unitId/favorite", unitFavoriteRoutes);
app.use("/api/favorites", unitFavoriteGetRoutes);

app.get("/", (req, res) => {
  res.send("Server is running new version");
});

app.use(errorHandler);

export default app;
