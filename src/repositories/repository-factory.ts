// Imports interfaces
import { IUserRepository } from './user';

export interface IRepositoryFactory {

    getInstanceOfUserRepository(config: any): IUserRepository;
}
