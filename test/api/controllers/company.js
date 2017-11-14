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
      }, 5000);
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
          "area": ["大安區"],
          "industry": ["餐館業"]
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

describe('Outbound', function() {
  describe('POST /company/filter', function() {
    it('begin is greater than end', function(done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          begin: 3,
          end: 2
        })
        .expect(400, done);
    });
    it('capitalLowerBound is greater than capitalUpperBound', function(done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          capitalLowerBound: 4,
          capitalUpperBound: 3
        })
        .expect(400, done);
    });
    it('employeeLowerBound is greater than empolyeeUpperBound', function(done) {
      request(server)
        .post('/company/filter')
        .set('Accept', 'application/json')
        .send({
          employeeLowerBound: 5,
          employeeUpperBound: 3
        })
        .expect(400, done);
    })
  });
  describe('GET /company/{_id}', function() {
    it('invalid mongo objectID', function(done) {
      var _id = '1234'
      request(server)
        .get('/company/' + _id)
        .set('Accept', 'application/json')
        .expect(400, done)
    });
    it('non-exist mongo objectID', function(done) {
      var _id = '123456781234567812345678';
      request(server)
        .get('/company/' + _id)
        .set('Accept', 'application/json')
        .expect(404, done)
    });
  });
  describe('PUT /company/{_id}', function(done) {
    it('invalid mongo objectID', function(done) {
      var _id = '1234'
      request(server)
        .put('/company/' + _id)
        .set('Accept', 'application/json')
        .expect(400, done)
    });
    it('non-exist mongo objectID', function(done) {
      var _id = '123456781234567812345678';
      request(server)
        .put('/company/' + _id)
        .set('Accept', 'application/json')
        .send({name: 'hi'})
        .expect(404, done)
    });
    it('<update> is empty object', function(done) {
      var _id = '123456781234567812345678';
      request(server)
        .put('/company/' + _id)
        .set('Accept', 'application/json')
        .send({})
        .expect(400, done)
    });
  })
  describe('DELETE /company/{_id}', function() {
    it('invalid mongo objectID', function(done) {
      var _id = '1234'
      request(server)
        .delete('/company/' + _id)
        .set('Accept', 'application/json')
        .expect(400, done)
    });
    it('non-exist mongo objectID', function(done) {
      var _id = '123456781234567812345678';
      request(server)
        .delete('/company/' + _id)
        .set('Accept', 'application/json')
        .expect(200, done)
    });
  })
});
describe('POST /company/filter', function() {
  var tagIDgoodCompany = '59c4abf388e9a7258ddbf7b8';
  var tagIDhot = '59c4a92e401f5424cb58e8b1'
  var nonexistentID = '59c4a92e401f5424cb58e8b3'
  it('search by tags', function(done) {
    request(server)
      .post('/company/filter')
      .set('Accept', 'application/json')
      .send({
        tags: [
          tagIDhot
        ]
      })
      .expect(200, done());
  });
  it('invalid tagID', function(done) {
    request(server)
      .post('/company/filter')
      .set('Accept', 'application/json')
      .send({
        tags: [
          tagIDhot,
          nonexistentID,
          '1111'
        ]
      })
      .expect(400, done);
  });
  it('nonexistent tagID', function(done) {
    request(server) 
      .post('/company/filter')
      .set('Accept', 'application/json')
      .send({
        tags: [
          tagIDhot,
          nonexistentID,
        ]
      })
      .expect(200, done);
  });
  it('Union of area and Union of industry', function(done) {
    request(server)
      .post('/company/filter')
      .set('Accept', 'application/json')
      .send({
        "queryString": "誠昌報關有限公司",
        "area": [
          "台北",
          "北市"
        ],
        "industry": [
          "報關",
          "關業"
        ]
      }).expect(200)
      .end(function(err, res) {
        assert(res.body.length > 0);
        done();
      })
  })
  it('Correct begin and end', function(done) {
    request(server)
      .post('/company/filter')
      .set('Accept', 'application/json')
      .send({
        "begin": 1,
        "end": 3,
      })
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.length, 3)
        done()
      })
  })
})