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
  var myfilter = {};
  if (filter.queryString) {
    myfilter.information = myfilter.service
      = myfilter.philosophy = myfilter.name = { $regex: filter.queryString };
    myfilter = {
      $or: [
        { name: { $regex: filter.queryString } },
        { information: { $regex: filter.queryString }},
        {service: { $regex: filter.queryString }},
        {philosophy: { $regex: filter.queryString }}
      ]
    }
  }

  db.collection(col)
    .find(myfilter)
    .skip(skip)
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