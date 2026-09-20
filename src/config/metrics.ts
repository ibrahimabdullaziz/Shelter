import client from "prom-client";

client.collectDefaultMetrics();

export const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
});

export const usersRegisteredTotal = new client.Counter({
  name: "users_registered_total",
  help: "Total number of users successfully registered",
});

export const bookingsCreatedTotal = new client.Counter({
  name: "bookings_created_total",
  help: "Total number of bookings successfully created",
});

export const bookingsCancelledTotal = new client.Counter({
  name: "bookings_cancelled_total",
  help: "Total number of bookings successfully cancelled",
});

export const reviewsCreatedTotal = new client.Counter({
  name: "reviews_created_total",
  help: "Total number of reviews successfully created",
});

export const favoritesCreatedTotal = new client.Counter({
  name: "favorites_created_total",
  help: "Total number of favorites successfully created",
});

export default client;
