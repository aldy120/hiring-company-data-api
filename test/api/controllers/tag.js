var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var assert = require('assert');


var existId = '59b65ce0b8fb234d0493f778';
var nonExistId = '19b65ce0b8fb234d0493f770'

describe('POST /company/{_id}/tag', function() {
  it('add a new tag', function(done) {
    request(server)
      .post('/company/' + existId + '/tag')
      .set('Accept', 'application/json')
      .send({name: 'test company'})
      .expect(200, done);
  });
  it('company does not exist', function(done) {
    request(server) 
      .post('/company/' + nonExistId + '/tag')
      .set('Accept', 'application/json')
      .send({name: 'test company'})
      .expect(404, done);
  })
  it('invalid company id', function(done) {
    request(server) 
      .post('/company/' + 'qwe123' + '/tag')
      .set('Accept', 'application/json')
      .send({name: 'test company'})
      .expect(400, done);
  })
});
describe('GET /company/{_id}/tag', function() {
  it('get all tags in a company', function(done) {
    request(server)
      .get('/company/' + existId + '/tag')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('company does not exist', function(done) {
    request(server) 
      .get('/company/' + nonExistId + '/tag')
      .set('Accept', 'application/json')
      .send({name: 'test company'})
      .expect(404, done);
  })
  it('invalid company id', function(done) {
    request(server) 
      .get('/company/' + 'qwe123' + '/tag')
      .set('Accept', 'application/json')
      .send({name: 'test company'})
      .expect(400, done);
  })
})