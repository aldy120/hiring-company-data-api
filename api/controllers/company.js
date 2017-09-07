var companyInfo = require('../helpers/companyInfo');

function insertOne(req, res) {
  var doc = req.swagger.params.body.value;
  companyInfo.insertDocument(doc);
  res.status(200).json(doc);
}
function find(req, res) {
  var filter = req.swagger.params.body.value;
  companyInfo.findDocuments(filter, function(doc) {
    res.json(doc);
  });
}

module.exports = {
  insertOne,
  find
};
