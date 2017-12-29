(function(){
    'use strict';
    loggerApp
        .directive("episodes", function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                seasons: '=',
                savedpoint: '=?',  
                checkpoint : '&'  
            },
            templateUrl: 'views/directives/episodes.html',
            controller: ['$scope', function ($scope) {
                $scope.$watch('savedpoint', function(newVal, oldVal){
                    $scope.savedpoint = newVal;
                });  
                $scope.watched = function(episode){
                    if($scope.savedpoint){
                        if((episode.season < $scope.savedpoint.s) || (episode.season === $scope.savedpoint.s && episode.number <= $scope.savedpoint.e)){
                            return true;   
                        }   
                    }
                };
            }]
        };
    })
        .directive("searchResult",function(){
        return  {
            restrict : 'E',
            templateUrl : 'views/directives/searchResult.html',
            replace : true       
        } 
    }).directive("myShows",function(){
        return {
         restrict : 'E',
         replace : true,
         scope: {
             seasons : '=',
         },
         templateUrl: 'views/directives/myShows.html',    
         controller: ['$scope',function($scope){
         }]    
       }; 
    
    });
    
})();
