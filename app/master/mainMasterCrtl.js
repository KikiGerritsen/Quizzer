module.exports = function($scope, $http, cookies){

  'use strict';

  $scope.password = "";
  $scope.loggedIn = false;
  $scope.gameStarted = false;
  $scope.socket   = io.connect();

  $scope.login = function(){
    $http.post('/api/quiz', { password : $scope.password} )
        .success(function(res){
          if(res.success){
            $scope.loggedIn = true;
            $scope.teams = [];
            if(cookies.auth().state && cookies.auth().type === 'master'){
              $scope.gameStarted = true;
            }
            $scope.socket.emit('master:join', {password: $scope.password});
          } else {
            $scope.$emit('error', res.message);
          }
    });
  };

  $scope.logout = function(){
    $scope.loggedIn = false;
    $scope.socket.emit('master:leave', {password: cookies.get().password});
  };

  $scope.submitTeams = function(){
    cookies.put({type: 'master', password: $scope.password});
    $scope.socket.emit('start:game', {
      game : $scope.password,
      teams: $scope.teams
    });
    $scope.gameStarted = true;
  };

  $scope.socket.on('player:new', function(data){
    data.approved = false;
    $scope.teams.push(data);
    $scope.$apply();
  });

  $scope.socket.on('player:leave', function(data){
    if(!$scope.gameStarted){
      $scope.teams.splice($scope.teams[$scope.teams.indexOf(data)]);
      $scope.$apply();
    }
  });

  if(cookies.auth().state && cookies.auth().type === 'master'){
    $scope.password = cookies.get().password;
    $scope.login();
  }
};
