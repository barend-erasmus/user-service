// Imports models
import { UserPermission } from './user-permission';

export class UserRole {

    public static mapUserRole(x: UserRole): UserRole {
        return new UserRole(x.id, x.name, x.permissions.map((y) => UserPermission.mapUserPermission(y)));
    }

    constructor(public id: string, public name: string, public permissions: UserPermission[]) {

    }
}
