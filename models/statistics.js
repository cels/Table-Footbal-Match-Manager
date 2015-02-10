var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var statisticsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  statistics: {
    numOfGames: {
      type: Number,
      required: true
    },
    numOfGoals: {
      type: Number,
      required: true
    },
    longestKillStreakPlayer: {
      type: Number,
      required: true
    },
    longestKillStreakPlayerName: [{
      type: String,
      required: true
    }],
    longestKillStreakTeam: {
      type: Number,
      required: true
    },
    longestKillStreakTeamNames: [{
      type: String,
      required: true
    }],
    mostWonByZero: {
      type: Number,
      required: true
    },
    mostWonByZeroName: [{
      type: String,
      required: true
    }]
  },
  teamStatistics: [{
    name1: {
      type: String,
      required: true
    },
    name2: {
      type: String,
      required: true
    },
    goalsOwn: {
      type: Number,
      required: true
    },
    goalsEnemy: {
      type: Number,
      required: true
    },
    games: {
      type: Number,
      required: true
    },
    win: {
      type: Number,
      required: true
    },
    draw: {
      type: Number,
      required: true
    },
    loss: {
      type: Number,
      required: true
    },
    goalsOwnPerGame: {
      type: Number,
      required: true
    },
    goalsEnemyPerGame: {
      type: Number,
      required: true
    },
    goalRate: {
      type: Number,
      required: true
    },
    killStreak: {
      type: Number,
      required: true
    },
    longestKillStreak: {
      type: Number,
      required: true
    },
    wonByZero: {
      type: Number,
      required: true
    }
  }],
  playerStatistics: [{
    name: {
      type: String,
      required: true
    },
    goalsOwn: {
      type: Number,
      required: true
    },
    goalsEnemy: {
      type: Number,
      required: true
    },
    games: {
      type: Number,
      required: true
    },
    win: {
      type: Number,
      required: true
    },
    draw: {
      type: Number,
      required: true
    },
    loss: {
      type: Number,
      required: true
    },
    goalsOwnPerGame: {
      type: Number,
      required: true
    },
    goalsEnemyPerGame: {
      type: Number,
      required: true
    },
    goalRate: {
      type: Number,
      required: true
    },
    killStreak: {
      type: Number,
      required: true
    },
    longestKillStreak: {
      type: Number,
      required: true
    },
    wonByZero: {
      type: Number,
      required: true
    }
  }]
});

module.exports = mongoose.model('Statistics', statisticsSchema);
