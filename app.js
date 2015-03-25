(function(angular) {
  angular.module('xinyou', ['ui.bootstrap'])
    .controller(
      'SearchController', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.results = false,
          $scope.query = '',
          $scope.querydb = 'xinyou',
          $scope.currentPage = 1,
          $scope.numPerPage = 20,
          $scope.maxSize = 5,
          $scope.showViewIndex = 0;

        $scope.parseImg = function(img) {
          if (/<img[^>]*>/.test(img)) {
            return img;
          } else if (/http:\/\/.*/.test(img)) {
            return '<img href="' + img + '">';
          } else if (/https:\/\/.*/.test(img)) {
            return '<img href="http://' + img.substr(5) + '">';
          } else {
            return img;
          }
        };

        $scope.navClass = function(qdb) {
          if (qdb == $scope.querydb) {
            return 'active';
          }
        };

        $scope.setDb = function(qdb) {
          if ($scope.querydb = qdb) {
            $scope.querydb = qdb;
            if (!!$scope.query) {
              $scope.fetch($scope.query);
            }
          }
        };

        $scope.showView = function(viewIndex) {
          return $scope.showViewIndex == viewIndex;
        };

        $scope.fetch = function() {
          if (!$scope.query || $scope.query.length == 0) {
            return;
          }

          $http.get("/se", {
            params: {
              db: $scope.querydb,
              query: $scope.query,
              s: ($scope.currentPage - 1) * $scope.numPerPage,
              n: $scope.numPerPage
            }
          }).success(function(data) {
            $scope.showViewIndex = 1;
            $scope.results = data;
            $location.search('query', $scope.query);
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
        };

        $scope.numPages = function() {
          return Math.ceil($scope.results.totalsum / $scope.numPerPage);
        };

        // watch page change in results
        $scope.$watch("currentPage", function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.fetch($scope.query);
          }
        });

        // watch query change in location
        $scope.$watch(function() {
          return $location.search().query;
        }, function(newValue, oldValue) {
          console.log(newValue + " - " + oldValue + " | " + $scope.query);
          if (newValue !== oldValue || newValue !== $scope.query) {
            $scope.query = newValue;
            $scope.fetch();
          }
        });

        // link info page
        $scope.viewDetail = function(rid) {
          $scope.showViewIndex = 2;
        };

      }]
    ).directive('yxInput', function() {
      return {
        restrict: 'A',
        templateUrl: 'yx-input.html',
        scope: false,
      };
    }).directive('yxResults', function() {
      return {
        restrict: 'A',
        templateUrl: 'yx-results.html',
        scope: false,
      };
    }).directive('yxNav', function() {
      return {
        restrict: 'A',
        templateUrl: 'yx-nav.html'
      };
    }).directive('yxInfo', function() {
      return {
        restrict: 'A',
        templateUrl: 'yx-info.html'
      };
    });
})(window.angular)