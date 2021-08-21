require("./server/init/file.init").fileinit(__filename, "init finished");

const fs = require('fs');
fs.mkdirSync('server/log/', { recursive: true })

const express = require('express');

const serverconfig = require('nconf');

const app = express();
app.use(express.json());

serverconfig.argv().env().file({file: './server_config.json'});

require('./server-init')(app, express);
require('./server/route/mainroute')(app, serverconfig)


app.listen(serverconfig.get('port'), () => {
    console.log(`${
        serverconfig.get('server')
    } server started on ${
        serverconfig.get('port')
    }`);
});
