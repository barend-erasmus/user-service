// Imports models
import { Permission } from './permission';
import { Role } from './role';

export class User {
    constructor(
        public id: string,
        public username: string,
        public emailAddress: string,
        public permissions: Permission[],
        public roles: Role[],
        public isVerified: boolean,
        public lastLoginTimestamp: number) {

    }
}
