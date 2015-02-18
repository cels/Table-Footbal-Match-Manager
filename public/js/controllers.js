'use strict';

var kickerControllers = angular.module('kickerControllers', []);

kickerControllers.controller('AddPlayerCtrl', function($scope, $http, Player) {
  $scope.name = null;

  $scope.disabled = false;
  $scope.formError = false;
  $scope.xhrError = false;
  $scope.pending = false;
  $scope.done = false;

  $scope.openPartial = function(partial) {
    window.location.hash = '#/' + partial;
  };

  $scope.addPlayer = function() {
    if(!$scope.name || '' === $scope.name) {
      $scope.formError = true;
    } else {
      $scope.disabled = true;
      $scope.formError = false;
      $scope.pending = true;

      Player.addPlayer($scope.name)
        .success(function(data) {
          $scope.xhrError = false;
          $scope.pending = false;
          $scope.done = true;
        })
        .error(function(data, status, headers, config) {
          $scope.xhrError = true;
          $scope.pending = false;
          $scope.done = false;
        })
        .finally(function() {
          $scope.disabled = false;
        });
    }
  };

  $scope.resetState = function() {
    $scope.disabled = false;
    $scope.formError = false;
    $scope.xhrError = false;
    $scope.pending = false;
    $scope.done = false;
  };
});

kickerControllers.controller('MatchCtrl', function($scope, $http, Player, Match) {
  $scope.allPlayers = null;
  $scope.availablePlayers = null;

  $scope.teamOne = {
    playerOne: null,
    playerTwo: null
  };
  $scope.teamTwo = {
    playerOne: null,
    playerTwo: null
  };

  $scope.goalsTeamOne = 0;
  $scope.goalsTeamTwo = 0;

  Player.getPlayers()
    .success(function(data) {
      $scope.allPlayers = data;
      $scope.availablePlayers = data;
    })
    .error(function(data, status, headers, config) {
      alert("Error while getting list of players from server\nStatus: " + status);
    });

  $scope.openPartial = function(partial) {
    window.location.hash = '#/' + partial;
  };

  $scope.submitScore = function() {
    if(!$scope.teamOne.playerOne || !$scope.teamTwo.playerOne) {
      alert("At least one player is missing!");
    } else {
      var match = {
        date: new Date(),
        teamOne: $scope.teamOne,
        teamTwo: $scope.teamTwo,
        goalsTeamOne: $scope.goalsTeamOne,
        goalsTeamTwo: $scope.goalsTeamTwo
      }

      Match.submitScore(match)
      .success(function(data) {
        alert("Successfully submitted sore!");
      })
      .error(function(data, status, headers, config) {
        alert("Error while submitting score!\nStatus: " + status);
      });
    }
  };

  $scope.switchTeams = function() {
    var temp1 = $scope.teamOne.playerOne;
    var temp2 = $scope.teamOne.playerTwo;

    $scope.teamOne.playerOne = $scope.teamTwo.playerOne;
    $scope.teamOne.playerTwo = $scope.teamTwo.playerTwo;

    $scope.teamTwo.playerOne = temp1;
    $scope.teamTwo.playerTwo = temp2;

    var tempScore = $scope.goalsTeamOne;
    $scope.goalsTeamOne = $scope.goalsTeamTwo;
    $scope.goalsTeamTwo = tempScore;
  };

  $scope.reset = function() {
    $scope.goalsTeamOne = 0;
    $scope.goalsTeamTwo = 0;
    $scope.teamOne.playerOne = null;
    $scope.teamOne.playerTwo = null;
    $scope.teamTwo.playerOne = null;
    $scope.teamTwo.playerTwo = null;
  };

  $scope.playerFilter11 = function(element) {
    if(element === $scope.teamOne.playerTwo ||
        element === $scope.teamTwo.playerOne ||
        element === $scope.teamTwo.playerTwo) {
      return false;
    }
    return true;
  };

  $scope.playerFilter12 = function(element) {
    if(element === $scope.teamOne.playerOne ||
        element === $scope.teamTwo.playerOne ||
        element === $scope.teamTwo.playerTwo) {
      return false;
    }
    return true;
  };

  $scope.playerFilter21 = function(element) {
    if(element === $scope.teamOne.playerOne ||
        element === $scope.teamOne.playerTwo ||
        element === $scope.teamTwo.playerTwo) {
      return false;
    }
    return true;
  };

  $scope.playerFilter22 = function(element) {
    if(element === $scope.teamOne.playerOne ||
        element === $scope.teamOne.playerTwo ||
        element === $scope.teamTwo.playerOne) {
      return false;
    }
    return true;
  };
});

kickerControllers.controller('MatchesCtrl', function($scope, $http, Match) {
  $scope.matches = [];

  $scope.openPartial = function(partial) {
    window.location.hash = '#/' + partial;
  };

  Match.getMatches()
    .success(function(data) {
      $scope.matches = data;
    })
    .error(function(data, status, headers, config) {
      alert("Error while getting list of matches from server\nStatus: " + status);
    });
});

kickerControllers.controller('LeaderboardsCtrl', function($scope, $http, $filter, Statistics) {
  $scope.teamsVisible = true;
  $scope.playersVisible = false;
  $scope.statisticsVisible = false;

  $scope.teamsArray = [];
  $scope.playersArray = [];
  $scope.statistics = {};
  $scope.lastUpdate = 0;

  var orderBy = $filter('orderBy');

  $scope.openPartial = function(partial) {
    window.location.hash = '#/' + partial;
  };

  Statistics.getStatistics()
    .success(function(data) {
      if(data.statistics) {
        $scope.statistics = data.statistics;
      }

      if(data.teamStatistics) {
        $scope.teamsArray = data.teamStatistics;
      }

      if(data.playerStatistics) {
        $scope.playersArray = data.playerStatistics;
      }

      if(data.date) {
        $scope.lastUpdate = data.date;
      }

      $scope.order('games', true);
      $scope.order('winPct', true);
      $scope.orderTeam('games', true);
      $scope.orderTeam('winPct', true);
    })
    .error(function(data, status, headers, config) {
      alert("Error while getting statistics from server\nStatus: " + status);
    });

  $scope.showTeams = function() {
    $scope.teamsVisible = true;
    $scope.playersVisible = false;
    $scope.statisticsVisible = false;
  };

  $scope.showPlayers = function() {
    $scope.teamsVisible = false;
    $scope.playersVisible = true;
    $scope.statisticsVisible = false;
  };

  $scope.showStatistics = function() {
    $scope.teamsVisible = false;
    $scope.playersVisible = false;
    $scope.statisticsVisible = true;
  };

  $scope.order = function(predicate, reverse) {
    $scope.playersArray = orderBy($scope.playersArray, predicate, reverse);
  };

  $scope.orderTeam = function(predicate, reverse) {
    $scope.teamsArray = orderBy($scope.teamsArray, predicate, reverse);
  };
});
