var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
  playerIds: [String]
});

module.exports = mongoose.model('Team', teamSchema);
