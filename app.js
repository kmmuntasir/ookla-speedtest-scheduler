const PORT = process.env.LISTENING_PORT
const path = require('path');
const { v4: uuidv4 } = require('uuid')
const speedtest = require('./modules/speedtest')
const servers = require('./constants/servers')
const express = require('express'),
    app = express();

app.use(express.static('view'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/view/index.html'));
});

app.get(
    '/speedtest',
    (req, res) => {
        const testId = uuidv4()
        speedtest.schedule(servers.surfshark_ltd.id, testId);
        const response = {
            status: 'success',
            testId: testId,
        }
        res.send(response)
    }
)

app.listen(PORT,
    () => console.log(`[bootup]: Server is running at port: ${PORT}`));
