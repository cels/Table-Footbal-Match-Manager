'use strict';

var kickerServices = angular.module('kickerServices', []);

kickerServices.factory('Player', function($http) {
    return {
      addPlayer: function(name) {
        var player = {
          name: name
        }
        return $http.post('/api/player', player);
      },
      getPlayers: function() {
        return $http.get('/api/player');
      },
      getPlayer: function(id) {
        return $http.get('/api/player/' + id);
      },
      updatePlayer: function(id, name) {
        return $http.put('/api/player/' + id, name);
      },
      deletePlayer: function(id) {
        return $http.delete('/api/player/' + id);
      }
    };
  });

kickerServices.factory('Match', function($http) {
  return {
    getMatches: function() {
      return $http.get('/api/match');
    }
    submitScore: function(score) {
      var match = {
        match: score
      };
      return $http.post('/api/match', match);
    }
  }
});
