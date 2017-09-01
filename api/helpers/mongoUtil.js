var MongoClient = require('mongodb').MongoClient;

var _db;
var uri = 'mongodb://comopanyApi:cz0dgWNMmP2vkDGY@cluster0-shard-00-00-hyjpb.mongodb.net:27017,cluster0-shard-00-01-hyjpb.mongodb.net:27017,cluster0-shard-00-02-hyjpb.mongodb.net:27017/company-api?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(uri, function(err, db) {
      _db = db;
      return callback(err);
    })
  },
  getDb: function() {
    return _db;
  }
}