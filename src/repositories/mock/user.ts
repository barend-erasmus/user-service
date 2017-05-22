// Imports interfaces
import { IUserRepository } from './../user';

// Imports models
import { User } from './../../models/user';

export class UserRepository implements IUserRepository {

    public create(user: User): Promise<boolean> {
        return Promise.resolve(true);
    }

    public update(user: User): Promise<boolean> {
        return null;
    }

    public list(): Promise<User[]> {
        return null;
    }

    public findByUsername(username: string): Promise<User> {
        return Promise.resolve(null);
    }

}
