// Imports interfaces
import { IPermissionRepository } from './../permission';

// Imports models
import { Permission } from './../../models/permission';

export class PermissionRepository implements IPermissionRepository{

    public create(permission: Permission): Promise<boolean> {
        return Promise.resolve(true);
    }

    public update(permission: Permission): Promise<boolean> {
        return Promise.resolve(true);
    }

    public findById(id: string): Promise<Permission> {
        return Promise.resolve(null);
    }

    public list(): Promise<Permission[]> {
        return Promise.resolve([]);
    }
}
