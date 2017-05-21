// Imports
import * as crypto from 'crypto';

// Imports models
import { EmailVerificationKey } from './../models/email-verification-key';

export class UserService {

    constructor(public secretKey: string) {

    }

    public generateEmailVerificationKey(username: string): EmailVerificationKey {
        const hash = crypto.createHmac('sha256', this.secretKey)
            .update(username)
            .digest('hex');
        
        return new EmailVerificationKey(username, hash);
    }
}