const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const common = require("./common");

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

dayjs.tz.setDefault("Asia/Dhaka")

const dayjsLib = {
    getFormattedDateTimeString: ({
        dateTimeFormat = common.dateTimeFormat,
        timestamp = null,
    } = {}) => {
        const dateObj = null === timestamp ? dayjs() : dayjs(timestamp);
        return dateObj.tz().format(dateTimeFormat);
    },
}

module.exports = {
    dayjs,
    dayjsLib,
}