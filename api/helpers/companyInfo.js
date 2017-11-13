var assert = require('assert');
var mongoUtil = require('./mongoUtil');

var db;
var col;
function insertDocument(document) {
  db = mongoUtil.getDb();
  col = 'companyInfo';
  db.collection(col).insertOne(document, function (err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);
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
  // employeeLowerBound employeeUpperBound
  var employeeLowerBound = filter.employeeLowerBound
  var employeeUpperBound = filter.employeeUpperBound
  
  if (employeeLowerBound) {
    if (!myfilter['profile.employee']) {
      myfilter['profile.employee'] = {}
    }
    myfilter['profile.employee'].$gte = employeeLowerBound;
  }
  if (employeeUpperBound) {
    if (!myfilter['profile.employee']) {
      myfilter['profile.employee'] = {}
    }
    myfilter['profile.employee'].$lte = employeeUpperBound;
  }

  // capitalLowerBound capitalLowerBound
  
  var capitalLowerBound = filter.capitalLowerBound;
  var capitalUpperBound = filter.capitalUpperBound;
  if (capitalLowerBound) {
    if (!myfilter['profile.capital']) {
      myfilter['profile.capital'] = {};
    }
    myfilter['profile.capital'].$gte = capitalLowerBound;
  }
  if (capitalUpperBound) {
    if (!myfilter['profile.capital']) {
      myfilter['profile.capital'] = {}
    }
    myfilter['profile.capital'].$lte = capitalUpperBound;
  }

  // information service welfare philosophy
  'information service welfare philosophy'.split(' ')
    .forEach(function (field) {
      if (filter[field]) {
        myfilter[field] = { $regex: escapeRegexp(filter[field]) }
      }
    });

  
  // area
  // filter.area is an array of string, and we want to find
  // the companies which meet the union of area array.
  if (filter.area) {
    if (!myfilter['$and']) {
      myfilter['$and'] = []
    }
    myfilter['$and'].push({$or: filter.area.map(x => ({
      'profile.address': {$regex: escapeRegexp(x)}
    }))})
  }

  // industry
  // filter.industry is an array, and we want to find the companies
  // which meet the union of industry array.
  if (filter.industry) {
    if (!myfilter['$and']) {
      myfilter['$and'] = []
    }
    myfilter['$and'].push({$or: filter.industry.map(x => ({
      'profile.industry': {$regex: escapeRegexp(x)}
    }))})
  }

  // tags
  if (filter.tags) {
    myfilter['tags'] = {
      $all: filter.tags
    }
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
function findOneDocument(id, callback) {
  var db = mongoUtil.getDb();
  var col = db.collection('companyInfo');
  col.findOne({_id: id}, function(err, doc) {
    assert.equal(null, err);
    callback(doc);
  })
}
function updateOneDocument(id, update, callback) {
  var db = mongoUtil.getDb();
  var col = db.collection('companyInfo');
  col.findOneAndUpdate({_id: id}, {
    $set: update
  }, {
    returnOriginal: false
  }, function(err, result) {
    assert.equal(null, err);
    callback(result.value);
  });
}
function deleteOneDocument(id, callback) {
  var db = mongoUtil.getDb();
  var col = db.collection('companyInfo');
  col.findOneAndDelete({_id: id}, function(err, result) {
    assert.equal(null, err);
    callback(result.value);
  })
}

function addToTags(companyID, tagID, callback) {
  var db = mongoUtil.getDb();
  db.collection('companyInfo').findOneAndUpdate({_id: companyID}, {$addToSet: {tags: tagID}}, {returnOriginal: false}, function(err, r) {
    callback(r);
  })
}

function lookupTags(companyID, callback) {
  var db = mongoUtil.getDb();
  
  db.collection('companyInfo').aggregate([
    {$match: {_id: companyID}}, 
    {$project: {tags: 1, _id: 0}},
    {$unwind: '$tags'},
    {$lookup: {
      from: 'tag',
      localField: 'tags',
      foreignField: '_id',
      as: 'tag_docs'
    }}
  ], function(err, result) {
    callback(result);
  })
}

function removeOneTag(companyID, tagID, callback) {
  var db = mongoUtil.getDb();
  db.collection('companyInfo').findOneAndUpdate({_id: companyID}, {
    $pull: {tags: tagID}
  }, {
    returnOriginal: false
  }, function(err, r) {
    assert.equal(null, err);
    callback(r.value);
  });
}

function findDocumentsByTagID(tagID, callback) {
  var db = mongoUtil.getDb();
  var filter = {
    tags: tagID
  }
  db.collection('companyInfo').find(filter).toArray(function(err, list) {
    assert.equal(null, err);
    callback(list)
  })
}

module.exports = {
  insertDocument,
  findDocuments, 
  findOneDocument,
  updateOneDocument,
  deleteOneDocument,
  addToTags,
  lookupTags,
  removeOneTag,
  findDocumentsByTagID
}
