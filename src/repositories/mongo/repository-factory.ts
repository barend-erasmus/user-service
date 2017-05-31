// Imports interfaces
import { IUserRepository } from './../user';
import { IPermissionRepository } from './../permission';

// Imports repositories
import { UserRepository } from './user';
import { PermissionRepository } from './permission';

// Imports configuration
import { config as configuration } from './../../config';

export class RepositoryFactory {

    public getInstanceOfUserRepository(config: any): IUserRepository {
        return new UserRepository(configuration.db.uri);
    }

    public getInstanceOfPermissionRepository(config: any): IPermissionRepository {
        return new PermissionRepository(configuration.db.uri);
    }
}
