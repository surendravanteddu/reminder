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
                showsInfo: '=' 
            },
            templateUrl: 'views/directives/myShows.html',    
            controller: ['$scope',function($scope){

                $scope.sPlus = function(index){
                    var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                    if($scope.seasons[index].data.season < currShowInfo[currShowInfo.length - 1][0].season){
                        console.log(currShowInfo);
                        $scope.seasons[index].data.season += 1;   
                    }
                };
                $scope.sMinus = function(index){
                    var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                    if($scope.seasons[index].data.season > currShowInfo[0][0].season){
                        $scope.seasons[index].data.season -= 1;
                    }
                };
                $scope.ePlus = function(index){
                    var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                    if($scope.seasons[index].data.episode < currShowInfo[$scope.seasons[index].data.season-1].length){
                        $scope.seasons[index].data.episode += 1;   
                    }
                };
                $scope.eMinus = function(index){
                    if($scope.seasons[index].data.episode > 1 ){
                        $scope.seasons[index].data.episode -= 1;   
                    }
                    else{
                        var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                        if(currShowInfo[$scope.seasons[index].data.episode-1])
                        console.log(currShowInfo[$scope.seasons[index].data.episode-1]);
                    }
                };

            }]    
        }; 

    });

})();
