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
function findDocuments(filter, callback) {
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

  // querystring
  if (filter.queryString) {
    if (filter.fuzzy) {
      myfilter = {
        $or: [
          { name: { $regex: escapeRegexp(escapeRegexp(filter.queryString)) } },
          { information: { $regex: escapeRegexp(filter.queryString) } },
          { service: { $regex: escapeRegexp(filter.queryString) } },
          { philosophy: { $regex: escapeRegexp(filter.queryString) } }
        ],
      }
    } else {
      myfilter = {
        name: { $regex: escapeRegexp(filter.queryString) }
      }
    }
  }

  // employeeLowerBound employeeLowerBound
  var employeeLowerBound = filter.employeeLowerBound || -1;
  var employeeUpperBound = filter.employeeUpperBound || Infinity;
  myfilter['profile.employee'] = {
    $gte: employeeLowerBound,
    $lte: employeeUpperBound
  }

  // capitalLowerBound capitalLowerBound
  var capitalLowerBound = filter.capitalLowerBound || -1;
  var capitalUpperBound = filter.capitalUpperBound || Infinity;
  myfilter['profile.capital'] = {
    $gte: capitalLowerBound,
    $lte: capitalUpperBound
  }

  // information service welfare philosophy
  'information service welfare philosophy'.split(' ')
    .forEach(function (field) {
      if (filter[field]) {
        myfilter[field] = { $regex: escapeRegexp(filter[field]) }
      }
    });

  // area
  if (filter.area) {
    myfilter['profile.address'] = {
      $regex: escapeRegexp(filter.area)
    };
  }

  // industry
  if (filter.industry) {
    myfilter['profile.industry'] = {
      $regex: escapeRegexp(filter.industry)
    };
  }
  
  // send query
  db.collection(col)
    .find(myfilter)
    .skip(skip)
    .limit(limit)
    .toArray(function (err, docs) {
      if (err) console.log(err);
      assert.equal(null, err);
      callback(docs);
    });

  function escapeRegexp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

module.exports = {
  insertDocument,
  findDocument
}