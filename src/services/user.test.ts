// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports repositories
import { PermissionRepository } from './../repositories/mock/permission';
import { UserRepository } from './../repositories/mock/user';

// Imports services
import { UserService } from './user';

// Imports models
import { EmailVerificationKey } from './../models/email-verification-key';
import { Permission } from './../models/permission';
import { User } from './../models/user';

describe('UserService', () => {

  describe('generateEmailAddressVerificationKey', () => {
    let userService: UserService = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      userService = new UserService('sendgridapikey', null, 'secretkey', userRepository, null);

    });

    it('should return email verfication key', () => {
      const result: EmailVerificationKey = userService.generateEmailAddressVerificationKey('demousername');
      expect(result.key).to.be.eq('6e7acc7ac8bab7fd46ce825ba301f3b916b9cef1adeab6bf4b6cd4371d260be2');
      expect(result.username).to.be.eq('demousername');
    });
  });

  describe('verifyUserEmailAddress', () => {
    let userService: UserService = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      sinon.stub(userRepository, 'findByUsername').callsFake((username: string) => {
        if (username === 'demousername1') {
          return Promise.resolve(new User(null, null, null, null, null, null, null));
        } else {
          return Promise.resolve(null);
        }
      });

      userService = new UserService('sendgridapikey', null, 'secretkey', userRepository, null);

    });

    it('should return true given existing user and valid key', () => {
      return co(function*() {
        const result: boolean = yield userService.verifyUserEmailAddress('demousername1', userService.generateEmailAddressVerificationKey('demousername1').key);
        expect(result).to.be.true;
      });
    });

    it('should return false given non-existing user and valid key', () => {
      return co(function*() {
        const result: boolean = yield userService.verifyUserEmailAddress('demousername2', userService.generateEmailAddressVerificationKey('demousername2').key);
        expect(result).to.be.false;
      });
    });

    it('should return false given existing user and invalid key', () => {
      return co(function*() {
        const result: boolean = yield userService.verifyUserEmailAddress('demousername1', userService.generateEmailAddressVerificationKey('demousername2').key);
        expect(result).to.be.false;
      });
    });
  });

  describe('register', () => {
    let userService: UserService = null;
    let userRepositoryCreateSpy: sinon.SinonSpy = null;
    let userServiceSendEmailForVerificationSpy: sinon.SinonSpy = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      sinon.stub(userRepository, 'findByUsername').callsFake((username: string) => {
        if (username === 'demousername1') {
          return Promise.resolve(new User(null, null, null, null, null, null, null));
        } else {
          return Promise.resolve(null);
        }
      });

      userRepositoryCreateSpy = sinon.spy(userRepository, "create");

      userService = new UserService('sendgridapikey', {
        address: "Test Address",
        applicationName: "",
        baseUri: "http://localhost",
        verificationUrl: "",
      }, 'secretkey', userRepository, null);

      sinon.stub(userService, 'sendEmail').callsFake(() => {
        return Promise.resolve(true);
      });

      userServiceSendEmailForVerificationSpy = sinon.spy(userService, 'sendEmailForVerification');

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

    it('should call userRepository.create given username does not exist', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername2');

        expect(userRepositoryCreateSpy.calledOnce).to.be.true;
      });
    });

    it('should not call userRepository.create given username does exist', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername1');

        expect(userRepositoryCreateSpy.notCalled).to.be.true;
      });
    });

    it('should call userService.sendEmailForVerification given username in email address format', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername@example.com');

        expect(userServiceSendEmailForVerificationSpy.calledOnce).to.be.true;
      });
    });

    it('should not call userService.sendEmailForVerification given username in non email address format', () => {
      return co(function*() {
        const result: User = yield userService.register('demousername');

        expect(userServiceSendEmailForVerificationSpy.notCalled).to.be.true;
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
        } else {
          return Promise.resolve(null);
        }
      });

      userService = new UserService('sendgridapikey', null, 'secretkey', userRepository, null);

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

  describe('login', () => {
    let userService: UserService = null;
    let userRepositoryUpdateSpy: sinon.SinonSpy = null;

    beforeEach(() => {
      const userRepository = new UserRepository();

      sinon.stub(userRepository, 'findByUsername').callsFake((username: string) => {
        if (username === 'demousername1') {
          return Promise.resolve(new User(null, null, null, null, null, null, null));
        } else {
          return Promise.resolve(null);
        }
      });

      userRepositoryUpdateSpy = sinon.spy(userRepository, "update");

      userService = new UserService('sendgridapikey', null, 'secretkey', userRepository, null);

    });

    it('should return true given username does exist', () => {
      return co(function*() {
        const result: User = yield userService.login('demousername1');

        expect(result).to.be.true;
      });
    });

    it('should return false given username does not exist', () => {
      return co(function*() {
        const result: User = yield userService.login('demousername2');

        expect(result).to.be.false;
      });
    });

    it('should call userRepository.update given username does exist', () => {
      return co(function*() {
        const result: User = yield userService.login('demousername1');

        expect(userRepositoryUpdateSpy.calledOnce).to.be.true;
      });
    });

    it('should not call userRepository.update given username does not exist', () => {
      return co(function*() {
        const result: User = yield userService.login('demousername2');

        expect(userRepositoryUpdateSpy.notCalled).to.be.true;
      });
    });
  });

  describe('addPermssion', () => {
    let userService: UserService = null;
    let userRepositoryUpdateSpy: sinon.SinonSpy = null;

    beforeEach(() => {
      const userRepository = new UserRepository();
      const permissionRepository = new PermissionRepository();

      sinon.stub(userRepository, 'findByUsername').callsFake((username: string) => {
        if (username === 'demousername1') {
          return Promise.resolve(new User(null, null, null, [], null, null, null));
        } else {
          return Promise.resolve(null);
        }
      });

      sinon.stub(permissionRepository, 'findById').callsFake((id: string) => {
        if (id === 'permission1') {
          return Promise.resolve(new Permission('permission1', 'Permission1'));
        } else {
          return Promise.resolve(null);
        }
      });

      userRepositoryUpdateSpy = sinon.spy(userRepository, 'update');

      userService = new UserService('sendgridapikey', null, 'secretkey', userRepository, permissionRepository);

    });

    it('should return false given username does not exist', () => {
      return co(function*() {
        const result: boolean = yield userService.addPermission('demousername2', 'permission1');

        expect(result).to.be.false;
      });
    });

    it('should return true given username does exist', () => {
      return co(function*() {
        const result: boolean = yield userService.addPermission('demousername1', 'permission1');

        expect(result).to.be.true;
      });
    });

    it('should return false given permissionId does not exist', () => {
      return co(function*() {
        const result: boolean = yield userService.addPermission('demousername1', 'permission2');

        expect(result).to.be.false;
      });
    });

    it('should return true given permissionId does exist', () => {
      return co(function*() {
        const result: boolean = yield userService.addPermission('demousername1', 'permission1');

        expect(result).to.be.true;
      });
    });

    it('should call userRepository.update given permissionId and username does exist', () => {
      return co(function*() {
        const result: boolean = yield userService.addPermission('demousername1', 'permission1');

        expect(userRepositoryUpdateSpy.calledOnce).to.be.true;
      });
    });

    it('should call not userRepository.update given permissionId and username does not exist', () => {
      return co(function*() {
        const result: boolean = yield userService.addPermission('demousername2', 'permission2');

        expect(userRepositoryUpdateSpy.notCalled).to.be.true;
      });
    });

  });

});
