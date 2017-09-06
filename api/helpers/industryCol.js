var mongoUtil = require('./mongoUtil');
var assert = require('assert');

function findIndustry(callback) {
  var db = mongoUtil.getDb();
  db.collection('industry').findOne({}, function(err, doc) {
    assert.equal(null, err);
    callback(doc);
  })
}

module.exports = {
  findIndustry
}