var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  teamOneId: {
    type: String,
    required: true
  },
  teamTwoId: {
    type: String,
    required: true
  },
  teamOneGoals: {
    type: Number,
    required: true
  },
  teamTwoGoals: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Match', matchSchema);
