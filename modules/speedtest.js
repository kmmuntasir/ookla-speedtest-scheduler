const logger = require('../lib/logger');
const dataPostProcessor = require('./dataPostProcessor')
const {execSync} = require('child_process');
const common = require("../lib/common");

const speedtest = {
    run: (serverId, testId) => {
        logger.info(`Initiating test ${testId} with Server ${serverId}`)
        let output
        const command = `speedtest -f json -s ${serverId}`

        try {
            output = execSync(command, {timeout: common.testTimeout * 1000})
        } catch (e) {
            let message = e.message.split("\n")[0]
            try {
                const error = JSON.parse(e.stderr)
                if (undefined !== error.message) {
                    message += ` [${error.message}]`
                }
            } catch (e) {
                console.log(e)
            }
            output = {
                type: 'exception',
                error: message
            }
        }
        const data = speedtest.processOutput(output, testId)
        return dataPostProcessor.publishData(data)
    },
    processOutput: (output, testId) => {
        let response = {
            testId: testId,
            data: output,
        }
        try {
            let data = JSON.parse(output);
            response.success = true
            response.data = data
            return response
        } catch (e) {
            logger.error('JSON Parsing Failed')
            response.success = false
            return response
        }
    },
}

module.exports = speedtest