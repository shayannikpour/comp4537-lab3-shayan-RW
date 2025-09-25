const http = require('http');
const url = require('url');
const fs = require('fs');
const en = require('./lang/en/en.js');

const WRITE_PATH = '/writeFile/';
const READ_PATH = '/readFile/';
const FILE_NAME = 'file.txt';

class ServerApp {
    constructor(port) {
        this.port = port;
        this.start();
    }

    handleRequest(req, res) {
        const q = url.parse(req.url, true);
        const qdata = q.query;
        const text = qdata.text || "";

        const path = q.pathname;
        const parts = path.split("/");
        const last = parts.pop() || parts.pop();

        res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });

        if (path === WRITE_PATH) {

            if (!fs.existsSync(FILE_NAME)) {

                fs.writeFile(FILE_NAME, text, (err) => {

                    if (err) {

                        console.error(en.ERR_WRITE, err);
                        return;

                    }
                });

                res.write(en.NEW_FILE);
                res.end();

            } else {

                fs.appendFile(FILE_NAME, `\n${text}`, (err) => {

                    if (err) {
                        
                        console.error(en.ERR_APPEND, err);
                        return;
                    
                    }

                    res.write(en.TEXT_APPENDED);

                });
            }


        } else if (path.startsWith(READ_PATH)) {

            fs.readFile(last, 'utf8', (err, data) => {

                if (err) {

                    console.error(en.ERR_READ, err);

                    res.write(en.FILE_NOT_FOUND);
                    res.end();

                    return;

                }

                res.write(data);
                res.end();

            });


        } else {

            res.write(en.UNKNOWN_PATH);
            res.end();

        }
    }

    //AI usage for this function
    start() {
        http.createServer((req, res) => this.handleRequest(req, res))
            .listen(this.port, () => {
                console.log(en.SERVER_RUNNING);
            });
    }
}

const app = new ServerApp(8888);
