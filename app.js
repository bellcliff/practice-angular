(function() {
  var app = angular.module('youxi', ['ui.bootstrap']);

  // search result control
  app.controller('SearchController', [
      '$scope',
      '$http',
      '$location',
      function($scope, $http, $location) {
        $scope.results = false, $scope.query = '', $scope.querydb = 'xinyou',
                $scope.currentPage = 1, $scope.numPerPage = 20,
                $scope.maxSize = 5;

        $scope.parseImg = function(img) {
          if (/<img[^>]*>/.test(img)) {
            return img;
          } else if (/http:\/\/.*/.test(img)) {
            return '<img href="' + img + '">';
          } else if (/https:\/\/.*/.test(img)) {
            return '<img href="http://' + img.substr(5) + '">';
          } else
            return img;
        };

        $scope.navClass = function(qdb) {
          if (qdb == $scope.querydb) { return 'active'; }
        };
        $scope.setDb = function(qdb) {
          if ($scope.querydb = qdb) {
            $scope.querydb = qdb;
            if (!!$scope.query) {
              $scope.fetch($scope.query);
            }
          }
        };

        $scope.fetch = function(query) {
          if (!query || query.length == 0) { return; }
          
          $scope.query = query;
          $http.get("/se", {
            params: {
              db: $scope.querydb,
              query: query,
              s: ($scope.currentPage - 1) * $scope.numPerPage,
              n: $scope.numPerPage
            }
          }).success(function(data) {
            $scope.results = data;
          }).error(function() {
            $scope.results = false;
          });
        };

        $scope.getSugs = function(q) {
          return $http.get('/sug', {
            params: {
              db: 'xinyou',
              query: q
            }
          }).then(function(resp) {
            return resp.data.sug;
          });
        }

        $scope.viewDetail = function(itemId) {
          console.log(itemId);
        }

        $scope.numPages = function() {
          return Math.ceil($scope.results.totalsum / $scope.numPerPage);
        };
        $scope.$watch("currentPage", function(newValue, oldValue) {
          $scope.fetch($scope.query);
        });

        $scope.init = function() {
          console.log($location.hash());
          console.log($location.search());
        };
        $scope.init();
      }]);

  app.directive('searchResults', function() {
    return {
      restrict: 'A',
      templateUrl: 'yx-results.html',
      scope: false,
    };
  });

  app.directive('searchNav', function() {
    return {
      restrict: 'A',
      templateUrl: 'yx-nav.html'
    };
  });

})()
