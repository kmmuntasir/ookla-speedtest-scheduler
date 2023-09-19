const fs = require("fs");
const logger = require("./logger");

const file = {
    appendData: (dataString, filepath, format) => {
        fs.appendFile(filepath, dataString, function (err) {
            if (err) {
                logger.error(err)
            } else {
                logger.info(`${format} String Appended: ${filepath}`)
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
    },
}

module.exports = file