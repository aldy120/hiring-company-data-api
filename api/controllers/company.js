var companyInfo = require('../helpers/companyInfo');
var ObjectID = require('mongodb').ObjectID;

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
function findOneById(req, res) {
  var id = req.swagger.params._id.value;
  if (!isMongoId(id)) {
    res.status(400)
      .json({
        message: 'get a invalid mongoID.'
      });
  }
  companyInfo.findOneDocument(new ObjectID(id), function(doc) {
    res.json(doc);
  });
}
function isMongoId(id) {
  return /^[a-f0-9]{24}$/i.test(id);
}
function updateOneById(req, res) {
  var id = req.swagger.params._id.value;
  if (!isMongoId(id)) {
    res.status(400)
      .json({
        message: 'Receive a invalid mongoID'
      });
  }
  var update = req.swagger.params.body.value;
  companyInfo.updateOneDocument(new ObjectID(id), update, function(doc) {
    res.json(doc);
  });
}
function deleteOneById(req, res) {
  var id = req.swagger.params._id.value;
  if (!isMongoId(id)) {
    res.status(400).json({
      message: 'Receive a invalid mongoID'
    })
  }
  companyInfo.deleteOneDocument(new ObjectID(id), function(doc) {
    doc ? res.json(doc) : res.json({});
    
  })
}
module.exports = {
  insertOne,
  find,
  findOneById,
  updateOneById,
  deleteOneById
};
