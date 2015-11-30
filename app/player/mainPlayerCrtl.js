module.exports = function($scope, $http, cookies){

  'use strict';

  $scope.password = "";
  $scope.socket = io.connect();

  $scope.loginState = {
    quiz  : false,
    team  : false,
    game  : false
  };

  //NOTE uneven round numbers are pending for next question!

  $scope.approved = false;

  $scope.login = {
    quiz : function(){
      $scope.loadQuiz($scope.password, function(){
        $scope.loginState.quiz = true;
        $scope.socket.emit('player:join', {password: $scope.password});
        cookies.put({type: 'player', password: $scope.password});
      });
    },
    team : function(){
      if(!$scope.quiz.master){
        $scope.$emit('error', "please wait for quizmaster to join game");
      } else {
        $scope.loginState.team = true;
        $scope.loadTeam($scope.teamname, function(){
          $scope.$emit('pending', {
            state: true,
            message: 'awaiting teammaster to approve'});
        });
      }
    },
    all  : function(){
      $scope.loadQuiz(cookies.get().password, function(){
        $scope.loadTeam(cookies.get().type, function(){
          $scope.loginState.game = true;
          if($scope.quiz.round % 2){
            $scope.$emit('pending', { state : true, message : 'waiting for next question'});
          } else {
            $scope.$emit('pending', { state : false, message : ''});
          }
          console.log("logged in under cookie");
        });
      });
    }
  };
  $scope.loadQuiz = function(quiz, callback){
    $http.get('/api/quiz/'+quiz)
      .success(function(res){
        if(res.success){
          $scope.quiz = res.result;
          callback();
        } else{
          $scope.$emit('error', res.message);
        }
      });
  };
  $scope.loadTeam = function(teamname, callback){
    $http.post('/api/team', {teamname : teamname})
      .success(function(res){
        if(res.success){
          $scope.socket.emit('player:joined', {team: teamname});
          callback();
        } else {
          $scope.$emit('error', res.message);
        }
      });
  };

  $scope.socket.on('master:joined', function(){
    if(!$scope.loginState.game){
      if(!$scope.loginState.quiz){
        $http.get('/api/quiz')
          .success(function(data){
            if(data.result.length > 0) $scope.gameAvailable = true;
          });
      } else{
        //needed callback elswhere, optional arguments? no clue
        $scope.loadQuiz($scope.password, function(){});
      }
    } else {
      $scope.loadQuiz(cookies.get().password, function(){});
      if($scope.quiz.round % 2){
        $scope.$emit('pending', { state : true, message : 'waiting for next question'});
      } else {
        $scope.$emit('pending', { state : false, message : ''});
      }
      $scope.$apply();
    }
  });

  $scope.socket.on('master:left', function(){
    $scope.$emit('error', 'quizmaster disconnected');
    if($scope.loginState.quiz){
      //needed callback elswhere, optional arguments? no clue
      $scope.loadQuiz($scope.password, function(){});
      if(!$scope.loginState.game && $scope.loginState.team){
        $scope.$emit('pending', {state: false, message: ""});
        $scope.socket.emit('player:leave', { name : $scope.teamname});
        $scope.loginState.team = false;
      } else if($scope.loginState.game){
        $scope.$emit('pending', {state : true, message: 'master disconnected, please wait'});
      }
    }
  });

  $scope.socket.on('player:approved', function(data){
    if(data === $scope.teamname) $scope.approved = true;
  });

  $scope.socket.on('game:started', function(){
    if($scope.approved){
      cookies.put({type: $scope.teamname, password: $scope.password});
      $scope.login.all();
      $scope.$apply();
      // console.log("approved");
      // $scope.loginState.game = true;
      // if($scope.quiz.round % 2){
      //   $scope.$emit('pending', { state : true, message : 'waiting for next question'});
      // } else {
      //   $scope.$emit('pending', { state : false, message : ''});
      // }
      // $scope.$apply();
    } else {
      $scope.$emit('pending', {state: false, message: ""});
      $scope.socket.emit('player:leave', { name : $scope.teamname});
      $scope.loginState.quiz = false;
      $scope.loginState.team = false;
      $scope.$apply();
    }
  });

  $http.get('/api/quiz')
    .success(function(data){
      if(data.result.length > 0) $scope.gameAvailable = true;
    });

  if(cookies.auth().state && cookies.auth().type !== 'master'){
    $scope.login.all();
  }

};
