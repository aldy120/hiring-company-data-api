var mongoUtil = require('./mongoUtil');
var assert = require('assert');

function insertOneDocument(doc) {
  var db = mongoUtil.getDb();
  db.collection('tag').insertOne(doc, function(err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);
  })
}

function findOneDocument(doc, callback) {
  var db = mongoUtil.getDb();
  db.collection('tag').findOne(doc, function(err, doc) {
    assert.equal(err, null);
    callback(doc);
  })
}

module.exports = {
  insertOneDocument,
  findOneDocument
}