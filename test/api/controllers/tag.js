var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var assert = require('assert');


var existId = '59b65ce0b8fb234d0493f778';
var nonExistId = '19b65ce0b8fb234d0493f770'
var tagID = '59c4bd60538ca029b50f21ca'
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
describe('DELETE /company/{_id}/tag/{tag_id}', function() {
  it('delete a tag from a company', function(done) {
    request(server)
      .delete('/company/' + existId + '/tag/' + tagID)
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('nonexistent companyID', function(done) {
    request(server)
      .delete('/company/' + nonExistId + '/tag/' + tagID)
      .set('Accept', 'application/json')
      .expect(404, done);
  });
  it('nonexistent tagID', function(done) {
    request(server) 
      .delete('/company' + existId + '/tag/' + nonExistId)
      .set('Accept', 'application/json')
      .expect(404, done);
  });
  it('invalid companyID', function(done) {
    request(server) 
      .delete('/company/' + '1234' + '/tag/' + nonExistId)
      .set('Accept', 'application/json')
      .expect(400, done);
  });
  it('invalid tagID', function(done) {
    request(server) 
      .delete('/company/' + existId + '/tag/' + '4321')
      .set('Accept', 'application/json')
      .expect(400, done);
  });
  it('repeat delete a tag from a company', function(done) {
    request(server)
      .delete('/company/' + existId + '/tag/' + tagID)
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
describe('GET /company/tag', function() {
  it('get all tags', function(done) {
    request(server)
      .get('/company/tag')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
describe('GET /company/tag/{tag_id}', function() {
  it('find company by id', function(done) {
    request(server)
      .get('/company/tag/' + tagID)
      .set('Accept', 'application/json')
      .expect(200, done);
  });
  it('invalid tagID', function(done) {
    request(server)
      .get('/company/tag/' + '12345678')
      .set('Accept', 'application/json')
      .expect(400, done);
  });
  it('nonexistent mangoID', function(done) {
    request(server)
      .get('/company/tag/' + nonExistId)
      .set('Accept', 'application/json')
      .expect(200, done);
  })
})
describe('GET /tag/{tag_id}', function() {
  it('find tag by id', function(done) {
    request(server)
      .get('/tag/' + tagID)
      .set('Accept', 'application/json')
      .expect(200, done);
  })
  it('invalid tagID', function(done) {
    request(server)
      .get('/tag/' + '12345678')
      .set('Accept', 'application/json')
      .expect(400, done);
  });
  it('nonexistent mongoID', function(done) {
    request(server)
      .get('/tag/' + nonExistId)
      .set('Accept', 'application/json')
      .expect(404, done);
  })
})