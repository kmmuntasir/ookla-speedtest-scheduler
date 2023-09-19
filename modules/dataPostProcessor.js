const csvProcessor = require("./dataProcessors/csvProcessor");
const testObj = require("../models/test");
const {dayjsLib} = require("../constants/dayjs");

const dataPostProcessor = {
    getModel: (output) => {
        let speedtest = testObj()

        speedtest.id = output.testId
        speedtest.timestamp = dayjsLib.getFormattedDateTimeString({
            timestamp: output.data.timestamp
        })

        if (output.success) {
            speedtest.ping = Math.round(output.data.ping.latency)
            speedtest.download = (output.data.download.bandwidth / 125000).toFixed(2)
            speedtest.upload = (output.data.upload.bandwidth / 125000).toFixed(2)
            speedtest.result = output.data.result.url
        } else {
            speedtest.result = output.data.type + ': ' + output.data.error
        }

        return speedtest
    },
    publishData: (output) => {
        const speedtest = dataPostProcessor.getModel(output)
        csvProcessor.publish(speedtest)
    },
}

module.exports = dataPostProcessor