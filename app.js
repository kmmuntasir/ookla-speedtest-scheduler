const PORT = process.env.LISTENING_PORT
const speedtest = require('./modules/speedtest')
const servers = require('./constants/servers')
const express = require('express'),
    app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',
    (req, res) => res.send('Dockerizing Node Application'))

app.get(
    '/speedtest',
    (req, res) => {
        speedtest.schedule(servers.surfshark_ltd.id);
        res.send('Testing Speed')
    }
)

app.listen(PORT,
    () => console.log(`[bootup]: Server is running at port: ${PORT}`));
