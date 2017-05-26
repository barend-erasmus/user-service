// Imports
import * as co from 'co';
import * as crypto from 'crypto';
import * as uuid from 'uuid';

// Imports interfaces
import { IUserRepository } from './../repositories/user';

// Imports models
import { EmailVerificationKey } from './../models/email-verification-key';
import { User } from './../models/user';

export class UserService {

    constructor(private sendGridApiKey: string, private secretKey: string, private userRepository: IUserRepository) {

    }

    public generateEmailAddressVerificationKey(username: string): EmailVerificationKey {
        const hash = crypto.createHmac('sha256', this.secretKey)
            .update(username)
            .digest('hex');

        return new EmailVerificationKey(username, hash);
    }

    public register(username: string): Promise<User> {
        const self = this;
        return co(function* () {
            const user: User = yield self.userRepository.findByUsername(username);

            if (user !== null) {
                return null;
            }

            const newUser: User = new User(uuid.v4(), username, null, [], [], false, new Date().getTime());

            yield self.userRepository.create(newUser);

            if (self.isEmailAddress(username)) {
                yield self.sendEmailForVerification(username);
            }

            return newUser;
        });
    }

    public find(username): Promise<User> {
        return this.userRepository.findByUsername(username);
    }

    public login(username: string): Promise<boolean> {
        const self = this;
        return co(function* () {
            const user: User = yield self.userRepository.findByUsername(username);

            if (user === null) {
                return false;
            }

            user.lastLoginTimestamp = new Date().getTime();

            yield self.userRepository.update(user);

            return true;
        });
    }

    private sendEmailForVerification(emailAddress: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    private decryptSendGridApiKey() {
        const decipher = crypto.createDecipher('aes-256-ctr', 'user-service');
        let dec = decipher.update(this.sendGridApiKey, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    private encryptSendGridApiKey() {
        const cipher = crypto.createCipher('aes-256-ctr', 'user-service');
        let crypted = cipher.update(this.sendGridApiKey, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    private isEmailAddress(emailAddress: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(emailAddress);
    }
}
