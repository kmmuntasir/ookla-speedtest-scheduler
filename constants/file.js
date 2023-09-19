const fs = require("fs");
const logger = require("./logger");

const file = {
    writeData: (dataString, filename, format) => {
        fs.appendFile(filename, dataString, function (err) {
            if (err) {
                logger.error(err)
                throw err
            } else {
                logger.info(`${format} String Written`)
                logger.info(dataString)
            }
        });
    },
    fileCheck: (path) => {
        try {
            if (fs.existsSync(path)) {
                return true
            }
        } catch(err) {
            return false
        }
    }
}

module.exports = file