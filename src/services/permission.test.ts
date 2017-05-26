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

    beforeEach(() => {
      const permissionRepository = new PermissionRepository();

      permissionService = new PermissionService(permissionRepository);

    });

    it('should return permission given valid parameters', () => {
     return co(function*() {
        const result: Permission = yield permissionService.create('permission1');

        expect(result).to.be.not.null;
        expect(result.id).to.be.not.null;
      });
    });
  });
});
