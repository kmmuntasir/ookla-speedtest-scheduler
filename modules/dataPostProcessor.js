const dayjs = require('../constants/dayjs');
const logger = require('../constants/logger');
const common = require('../constants/common');
const fs = require('fs');

const OUTPUT_FILENAME = '../data/data.csv';

const dataPostProcessor = {
    publishData: (output) => {
        let dataString = (output.success)
            ? csvProcessor.buildCsvDataString(output.data)
            : csvProcessor.buildCsvErrorString(output.data)
        csvProcessor.writeData(dataString)
    },
}

const csvProcessor = {
    writeData: (dataString) => {
        fs.appendFile(OUTPUT_FILENAME, dataString, function (err) {
            if (err) {
                logger.error(err)
                throw err
            } else {
                logger.info('CSV String Written')
                logger.info(dataString)
            }
        });
    },
    buildCsvDataString: (data) => {
        return csvProcessor.getFormattedDateTimeString(data.timestamp)
            + '; ' + Math.round(data.ping.latency)
            + '; ' + (data.download.bandwidth / 125000).toFixed(2)
            + '; ' + (data.upload.bandwidth / 125000).toFixed(2)
            + '; ' + data.result.url + "\n";
    },
    buildCsvErrorString: (output) => {
        return csvProcessor.getFormattedDateTimeString()
            + '; '
            + '; '
            + '; '
            + '; ' + csvProcessor.sanitizeStringForCSV(output.type + ': ' + output.error) + "\n";
    },
    getFormattedDateTimeString: (timestamp = null) => {
        const dateObj = null === timestamp ? dayjs() : dayjs(timestamp);
        return dateObj.tz().format(common.dateTimeFormat);
    },
    sanitizeStringForCSV: (dataString) => {
        dataString = dataString.replace(/(\r\n|\n|\r|\t)/g, ' ');
        dataString = dataString.replace(/"/g, '""');
        dataString = `"${dataString}"`;

        return dataString;
    }
}

module.exports = dataPostProcessor