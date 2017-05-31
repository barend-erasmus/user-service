// Imports interfaces
import { IPermissionRepository } from './permission';
import { IUserRepository } from './user';

export interface IRepositoryFactory {

    getInstanceOfUserRepository(config: any): IUserRepository;
    getInstanceOfPermissionRepository(config: any): IPermissionRepository;
}
