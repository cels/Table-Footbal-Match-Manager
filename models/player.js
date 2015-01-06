var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

playerSchema.index({name: 1, type: -1});

// uncomment in production
// playerSchema.set('autoIndex', false);

module.exports = mongoose.model('Player', playerSchema);
