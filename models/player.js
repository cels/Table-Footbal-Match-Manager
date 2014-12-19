var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: {
    type: String,
    required: true
  }

  //TODO: create index on name
});

module.exports = mongoose.model('Player', playerSchema);
