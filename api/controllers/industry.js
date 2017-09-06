var industryCol = require('../helpers/industryCol');

function findIndustry(req, res) {
  industryCol.findIndustry(function(doc) {
    res.json(doc);
  })
}

module.exports = {
  findIndustry
}