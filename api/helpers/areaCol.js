var mongoUtil = require('./mongoUtil');

function findArea(callback) {
  var db = mongoUtil.getDb();
  db.collection('area').find({}).toArray(function(err, doc) {
    callback(doc[0]);
  })
}

module.exports = {
  findArea
}