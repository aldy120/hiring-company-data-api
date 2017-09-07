var should = require('should');
var request = require('supertest');
var server = require('../../../app');
var assert = require('assert');

describe('inbound', function () {
  this.timeout(10000);
  describe('/company/filter', function () {
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
        .end(function (err, res) {
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
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          res.body.length.should.equal(10);
          done();
        });
    })
    it('expect 200', function (done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          capitalLowerBound: 1000000,
          capitalUpperBound: 1000000
        }).expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          assert(res.body[0].profile.capital, 1000000);
          done();
        });
    });
    it('expect 200', function (done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          employeeLowerBound: 100,
          employeeUpperBound: 100
        }).expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          assert(res.body[0].profile.employee, 100);
          done();
        });
    });
    it('expect 200', function (done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          "queryString": "愛力皮包實業有限公司"
        }).expect(200)
        .end(function (err, res) {
          if (err) {
            done(err);
          }
          assert(res.body[0].name, "愛力皮包實業有限公司");
          done();
        });
    });
    it('expect 200', function (done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          "queryString": "帥哥",
          "fuzzy": true,
          "area": "大安區",
          "industry": "餐館業"
        }).expect(200)
        .end(function (err, res) {
          assert.equal(/大安區/.test(res.body[0].profile.address), true);
          assert.equal(/餐館業/.test(res.body[0].profile.industry), true);
          done();
        })
    });
    describe('CRUD a cpmpany', function () {
      var id;
      it('POST /company', function (done) {
        request(server).post('/company')
          .set('Accept', 'application/json')
          .send({
            "name": "myTestCompany"
          }).expect(200)
          .end(function(err, res) {
            assert.equal(null, err);
            assert.equal(res.body.name, 'myTestCompany');
            id = res.body._id;
            done();
          })
      });
      it('GET /company/{_id}', function(done) {
        request(server)
          .get('/company/' + id)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err);
            assert.equal(res.body.name, 'myTestCompany');
            done();
          })
      });
      it('PUT /company/{_id}', function(done) {
        request(server)
          .put('/company/' + id)
          .set('Accept', 'application/json')
          .send({
            name: 'modifiedTestCompany'
          }).expect(200)
          .end(function(err, res) {
            assert.equal(err, null);
            assert.equal(res.body.name, 'modifiedTestCompany');
            done();
          });
      });
      it('DELETE /company/{_id}', function(done) {
        request(server)
          .delete('/company/' + id)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err);
            assert.equal(res.body.name, 'modifiedTestCompany');
            done();
          });
      });
    })
  })

});