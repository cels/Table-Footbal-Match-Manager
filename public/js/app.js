'use strict';

var kickerApp = angular.module('kickerApp', [
  'ngRoute',
  'kickerControllers',
  'kickerServices',
  'kickerFilters'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {templateUrl: 'partials/main.html'})
    .when('/addPlayer', {templateUrl: 'partials/addPlayer.html'})
    .when('/match', {templateUrl: 'partials/match.html'})
    .when('/matchs', {templateUrl: 'partials/matchs.html'})
    .otherwise({redirectTo: '/'});
});
