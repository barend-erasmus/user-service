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

    private static router = express.Router();

    public static find(req: Request, res: Response, next: () => void) {
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

    public static list(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const users: User[] = yield userService.list();

            res.send(users);
        });
    }

    public static verify(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const result: boolean = yield userService.verifyUserEmailAddress(req.query.username, req.query.key);

            res.redirect(req.query.redirectUri);
        });
    }

    public static register(req: Request, res: Response, next: () => void) {
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

    public static login(req: Request, res: Response, next: () => void) {
        co(function*() {
            const userRepository = UserApi.repositoryFactory.getInstanceOfUserRepository(config);
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const userService = new UserService(config.sendGrid.apiKey, config.emailOptions, config.secret, userRepository, permissionRepository);

            const result: boolean = yield userService.login(req.body.username);

            res.send(result);
        });
    }
}
