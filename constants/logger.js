const winston = require('winston');
const {dayjsLib} = require("./dayjs");
const { combine, timestamp, printf, colorize, align } = winston.format;

const timestampString = () => {
    return dayjsLib.getFormattedDateTimeString();
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'silly',
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: timestampString,
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()],
});

module.exports = logger
