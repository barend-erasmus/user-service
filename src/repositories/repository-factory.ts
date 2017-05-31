// Imports interfaces
import { IUserRepository } from './user';
import { IPermissionRepository } from './permission';

export interface IRepositoryFactory {

    getInstanceOfUserRepository(config: any): IUserRepository;
    getInstanceOfPermissionRepository(config: any): IPermissionRepository;
}
