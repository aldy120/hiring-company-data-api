var companyInfo = require('../helpers/companyInfo');
var tagCol = require('../helpers/tagCol');
var ObjectID = require('mongodb').ObjectID;

function isMongoID(id) {
  return /^[a-f0-9]{24}$/i.test(id);
}
function createTag(req, res) {
  var companyId = req.swagger.params._id.value;
  if (!isMongoID(companyId)) {
    res.status(400).json({message: 'not a valid mongo ID'});
    return;
  }
  var tag = req.swagger.params.body.value;
  // check company exist
  companyInfo.findOneDocument(new ObjectID(companyId), function(company) {
    // company do not exist 
    if (!company) {
      res.status(404).json({message: 'company not found'});
      return;
    }

    // check tag name is not used
    tagCol.findOneDocument(tag, function(doc) {
      // if tag do not exist
      if (!doc) {
        tagCol.insertOneDocument(tag);
        doc = tag;
      }
      
      // doc is the tag
      companyInfo.addToTags(new ObjectID(companyId), doc._id, function(r) {
        res.json({
          add: doc,
          to: r.value
        });
      });
    })
  })
}

function findTags(req, res) {
  var companyID = req.swagger.params._id.value;
  if (!isMongoID(companyID)) {
    res.status(400).json({message: 'not a valid mongo ID'});
    return;
  }
  companyInfo.findOneDocument(new ObjectID(companyID), function(doc) {
    if (!doc) {
      res.status(404).json({message: 'company not found'});
      return;
    }
    companyInfo.lookupTags(new ObjectID(companyID), function(docs) {
      res.json(docs.map(doc => doc.tag_docs[0]));
    })
  })
}

function removeOneTag(req, res) {
  var companyID = req.swagger.params._id.value;
  var tagID = req.swagger.params.tag_id.value;
  if (!isMongoID(companyID)) {
    res.status(400).json({message: 'companyID is not a valid mongodb objectID'});
    return;
  }
  if (!isMongoID(tagID)) {
    res.status(400).json({message: 'tagID is not a valid mongodb objectID'});
    return;
  }
  companyInfo.removeOneTag(new ObjectID(companyID), new ObjectID(tagID), function(doc) {
    if (!doc) {
      res.status(404).json({message: 'company not found'});
      return;
    }
    res.json(doc);
  })
}

function findAllTags(req, res) {
  tagCol.findAllDocuments(function(tagList) {
    res.json(tagList);
  });
}

function findCompaniesByTag(req, res) {
  var tagID = req.swagger.params.tag_id.value;
  if (!isMongoID(tagID)) {
    res.status(400).json({message: 'tagID is not a valid mongo objectID'});
    return;
  }
  var begin = req.swagger.params.begin.value
  var end = req.swagger.params.end.value
  if (begin < 0) {
    res.status(400).json({message: 'begin must be positive integer'})
    return
  }
  if (end < 0) {
    res.status(400).json({message: 'end must be positive integer'})
    return
  }
  if (begin > end) {
    res.status(400).json({message: 'begin must be less or equal than end'})
    return
  }
  skip = begin
  limit = end - begin + 1
  companyInfo.findDocumentsByTagID(new ObjectID(tagID), skip, limit, function(list) {
    res.json(list)
  })
}

function findTagById(req, res) {
  var tagId = req.swagger.params.tag_id.value;
  if (!isMongoID(tagId)) {
    res.status(400).json({message: 'tagId is not a valid mongo objectID'})
    return;
  }
  tagCol.findOneDocument({_id: new ObjectID(tagId)}, function(doc) {
    doc ? res.json(doc) : res.status(404).json({message:'Tag not found'})
  })
}

module.exports = {
  createTag,
  findTags,
  removeOneTag,
  findAllTags,
  findCompaniesByTag,
  findTagById
}