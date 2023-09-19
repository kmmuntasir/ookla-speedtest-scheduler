
const { JsonDB, Config } = require('node-json-db');
const logger = require("./logger");
let db = new JsonDB(new Config("data/data", true, true, '/'));
let servers = new JsonDB(new Config("data/servers", true, true, '/'));

const jsonDb = {
    addData: (data) => {
        db.push('/data[]', data).then(() => {
            logger.info(`JSON Data Appended`)
            logger.info(data)
        });
    },
    getAll: async () => {
        return await db.getData('/data')
    },
    getServers: async () => {
        return await servers.getData('/servers')
    },
}

module.exports = jsonDb