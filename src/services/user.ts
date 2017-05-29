// Imports
import * as co from 'co';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as inlineCss from 'inline-css';

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
        return co(function*() {
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

    public find(username: string): Promise<User> {
        return this.userRepository.findByUsername(username);
    }

    public list(): Promise<User[]> {
        return this.userRepository.list();
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

    public verifyUserEmailAddress(username: string, key: string): Promise<boolean> {
        const self = this;
        return co(function*() {
            const user: User = yield self.userRepository.findByUsername(username);

            if (user === null) {
                return false;
            }

            const emailVerificationKey = self.generateEmailAddressVerificationKey(username);

            if (emailVerificationKey.key !== key) {
                return false;
            }

            user.isVerified = true;

            yield self.userRepository.update(user);

            return true;
        });
    }

    private sendEmailForVerification(emailAddress: string): Promise<boolean> {

        const self = this;
        return co(function*() {

            const html = yield fs.readFile(path.join(__dirname, '../templates/email/verification.html'), 'utf8');

            const template = handlebars.compile(html);

            const compiledHtml = template(html);

            const inlineCssHtml = yield inlineCss(compiledHtml, {
                url: 'http://localhost:3000'
            });

            const result = yield self.sendEmail('developersworkspace@gmail.com', 'Please verify your email address', inlineCssHtml);

            return true;
        });
    }

    private sendEmail(toEmailAddress: string, subject: string, body: string): Promise<boolean> {
        return new Promise((resolve: (result: boolean) => void, reject: (err: Error) => void) => {
            const helper = require('sendgrid').mail;

            const content = new helper.Content('text/html', body);
            const mail = new helper.Mail(new helper.Email('noreply@developersworkspace.co.za'), subject, new helper.Email(toEmailAddress), content);

            const sg = require('sendgrid')(this.decryptSendGridApiKey());
            const request = sg.emptyRequest({
                body: mail.toJSON(),
                method: 'POST',
                path: '/v3/mail/send',
            });

            sg.API(request, (error: Error, response: any) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(true);
            });
        });
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
