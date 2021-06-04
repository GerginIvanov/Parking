'use strict';
import * as express from 'express';
import { createServer, Server as HttpServer } from 'http';
import freeSpotsRoutes from './freeSpots/freeSpots.routes';

const _app_folder = '/dist/planner';
import { db } from './shared/index';


const bodyParser = require('body-parser');
const config = require('./config/config'); //NOT REAL ROUTE

export class Server {
    protected express = express;
    protected app: express.Application;
    private server: HttpServer;
    private port = config.api_port || 3001;

    constructor() {
        this.app = this.express();

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());


        this.server = createServer(this.app);
        this.registerExpressRouters();
        this.start();

        this.syncDatabase();
    }

    private syncDatabase() {
        db.sequelize.sync()
            .then(() => console.log("Connected to the database!"))
            .catch((error) => {
                console.log(error);
            });

    }

    private start(): void {
        this.server.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }

    private registerExpressRouters() {
        this.app.use('/api/parking/freeSpots', freeSpotsRoutes);
    }
}