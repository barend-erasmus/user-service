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
import { PermissionService } from './../services/permission';

// Imports models
import { Permission } from './../models/permission';

export class PermissionsRouter {

    private router = express.Router();

    constructor() {
        this.router.get('/', (req, res, next) => {

            if (req.query.id !== undefined) {

                return this.find(req, res, next);

            } else {
                return this.list(req, res, next);
            }
        });

        this.router.post('/', this.create);
    }

    public GetRouter() {
        return this.router;
    }

    private find(req: Request, res: Response, next: () => void) {
        co(function*() {
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const permissionService = new PermissionService(permissionRepository);

            const permissions: Permission[] = yield permissionService.list();

            const permission: Permission = permissions.find((x) => x.id === req.query.id);

            if (permission === null) {
                res.status(400).end();
                return;
            }

            res.send(permission);
        });
    }

    private list(req: Request, res: Response, next: () => void) {
        co(function*() {
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const permissionService = new PermissionService(permissionRepository);

            const permissions: Permission[] = yield permissionService.list();

            res.send(permissions);
        });
    }

    private create(req: Request, res: Response, next: () => void) {
        co(function*() {
            const permissionRepository = UserApi.repositoryFactory.getInstanceOfPermissionRepository(config);
            const permissionService = new PermissionService(permissionRepository);

            const permission: Permission = yield permissionService.create(req.body.name);

            if (permission === null) {
                res.status(400).end();
                return;
            }

            res.send(permission);
        });
    }
}
