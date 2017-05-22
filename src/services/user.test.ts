// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports repositories
import { UserRepository } from './../repositories/mock/user';

// Imports services
import { UserService } from './user';

// Imports models
import { EmailVerificationKey } from './../models/email-verification-key';
import { User } from './../models/user';

describe('UserService', () => {

  describe('generateEmailVerificationKey', () => {
    let userService: UserService = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      userService = new UserService('secretkey', userRepository);

    });

    it('should return email verfication key', () => {
      const result: EmailVerificationKey = userService.generateEmailVerificationKey('demousername');
      expect(result.key).to.be.eq('6e7acc7ac8bab7fd46ce825ba301f3b916b9cef1adeab6bf4b6cd4371d260be2');
      expect(result.username).to.be.eq('demousername');
    });
  });

  describe('register', () => {
    let userService: UserService = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      sinon.stub(userRepository, 'findByUsername').callsFake((username: string) => {
                if (username === 'demousername1') {
                    return Promise.resolve(new User(null, null, null, null, null, null, null));
                }else {
                   return Promise.resolve(null);
                }
            });

      userService = new UserService('secretkey', userRepository);

    });

    it('should return user given username does not exist', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername2');

        expect(result).to.be.not.null;
        expect(result.id).to.be.not.null;
      });
    });

    it('should return null given username does exist', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername1');

        expect(result).to.be.null;
      });
    });
  });

  describe('find', () => {
    let userService: UserService = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      sinon.stub(userRepository, 'findByUsername').callsFake((username: string) => {
                if (username === 'demousername1') {
                    return Promise.resolve(new User(null, null, null, null, null, null, null));
                }else {
                   return Promise.resolve(null);
                }
            });

      userService = new UserService('secretkey', userRepository);

    });

    it('should return user given username does exist', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername2');

        expect(result).to.be.not.null;
        expect(result.id).to.be.not.null;
      });
    });

    it('should return null given username does not exist', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername1');

        expect(result).to.be.null;
      });
    });
  });

});
