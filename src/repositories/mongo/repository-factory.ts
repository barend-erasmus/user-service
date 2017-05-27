// Imports interfaces
import { IUserRepository } from './../user';

// Imports repositories
import { UserRepository } from './user';

// Imports configuration
import { config as configuration } from './../../config';

export class RepositoryFactory {

    public getInstanceOfUserRepository(config: any): IUserRepository {
        return new UserRepository(configuration.db.uri);
    }
}
