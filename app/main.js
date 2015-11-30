(function(){
  'use strict';

  var angular   = require('angular');

  angular.module('app', [
    require('angular-route'),
    require('angular-cookies'),
    require('./player').name,
    require('./master').name
  ])
  .config(['$locationProvider', '$routeProvider',
    require('./routes')
  ])
  .controller('MainController', ['$scope', '$location', '$timeout',
    require('./mainCrtl')
  ])
  .factory('cookies', [ '$cookies',
    require('./common/cookieFactory')
  ])
  .constant('USER_ROLES', {
    all: '*',
    master: 'quizmaster',
    player: 'player'
  });
}());
