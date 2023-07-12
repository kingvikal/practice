import { createLogger, format, transports } from "winston";

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      level: "warn",
      filename: "Logger/logsWarning.log",
    }),
    new transports.File({
      level: "error",
      filename: "Logger/logsError.log",
    }),
  ],
  format: format.combine(
    format.json(),
    format.timestamp(),
    format.metadata(),
    format.prettyPrint()
  ),
});
export default logger;
