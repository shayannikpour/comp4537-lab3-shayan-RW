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




        if (path === WRITE_PATH) {

            if (!fs.existsSync(FILE_NAME)) {

                fs.writeFile(FILE_NAME, text, (err) => {

                    if (err) {

                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(en.ERR_WRITE);
                        res.end();

                        return;

                    }
                });

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(en.NEW_FILE);
                res.end();

            } else {

                fs.appendFile(FILE_NAME, `\n${text}`, (err) => {

                    if (err) {
                        
                        console.error(en.ERR_APPEND, err);

                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.write(en.ERR_APPEND);
                        res.end();
                        
                        return;
                    
                    }

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(en.TEXT_APPENDED);
                    res.end();

                });
            }


        } else if (path.startsWith(READ_PATH)) {

            fs.readFile(last, 'utf8', (err, data) => {

                if (err) {

                    console.error(en.ERR_READ, err);

                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.write(`${last} ${en.FILE_NOT_FOUND}`);
                    res.end();

                    return;

                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();

            });


        } else {

            res.writeHead(404, { 'Content-Type': 'text/html' });
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
