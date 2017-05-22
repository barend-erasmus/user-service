// Imports models
import { UserPermission } from './user-permission';

export class UserRole {
    constructor(public id: string, public name: string, public permissions: UserPermission[]) {

    }
}
