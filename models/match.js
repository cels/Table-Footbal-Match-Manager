var mongoose = require('mongoose');
var Player = require('../models/player');

var Schema = mongoose.Schema;

var matchSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  teamOne: {
    playerOne: {
      _id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    playerTwo: {
      _id: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      }
    }
  },
  teamTwo: {
    playerOne: {
      _id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    playerTwo: {
      _id: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      }
    }
  },
  goalsTeamOne: {
    type: Number,
    required: true
  },
  goalsTeamTwo: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Match', matchSchema);
