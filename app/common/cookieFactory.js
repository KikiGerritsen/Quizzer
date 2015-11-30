var config = require('../../config').client;

module.exports = function($cookies){

  'use strict';
  return {
    put : function(data){
      var today = new Date();
      var expired = new Date(today);
      expired.setDate(today.getDate()+1);
      $cookies.put('sessiontype', data.type, {expires: expired});
      $cookies.put('session', data.password, {expires: expired});
    },
    remove : function(){
      $cookies.remove('session');
      $cookies.remove('sessiontype');
    },
    get : function(){
      return {
        type : $cookies.get('sessiontype'),
        password: $cookies.get('session')
      };
    },
    auth : function(){
      if($cookies.get('session') === undefined) return {state: false};
      else {
        return {
          state : true,
          type  : $cookies.get('sessiontype')
        };
      }
    }
  };
};
