// // Imports
// import { expect } from 'chai';
// import 'mocha';
// import * as request from 'supertest';
// import express = require("express");

// // Imports app
// import { FeatureToggleApi } from './app';

// // Imports factories
// import { RepositoryFactory } from './repositories/mock/repository-factory';

// FeatureToggleApi.repositoryFactory = new RepositoryFactory();

// describe('/api/projects', () => {

//     describe('GET /', () => {

//         let featureToggleApi: FeatureToggleApi = null;

//         beforeEach(() => {
//             featureToggleApi = new FeatureToggleApi(express(), 3000);
//         });

//         it('should return', (done: () => void) => {
//             request(featureToggleApi.getApp())
//                 .get('/api/projects')
//                 .end((err, res) => {
//                     if (err) throw err;

//                     expect(res.status).to.be.not.eq(404);
//                     expect(res.status).to.be.not.eq(500);

//                     done();
//                 });
//         });
//     });
// });
