var companyInfo = require('../helpers/companyInfo');
var ObjectID = require('mongodb').ObjectID;

function insertOne(req, res) {
  var doc = req.swagger.params.body.value;
  companyInfo.insertDocument(doc);
  res.status(200).json(doc);
}
function find(req, res) {
  var filter = req.swagger.params.body.value;
  if (isLowerBoundGtUpperBound(filter, 'begin', 'end')) {
    res.status(400).json({
      message: '<begin> is greater than <end>'
    })
    return;
  }
  if (isLowerBoundGtUpperBound(filter, 'employeeLowerBound', 'employeeUpperBound')) {
    res.status(400).json({
      message: '<employeeLowerBound> is greater than <employeeUpperBound>'
    })
    return;
  }
  if (isLowerBoundGtUpperBound(filter, 'capitalLowerBound', 'capitalUpperBound')) {
    res.status(400).json({
      message: '<capitalLowerBound> is greater than <capitalUpperBound>'
    })
    return;
  }
  if (filter.tags) {
    if (filter.tags.length) {
      var index;
      if (filter.tags.some((tagID, i) => {
        index = i;
        return !isMongoId(tagID)
      })) {
        res.status(400).json({message: `tags[${index}] is not a valid mongo objectID`});
        return;
      }
      filter.tags = filter.tags.map(tagID => new ObjectID(tagID));
    } else {
      delete filter.tags;
    }
  }
  companyInfo.findDocuments(filter, function(doc) {
    res.json(doc);
  });
  function isLowerBoundGtUpperBound(filter, lowerBoundFieldname, upperBoundFieldname) {
    return filter[lowerBoundFieldname] > filter[upperBoundFieldname];
  }
}
function findOneById(req, res) {
  var id = req.swagger.params._id.value;
  if (!isMongoId(id)) {
    res.status(400)
      .json({
        message: 'get a invalid mongoID.'
      });
    return;
  }
  companyInfo.findOneDocument(new ObjectID(id), function(doc) {
    doc ? res.json(doc) : res.status(404).json({message: 'Company not found'});
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
    return;
  }
  var update = req.swagger.params.body.value;
  if (Object.keys(update).length === 0) {
    res.status(400).json({message: '<update> should not be empty'});
    return;
  }
  companyInfo.updateOneDocument(new ObjectID(id), update, function(doc) {
    doc ? res.json(doc) : res.status(404).json({message: 'Company not found'});
  });
}
function deleteOneById(req, res) {
  var id = req.swagger.params._id.value;
  if (!isMongoId(id)) {
    res.status(400).json({
      message: 'Receive a invalid mongoID'
    })
    return;
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
