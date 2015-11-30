module.exports = function($scope, $location, $timeout){

  'use strict';

  $scope.gameAvailable  = false;
  $scope.error          = { state : false, message : "" };
  $scope.pending        = { state : false, message : "" };

  $scope.init = function(initValue){
    if(initValue === '#type#' || initValue === 'player'){
      $location.path('/player');
    } else if(initValue === 'master'){
      $location.path('/master');
    }else {
      $location.path('/player');
    }
  };

  $scope.$on('error', function(e, message) {
    $scope.error.state    = true;
    $scope.error.message  = message;
    $timeout(function () {
      $scope.error.state    = false;
      $scope.error.message  = "";
    }, 2000);
  });

  $scope.$on('pending', function(e, pending){
    $scope.pending.state = pending.state;
    $scope.pending.message = pending.message;
  });

};
