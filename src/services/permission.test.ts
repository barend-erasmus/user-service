// Imports
import { expect } from 'chai';
import * as co from 'co';
import 'mocha';
import * as sinon from 'sinon';

// Imports repositories
import { PermissionRepository } from './../repositories/mock/permission';

// Imports services
import { PermissionService } from './permission';

// Imports models
import { Permission } from './../models/permission';

describe('PermissionService', () => {

  describe('create', () => {
    let permissionService: PermissionService = null;
    let permissionRepositoryCreateSpy: sinon.SinonSpy = null;

    beforeEach(() => {
      const permissionRepository = new PermissionRepository();

      permissionRepositoryCreateSpy = sinon.spy(permissionRepository, 'create');

      permissionService = new PermissionService(permissionRepository);

    });

    it('should return permission given valid parameters', () => {
     return co(function*() {
        const result: Permission = yield permissionService.create('permission1');

        expect(result).to.be.not.null;
        expect(result.id).to.be.not.null;
      });
    });

    it('should call permissionRepository.create', () => {
     return co(function*() {
        const result: Permission = yield permissionService.create('permission1');

        expect(permissionRepositoryCreateSpy.calledOnce).to.be.true;
      });
    });
  });

  describe('list', () => {
    let permissionService: PermissionService = null;
    let permissionRepositoryListSpy: sinon.SinonSpy = null;

    beforeEach(() => {
      const permissionRepository = new PermissionRepository();

      permissionRepositoryListSpy = sinon.spy(permissionRepository, 'list');

      permissionService = new PermissionService(permissionRepository);

    });

    it('should call permissionRepository.list', () => {
     return co(function*() {
        const result: Permission = yield permissionService.list();

        expect(permissionRepositoryListSpy.calledOnce).to.be.true;
      });
    });
  });
});
