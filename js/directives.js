(function(){
    'use strict';
    loggerApp
    .directive("episodes", function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        seasons: '='
      },
      templateUrl: 'views/directives/episodes.html',
      controller: ['$scope', function ($scope) {
      }]
    };
  })
    .directive("searchResult",function(){
        return  {
            restrict : 'E',
            templateUrl : 'views/directives/searchResult.html',
            replace : true       
        } 
    });
})();
