// Imports models
import { Permission } from './../models/permission';

export interface IPermissionRepository {
    create(permission: Permission): Promise<boolean>;
    update(permission: Permission): Promise<boolean>;
    findById(id: string): Promise<Permission>;
    list(): Promise<Permission[]>;
}