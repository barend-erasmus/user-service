// Imports models
import { UserPermission } from './user-permission';
import { UserRole } from './user-role';

export class User {
    constructor(
        public id: string,
        public username: string,
        public emailAddress: string,
        public permissions: UserPermission[],
        public roles: UserRole[],
        public isVerified: boolean,
        public lastLoginTimestamp: number) {

    }

    public static mapUser(x: any): User {
        return new User(x.id, x.username, x.emailAddress, x.permissions.map((y) => UserPermission.mapUserPermission(y)), x.roles.map((y) => UserRole.mapUserRole(y)), x.isVerified, x.lastLoginTimestamp);
    }
}
