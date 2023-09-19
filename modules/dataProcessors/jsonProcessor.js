const { JsonDB, Config } = require('node-json-db');
const logger = require("../../lib/logger");
let db = new JsonDB(new Config("data/data", true, false, '/'));

const jsonProcessor = {
    publish: (speedtest) => {
        db.push('/data[]', speedtest).then(() => {
            logger.info(`JSON Data Appended`)
            logger.info(speedtest)
        });
    },
}

module.exports = jsonProcessor