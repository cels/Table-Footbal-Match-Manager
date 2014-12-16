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

  //todo: create index on firstname+lastname
});

module.exports = mongoose.model('Player', playerSchema);
