'use strict';

var kickerControllers = angular.module('kickerControllers', []);

kickerControllers.controller('MainCtrl', function($scope, $http, Player) {
    $scope.submit = function(target) {
      window.location.hash = '#/' + target;
    };
  });

kickerControllers.controller('AddPlayerCtrl', function($scope, $http, Player) {
  $scope.firstName = null;
  $scope.lastName = null;

  $scope.disabled = false;
  $scope.formError = false;
  $scope.xhrError = false;
  $scope.pending = false;
  $scope.done = false;

  $scope.addPlayer = function() {
    if(!$scope.firstName || '' === $scope.firstName || !$scope.lastName || '' === $scope.lastName) {
      $scope.formError = true;
    } else {
      $scope.disabled = true;
      $scope.formError = false;
      $scope.pending = true;

      Player.addPlayer($scope.firstName, $scope.lastName)
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
});

kickerControllers.controller('MatchCtrl', function($scope, $http, Player) {
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

  $scope.switchTeams = function() {
    var temp1 = $scope.teamOne.playerOne;
    var temp2 = $scope.teamOne.playerTwo;

    $scope.teamOne.playerOne = $scope.teamTwo.playerOne;
    $scope.teamOne.playerTwo = $scope.teamTwo.playerTwo;

    $scope.teamTwo.playerOne = temp1;
    $scope.teamTwo.playerTwo = temp2;
  };

  Player.getPlayers()
    .success(function(data) {
      $scope.allPlayers = data;
      $scope.availablePlayers = data;
    })
    .error(function(data, status, headers, config) {

    });

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
