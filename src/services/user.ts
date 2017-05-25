// Imports
import * as co from 'co';
import * as crypto from 'crypto';
import * as uuid from 'uuid';

// Imports repositories
import { IUserRepository } from './../repositories/user';

// Imports models
import { EmailVerificationKey } from './../models/email-verification-key';
import { User } from './../models/user';

export class UserService {

    constructor(private secretKey: string, private userRepository: IUserRepository) {

    }

    public generateEmailVerificationKey(username: string): EmailVerificationKey {
        const hash = crypto.createHmac('sha256', this.secretKey)
            .update(username)
            .digest('hex');

        return new EmailVerificationKey(username, hash);
    }

    public register(username: string): Promise<User> {
        const self = this;
        return co(function*() {
            const user: User = yield self.userRepository.findByUsername(username);

            if (user !== null) {
                return null;
            }

            const newUser: User = new User(uuid.v4(), username, null, [], [], false, new Date().getTime());

            yield self.userRepository.create(newUser);

            return newUser;
        });
    }

    public find(username): Promise<User> {
        return this.userRepository.findByUsername(username);
    }

    public login(username: string): Promise<boolean> {
        const self = this;
        return co(function*() {
             const user: User = yield self.userRepository.findByUsername(username);

             if (user === null) {
                return false;
            }

             user.lastLoginTimestamp = new Date().getTime();

             yield self.userRepository.update(user);

             return true;
        });
    }
}
