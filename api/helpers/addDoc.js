var mongoUtil = require('./mongoUtil');


mongoUtil.connectToServer(function(err) {
  var db = require('./db'); // db 裡面也會用到 mongoUtil.getDb(), 所以要放在裡面
  
  db.insertDocument({a: 7}, function() {
    console.log('{a: 7} inserted')
  })
})