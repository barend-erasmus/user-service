// Imports models
import { User } from './../models/user';

export interface IUserRepository {
    create(user: User): Promise<boolean>;
    update(user: User): Promise<boolean>;
    list(): Promise<User[]>;
    findByUsername(username: string): Promise<User>;
}
