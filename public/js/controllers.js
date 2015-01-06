'use strict';

var kickerControllers = angular.module('kickerControllers', []);

kickerControllers.controller('MainCtrl', function($scope, $http, Player) {
    $scope.submit = function(target) {
      window.location.hash = '#/' + target;
    };
  });

kickerControllers.controller('AddPlayerCtrl', function($scope, $http, Player) {
  $scope.name = null;

  $scope.disabled = false;
  $scope.formError = false;
  $scope.xhrError = false;
  $scope.pending = false;
  $scope.done = false;

  $scope.mainMenu = function() {
    window.location.hash = '#/';
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

  $scope.started = false;

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
      //TODO ?
    });

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  $scope.startGame = function() {
    $scope.started = true;
  };

  $scope.submitScore = function() {
    //placeholde
    $scope.started = false;

    var match = {
      date: new Date(),
      teamOne: $scope.teamOne,
      teamTwo: $scope.teamTwo,
      goalsTeamOne: $scope.goalsTeamOne,
      goalsTeamTwo: $scope.goalsTeamTwo
    }

    console.log(match)

    Match.submitScore(match)
    .success(function(data) {
      //TODO show success
    })
    .error(function(data, status, headers, config) {
      // TODO show error
    });
  };

  $scope.switchTeams = function() {
    $scope.started = false;

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
    $scope.started = false;
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

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  Match.getMatches()
    .success(function(data) {
      $scope.matches = data;
    })
    .error(function(data, status, headers, config) {
      //TODO ?
    });
});

kickerControllers.controller('LeaderboardsCtrl', function($scope, $http, $filter, Match) {
  $scope.matches = [];
  $scope.teamsVisible = true;

  $scope.teams = [];
  $scope.players = {};
  $scope.playersArray = [];

  var orderBy = $filter('orderBy');

  $scope.mainMenu = function() {
    window.location.hash = '#/';
  };

  Match.getMatches()
    .success(function(data) {
      $scope.matches = data;

      analyseData();

      $scope.order('name', false);
    })
    .error(function(data, status, headers, config) {
      //TODO ?
    });

  $scope.switchTable = function() {
    $scope.teamsVisible = !$scope.teamsVisible;
  };

  $scope.order = function(predicate, reverse) {
    $scope.playersArray = orderBy($scope.playersArray, predicate, reverse);
  };

  var addPlayerData = function(player, goalsOwn, goalsEnemy) {
    if(player) {
      var n = player.name;

      if(!$scope.players.hasOwnProperty(n)) {
        $scope.players[n] = {
          name: n,
          goalsOwn: 0,
          goalsEnemy: 0,
          games: 0,
          win: 0,
          draw: 0,
          loss: 0,
          winPct: 0,
          goalsOwnPerGame: 0,
          goalsEnemyPerGame: 0
        };
      }

      $scope.players[n].games++;
      $scope.players[n].goalsOwn += goalsOwn;
      $scope.players[n].goalsEnemy += goalsEnemy;

      if(goalsOwn === goalsEnemy) {
        $scope.players[n].draw++;
      } else if(goalsOwn > goalsEnemy) {
        $scope.players[n].win++;
      } else {
        $scope.players[n].loss++;
      }

      $scope.players[n].winPct = ($scope.players[n].win / $scope.players[n].games * 100);
      $scope.players[n].goalsOwnPerGame = ($scope.players[n].goalsOwn / $scope.players[n].games);
      $scope.players[n].goalsEnemyPerGame = ($scope.players[n].goalsEnemy / $scope.players[n].games);
    }
  };

  var analyseData = function() {
    for(var i = 0, ii = $scope.matches.length; i < ii; i++) {
      var teamOne = $scope.matches[i].teamOne;
      var teamTwo = $scope.matches[i].teamTwo;

      var g1 = $scope.matches[i].goalsTeamOne;
      var g2 = $scope.matches[i].goalsTeamTwo;

      var p11 = teamOne.playerOne;
      var p12 = teamOne.playerTwo;
      var p21 = teamTwo.playerOne;
      var p22 = teamTwo.playerTwo;

      addPlayerData(p11, g1, g2);
      addPlayerData(p12, g1, g2);
      addPlayerData(p21, g2, g1);
      addPlayerData(p22, g2, g1);
    }

    for(var p in $scope.players) {
      $scope.playersArray.push($scope.players[p]);
    }
  };
});
