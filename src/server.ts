'use strict';
import * as express from 'express';
import { createServer, Server as HttpServer } from 'http';

const _app_folder = '/dist/planner';
import { db } from './shared/index';


const bodyParser = require('body-parser');
const config = require('route_to_config'); //NOT REAL ROUTE

export class Server {
    protected express = express;
    protected app: express.Application;
    private server: HttpServer;
    private port = config.api_port || 3000;

    constructor() {
        this.app = this.express();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());


        this.server = createServer(this.app);
        this.registerExpressRouters();
        this.start();

        // setTimeout(this.syncDatabase, 2000);
    }

    // private syncDatabase() {
    //     // const db = require('./shared/models/index');
    //     db.sequelize.sync()
    //         .then(() => console.log("Connected to the database!"))
    //         .catch((error) => {
    //             console.log(error);
    //         });

    // }

    private start(): void {
        this.server.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }

    private stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.close(() => {
                console.log('Server stopped!');
                resolve();
            });
        });
    }

    private registerExpressRouters() {

    }
}