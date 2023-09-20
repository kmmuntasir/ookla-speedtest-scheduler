const logger = require('../lib/logger');
const dataPostProcessor = require('./dataPostProcessor')
const {exec, execSync} = require('child_process');
const common = require("../lib/common");

const speedtest = {
    run: (serverId, testId) => {
        logger.info(`Running test ${testId} with Server ${serverId}`)
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
    schedule: (serverId, testId) => {
        logger.info(`Scheduling test ${testId} with Server ${serverId}`);
        exec(
            `speedtest -f json -s ${serverId}`,
            (error, stdout, stderr) => {
                let output = stdout;
                if (error) {
                    output = {
                        type: 'exception',
                        error: error.message
                    };
                } else if (stderr) {
                    output = {
                        type: 'stderr',
                        error: stderr
                    };
                }
                const data = speedtest.processOutput(output, testId)
                dataPostProcessor.publishData(data)
            }
        );
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