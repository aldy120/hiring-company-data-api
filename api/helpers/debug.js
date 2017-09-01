var mongoUtil = require('./mongoUtil');

mongoUtil.connectToServer(function(err) {
  if (err) {
    console.log(err);
  }
  var db = mongoUtil.getDb();
  var col = 'companyInfo';
  db.collection(col).find({
    name: {
      $regex: 'AA'
    }
  }).limit(10).toArray(function(err, docs) {
    console.log(docs);
    db.close();
    db.collection(col).find({
      name: {
        $regex: '104'
      }
    }).limit(10).toArray(function(err, docs) {
      if (err) console.log(err);
      console.log(docs);
      db.close();
    })
  });
 
});