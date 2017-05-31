// Imports
import * as co from 'co';
import { Express, Request, Response } from "express";
import * as express from 'express';

// Imports app
import { UserApi } from './../app';

// Imports configuration
import { config } from './../config';

// Imports interfaces
import { IRepositoryFactory } from './../repositories/repository-factory';

// Imports services
import { UserService } from './../services/user';

// Imports models
import { User } from './../models/user';

export class UsersRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/', (req, res, next) => {

            if (req.query.username !== undefined) {

                return this.find(req, res, next);

            } else {
                return this.list(req, res, next);
            }
        });

        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
        this.router.get('/verify', this.verify);
    }

    public GetRouter() {
        return this.router;
    }

    private find(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const user: User = yield userService.find(req.query.username);

            if (user === null) {
                res.status(400).end();
                return;
            }

            res.send(user);
        });
    }

    private list(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const users: User[] = yield userService.list();

            res.send(users);
        });
    }

    private verify(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const result: boolean = yield userService.verifyUserEmailAddress(req.query.username, req.query.key);

            res.redirect(req.query.redirectUri);
        });
    }

    private register(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const user: User = yield userService.register(req.body.username);

            if (user === null) {
                res.status(400).end();
                return;
            }

            res.send(user);
        });
    }

    private login(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const result: boolean = yield userService.login(req.body.username);

            res.send(result);
        });
    }
}
