var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Player', playerSchema);
