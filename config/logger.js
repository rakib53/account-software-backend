const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, json } = format;

// Define your custom format for log output
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: "info", // Log level: 'info', 'warn', 'error', etc.
  format: combine(
    colorize(), // Add colors for easier reading in the console
    timestamp(), // Include timestamps in the logs
    customFormat // Apply custom format
  ),
  transports: [
    // Log errors to a file
    new transports.File({ filename: "logs/error.log", level: "error" }),

    // Log everything (info, warnings, etc.) to a separate file
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = logger;
