module.exports = function($locationProvider, $routeProvider){

  'use strict';

  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
  $routeProvider
    .when('/player', {
      templateUrl : '../views/player.html',
      controller  : 'PlayerMain'
    })
    .when('/master', {
      templateUrl : '../views/master.html',
      controller  : 'MasterMain'
    })
    .otherwise({
      redirectTo: '/player'
    });
};
