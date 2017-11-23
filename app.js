'use strict';
var mongoUtil = require('./api/helpers/mongoUtil');
var assert = require('assert');
var app = require('express')();
var cors = require('cors')
module.exports = app; // for testing

var corsOptions = {
  origin: 'http://example.com'
}
app.use(cors(corsOptions))

mongoUtil.connectToServer(function(err) {
  var SwaggerExpress = require('swagger-express-mw');
  
  
  var config = {
    appRoot: __dirname // required config
  };
  SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }
    
    // install middleware
    swaggerExpress.register(app);
  
    var port = process.env.PORT || 10010;
    app.listen(port);
  
    if (swaggerExpress.runner.swagger.paths['/hello']) {
      console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
    }
  });
  
})
