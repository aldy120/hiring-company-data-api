var db = require('../helpers/db');

function insertOne(req, res) {
  var doc = req.swagger.params.body.value;
  db.insertDocument(doc);
  res.status(200).json(doc);
}
function find(req, res) {
  var filter = req.swagger.params.body.value;
  db.findDocument(filter, function(doc) {
    res.json(doc);
  });
}

module.exports = {
  insertOne,
  find
};
