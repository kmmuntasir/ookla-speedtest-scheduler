const winston = require('winston');
const dayjs = require("./dayjs");
const common = require('./common');
const { combine, timestamp, printf, colorize, align } = winston.format;

const timestampString = () => {
    return dayjs.tz().format(common.dateTimeFormat);
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
