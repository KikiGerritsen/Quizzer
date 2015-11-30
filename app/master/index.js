(function(){
  'use strict';

  module.exports = angular.module('app.master', [
  ])
  .controller('MasterMain', ['$scope', '$http', 'cookies',
    require('./mainMasterCrtl')
  ]);

}());
