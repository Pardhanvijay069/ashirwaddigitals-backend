const winston = require("winston");

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

// Local machine par hi file logs banao
if (process.env.VERCEL !== "1") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error"
    })
  );

  transports.push(
    new winston.transports.File({
      filename: "logs/combined.log"
    })
  );
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: {
    service: "ashirwad-backend"
  },
  transports
});

module.exports = logger;