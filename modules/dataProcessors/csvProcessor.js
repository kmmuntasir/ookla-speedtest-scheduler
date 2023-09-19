const common = require("../../constants/common");
const file = require("../../constants/file");

const csvProcessor = {
    fileCheck: () => {
        if(!file.fileCheck(common.csvFilePath)) {
            file.writeData(
                "Test ID; Timestamp; Ping; Download; Upload; Result URL / Error Message\n",
                common.csvFilePath,
                'CSV',
            )
        }
    },
    publish: (speedtest) => {
        csvProcessor.fileCheck()
        file.writeData(
            csvProcessor.buildCsvDataString(speedtest),
            common.csvFilePath,
            'CSV',
        )
    },
    buildCsvDataString: (speedtest) => {
        return speedtest.id
            + '; ' + speedtest.timestamp
            + '; ' + speedtest.ping
            + '; ' + speedtest.download
            + '; ' + speedtest.upload
            + '; ' + csvProcessor.sanitizeStringForCSV(speedtest.result) + "\n"
    },
    sanitizeStringForCSV: (dataString) => {
        dataString = dataString.replace(/(\r\n|\n|\r|\t)/g, ' ');
        dataString = dataString.replace(/"/g, '""');
        dataString = `"${dataString}"`;

        return dataString;
    }
}

module.exports = csvProcessor