var areaCol = require('../helpers/areaCol');
var assert = require('assert');

function findArea(req, res) {
  areaCol.findArea(function(doc) {
    res.json(doc);
  })
}

module.exports = {
  findArea
}