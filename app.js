(function(angular, $) {
  angular.module('xinyou', ['ui.bootstrap'])
    .controller(
      'SearchController', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.results = false,
          $scope.query = '',
          $scope.querydb = 'xinyou',
          $scope.currentPage = 1,
          $scope.numPerPage = 20,
          $scope.maxSize = 5,
          $scope.showViewIndex = 0,
          $scope.result = false;

        $scope.parseImg = function(img) {
          var dom = $(img);
          if(dom.data('original')){
            return dom.data('original');
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
            $location.search({'query': $scope.query});
          }).error(function() {
            $scope.results = false;
          });
        };

        $scope.fetchInfo = function() {
          console.log('fetch ' + $scope.queryid);
          $http.get('/info', {
            params: {
              db: $scope.querydb,
              query: $scope.queryid
            }
          }).success(function(data) {
            if (parseInt($scope.queryid) == parseInt(data.query)) {
              $scope.showViewIndex = 2;
              $scope.result = data.data;
              console.log($scope.result);
              $location.search({'queryid': $scope.queryid});
            }
          }).error(function() {
            console.log(data);
          });
        };

        $scope.getSugs = function() {
          return $http.get('/sug', {
            params: {
              db: 'xinyou',
              query: $scope.query
            }
          }).then(function(resp) {
            return resp.data.sug;
          });
        };

        $scope.numPages = function() {
          return Math.ceil($scope.results.totalsum / $scope.numPerPage);
        };

        $scope.viewInfo = function(queryid) {
          $scope.queryid = queryid;
          $scope.fetchInfo();
        };

        // watch page change in results
        $scope.$watch("currentPage", function(newValue, oldValue) {
          if (newValue !== oldValue) {
            $scope.fetch($scope.query);
          }
        });

        // watch query change in location
        $scope.$watch(function() {
          return $location.search();
        }, function(newValue, oldValue) {
          console.log($location.search());
          var newQuery = false;
          if (!!newValue.query && (newValue.query !== $scope.query || newValue.query !== oldValue.query)) {
            $scope.query = newValue.query;
            $scope.fetch();
          } else if (!!newValue.queryid && newValue.queryid !== $scope.queryid) {
            $scope.queryid = newValue.queryid;
            $scope.fetchInfo();
          }
        });
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
        templateUrl: 'yx-info.html',
        scope: false,
      };
    });
})(window.angular, window.jQuery)