'use strict';

var kickerServices = angular.module('kickerServices', []);

kickerServices.factory('Player', function($http) {
    return {
      addPlayer: function(firstName, lastName) {
        var player = {
          firstName: firstName,
          lastName: lastName
        }
        return $http.post('/api/player', player);
      },
      getPlayers: function() {
        return $http.get('/api/player');
      },
      getPlayer: function(id) {
        return $http.get('/api/player/' + id);
      },
      updatePlayer: function(id, firstName, lastName) {
        return $http.put('/api/player/' + id, firstName, lastName);
      },
      deletePlayer: function(id) {
        return $http.delete('/api/player/' + id);
      }
    };
  });

