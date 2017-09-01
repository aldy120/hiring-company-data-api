var assert = require('assert');
var mongoUtil = require('./mongoUtil');

var db;
var col;
function insertDocument(document, callback) {
  db = mongoUtil.getDb();
  col = 'companyInfo';
  db.collection(col).insertOne(document, function (err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);
    callback();
  });
}
function findDocument(filter, callback) {
  db = mongoUtil.getDb();
  col = 'companyInfo';

  var skip = 0, limit = 10;
  var begin = filter.begin, end = filter.end;
  // if begin and end is valid
  if (begin > 0 && end > 0 && begin <= end) {
    skip = filter.begin;
    limit = filter.end - filter.begin + 1;
  }

  db.collection(col).find({
    name: { $regex: filter.queryString || '' },
  }).skip(skip)
    .limit(limit)
    .toArray(function (err, docs) {
      if (err) console.log(err);
      assert.equal(null, err);
      callback(docs);
    });
}

module.exports = {
  insertDocument,
  findDocument
}