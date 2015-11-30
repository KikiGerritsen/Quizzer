(function(){
  'use strict';

  module.exports = angular.module('app.player', [
  ])
  .controller('PlayerMain', ['$scope', '$http', 'cookies',
    require('./mainPlayerCrtl')
  ]);

}());
