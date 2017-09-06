var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var assert = require('assert');

describe('inbound', function () {
  this.timeout(10000);
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
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          "queryString": "公司",
          "begin": 1,
          "end": 2
        })
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          assert.equal(res.body.length, 2);
          done();
        });
    });
    it('expect 200', function (done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({})
        .expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          res.body.length.should.equal(10);
          done();
        });
    })
    it('expect 200', function(done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          capitalLowerBound: 1000000,
          capitalUpperBound: 1000000
        }).expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          assert(res.body[0].profile.capital, 1000000);
          done();
        });
    });
    it('expect 200', function(done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          employeeLowerBound: 100,
          employeeUpperBound: 100
        }).expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          assert(res.body[0].profile.employee, 100);
          done();
        });
    });
    it('expect 200', function(done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          "queryString": "愛力皮包實業有限公司"
        }).expect(200)
        .end(function(err, res) {
          if (err) {
            done(err);
          }
          assert(res.body[0].name, "愛力皮包實業有限公司");
          done();
        });
    });
  })

});