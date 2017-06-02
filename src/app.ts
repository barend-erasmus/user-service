// Imports
import express = require("express");
import { IRepositoryFactory } from './repositories/repository-factory';

// Imports middleware
import bodyParser = require('body-parser');
import * as cors from 'cors';
import expressWinston = require('express-winston');

// Imports routes
import { UsersRouter } from './routes/user';

// Imports logger
import { logger } from './logger';

// Imports factories
import { RepositoryFactory } from './repositories/mongo/repository-factory';

// Imports configurations
import { config } from './config';

export class UserApi {

    public static repositoryFactory: IRepositoryFactory;

    constructor(private app: express.Express, private port: number) {

        this.configureMiddleware(app);
        this.configureRoutes(app);
        this.configureErrorHandling(app);
    }

    public getApp(): express.Application {
        return this.app;
    }

    public run() {
        this.app.listen(this.port);
    }

    private configureMiddleware(app: express.Express) {

        // Configure body-parser
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        // Configure CORS
        app.use(cors());

        // Configure express-winston
        app.use(expressWinston.logger({
            meta: false,
            msg: 'HTTP Request: {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
            winstonInstance: logger,
        }));

    }

    private configureRoutes(app: express.Express) {

        app.get('/api/users', (req, res, next) => {

            if (req.query.username !== undefined) {

                return UsersRouter.find(req, res, next);

            } else {
                return UsersRouter.list(req, res, next);
            }
        });

        app.post('/api/users/register', UsersRouter.register);
        app.post('/api/users/login', UsersRouter.login);
        app.get('/api/users/verify', UsersRouter.verify);

    }

    private configureErrorHandling(app: express.Express) {
        app.use((err: Error, req: express.Request, res: express.Response, next: () => void) => {
            logger.error(err.message);
            if (err.name === 'UnauthorizedError') {
                res.status(401).end();
            } else {
                res.status(500).send(err.message);
            }
        });
    }
}

const port = process.env.PORT | 3000;

UserApi.repositoryFactory = new RepositoryFactory();
const api = new UserApi(express(), port);
api.run();
logger.info(`Listening on ${port}`);
