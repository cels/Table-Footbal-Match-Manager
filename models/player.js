var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }

  //TODO: create index on name
});

playerSchema.index({name: 1, type: -1});

// uncomment in production
// playerSchema.set('autoIndex', false);

module.exports = mongoose.model('Player', playerSchema);
