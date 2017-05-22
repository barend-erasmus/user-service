// Imports models
import { Role } from './../models/role';

export interface IRoleRepository {
    create(permission: Role): Promise<boolean>;
    update(permission: Role): Promise<boolean>;
    findById(id: string): Promise<Role>;
    list(): Promise<Role[]>;
}