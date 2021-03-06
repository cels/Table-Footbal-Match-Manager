'use strict';

var kickerApp = angular.module('kickerApp', [
  'ngRoute',
  'kickerControllers',
  'kickerServices',
  'kickerFilters'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/addPlayer', {templateUrl: 'partials/addPlayer.html'})
    .when('/match', {templateUrl: 'partials/match.html'})
    .when('/matches', {templateUrl: 'partials/matches.html'})
    .when('/leaderboards', {templateUrl: 'partials/leaderboards.html'})
    .otherwise({redirectTo: '/leaderboards'});
});
