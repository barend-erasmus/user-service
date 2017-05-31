// Imports
import * as co from 'co';
import * as uuid from 'uuid';

// Imports interfaces
import { IPermissionRepository } from './../repositories/permission';

// Imports models
import { Permission } from './../models/permission';

export class PermissionService {

    constructor(private permissionRepository: IPermissionRepository) {

    }

    public create(name: string): Promise<Permission> {
        const self = this;
        return co(function*() {
            const permission = new Permission(uuid.v4(), name);

            yield self.permissionRepository.create(permission);

            return permission;
        });
    }

    public list(): Promise<Permission[]> {
        const self = this;
        return co(function*() {

            const result: Permission[] = yield self.permissionRepository.list();

            return result;
        });
    }
}
