const jsonDb = require("../../lib/jsonDb");

const jsonProcessor = {
    publish: (speedtest) => {
        jsonDb.addData(speedtest)
    },
}

module.exports = jsonProcessor