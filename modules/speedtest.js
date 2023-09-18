const logger = require('../constants/logger');
const dataPostProcessor = require('./dataPostProcessor')
const {exec} = require('child_process');

const speedtest = {
    run: (serverId) => {
        logger.info('Initiating test');
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
                const data = speedtest.processOutput(output)
                dataPostProcessor.publishData(data)
            }
        );
    },
    processOutput: (output) => {
        try {
            let data = JSON.parse(output);
            return {
                success: true,
                data: data,
            }
        } catch (e) {
            logger.error('JSON Parsing Failed')
            return {
                success: false,
                data: output,
            }
        }
    },
}

module.exports = speedtest