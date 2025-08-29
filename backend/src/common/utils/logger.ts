import pino from "pino";

// Determine the log level based on the environment
const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug";

// Create a logger instance
const logger = pino({
  level: logLevel,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname", // Hide unnecessary info in development
    },
  },
});

export default logger;
