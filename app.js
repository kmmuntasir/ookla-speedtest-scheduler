const PORT = process.env.LISTENING_PORT
const path = require('path');
const { v4: uuidv4 } = require('uuid')
const speedtest = require('./modules/speedtest')
const express = require('express'),
    app = express();
const jsonDb = require("./lib/jsonDb");

app.use(express.static('view'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/view/index.html'));
});

app.get(
    '/speedtest',
    (req, res) => {
        if (undefined === req.query.serverId) {
            res.send({
                status: 'failed',
                message: 'Server ID is required'
            })
        }
        const testId = uuidv4()
        speedtest.schedule(req.query.serverId, testId);
        const response = {
            status: 'success',
            testId: testId,
        }
        res.send(response)
    }
)

app.get('/test', async function (req, res) {
    res.send('hello')
});

app.get('/data', async function (req, res) {
    const data = await jsonDb.getAll()
    res.send(data)
});

app.get('/data', async function (req, res) {
    const data = await jsonDb.getAll()
    res.send(data)
});

app.get('/servers', async function (req, res) {
    const data = await jsonDb.getServers()
    res.send(data)
});

app.listen(PORT,
    () => console.log(`[bootup]: Server is running at port: ${PORT}`));
