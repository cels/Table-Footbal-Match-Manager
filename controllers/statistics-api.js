var Statistics = require('../models/statistics');

var getStatistics = function(req, res) {
  Statistics.findOne({}, {}, {
    sort: {
      '_id': -1
    }
  }, function(err, stats) {
    if(err) {
      var msg = "Internal Server Error: Error while getting latest statistics";
      console.log(msg, err);
      res.status(500).send(err).end();
    } else {
      res.json(stats);
    }
  });
};

exports.getStatistics = getStatistics;
