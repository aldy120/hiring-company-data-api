var should = require('should');
var request = require('supertest');
var server = require('../../../app');
describe('inbound', function () {
  describe('post /company/filter', function () {
    it('expect 200', function (done) {
      this.timeout(10000);
      setTimeout(() => {
        request(server)
          .post('/company/filter')
          .set('Accept', 'application/json')
          .send({
            "queryString": "公司",
            "begin": 1,
            "end": 2
          })
          .expect(200, done);
      }, 3000);
    });
    it('expect 200', function (done) {
      this.timeout(10000);
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          "queryString": "公司",
          "begin": 1,
          "end": 2
        })
        .expect(200, done);
    });
    it('expect 200', function (done) {
      this.timeout(10000);
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
        })
        .expect(200, done);
    })
  })

});