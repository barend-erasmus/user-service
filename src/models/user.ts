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
}
