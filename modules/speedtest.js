const logger = require('../lib/logger');
const dataPostProcessor = require('./dataPostProcessor')
const {exec} = require('child_process');

const speedtest = {
    schedule: (serverId, testId) => {
        logger.info(`Initiating test ${testId}`);
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