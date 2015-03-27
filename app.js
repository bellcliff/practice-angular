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
          if (!!img) {
            if (img.match(/<img[^>]+>/)) {
              return $(img).data('original') || $(img).attr('src');
            } else if (img.match(/http:\/\/.*/)) {
              return img;
            }
          } else {
            return '';
          }
        };

        $scope.parseZUTU = function(img) {
          var slides = [];
          if (!img) {
            return slides;
          }
          var first = 'active';
          if (img.match(/^http/)) {
            $.each(img.split('http://'), function(idx, imgURL) {
              if (imgURL.length == 0)
                return;
              slides.push({
                'image': 'http://' + imgURL,
                'active': first
              });
              first = '';
            });
            return slides;
          } else {
            $.each($(img), function(idx, _dom) {
              var dom = $(_dom);
              if (dom.prop("tagName") == 'IMG' && dom.attr('src')) {
                slides.push({
                  'image': dom.attr('src'),
                  'active': first
                });
                first = '';
              }
            });
            return slides;
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
            console.log(data);
            $scope.showViewIndex = 1;
            $scope.results = data;
            $location.search({
              'query': $scope.query
            });
          }).error(function() {
            $scope.results = false;
          });
        };

        $scope.fetchInfo = function() {
          console.log('fetch ' + $scope.queryid);
          $scope.result = {
            'inited': false
          };
          $http.get('/info', {
            params: {
              db: $scope.querydb,
              query: $scope.queryid
            }
          }).success(function(data) {
            console.log(data);
            if (parseInt($scope.queryid) == parseInt(data.query) && !!data.data) {
              $scope.showViewIndex = 2;
              $scope.result = data.data;
              $scope.result.imgURL = $scope.parseImg($scope.result.img) || '';
              $scope.result.slides = $scope.parseZUTU($scope.result.zutu);
              $scope.result.inited = true;
              $location.search({
                'queryid': $scope.queryid
              });
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
          $scope.fetch();
        });

        // watch query change in location
        $scope.$watch(function() {
          return $location.search();
        }, function(newValue, oldValue) {
          var newQuery = false;
          if (!!newValue.query && (newValue.query !== $scope.query || newValue.query !== oldValue.query)) {
            $scope.query = newValue.query;
            $scope.fetch();
          } else if (!!newValue.queryid && newValue.queryid !== $scope.queryid) {
            $scope.queryid = newValue.queryid;
            $scope.fetchInfo();
          }
        });
      }]).directive('yxInput', function() {
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