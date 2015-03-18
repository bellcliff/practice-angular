(function(){
  var app = angular.module('youxi', ['ui.bootstrap']);
  app.controller('SearchController', ['$http', function($http){
    var ctl = this;
    this.parseImg = function(img){
      if (/<img[^>]*>/.test(img)){
        return img;
      }else if(/http:\/\/.*/.test(img)){
        return '<img href="'+img+'">';
      }else if(/https:\/\/.*/.test(img)){
        return '<img href="http://'+img.substr(5)+'">';
      }else
        return img;
    }
    this.fetch = function(query){
      console.log(query);
      console.log(ctl.running);
      if (ctl.running){
        return;
      }
      ctl.running = true;
      $http.get("/se", {
        params: {query: query, db:'xinyou'}
      }).success(function(data){
        ctl.running = false;
        console.log(data);
        ctl.results = data;
//        ctl.results = {totalnum: data.totalnum, data: []};
//        angular.forEach(data.data, function(item){
//          img = ctl.parseImg(item.img);
//          item.img1 = angular.element(img).prop('src') || angular.element(img).prop('data-original');
//          ctl.results.data.push(item);
//        });
      }).error(function(){
        console.log(arguments);
        ctl.results = false;
      });
    };
  }]);
  app.directive('searchResults', function(){
    return {
      restrict: 'A',
      templateUrl: 'yx-results.html'
    };
  });
  app.directive('searchNav', function(){
    return {
      restrict: 'A',
      templateUrl: 'yx-nav.html'
    };
  });
})()
