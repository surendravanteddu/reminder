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
            controller: ['$scope',function ($scope) {

                $scope.showEpisodes = function(value){
                    var temp = angular.element(value.target).context.nextElementSibling.className;
                    if(temp === 'row hideEpisodes'){
                        angular.element(value.target).context.nextElementSibling.className = 'row showEpisodes';
                    }else{
                        angular.element(value.target).context.nextElementSibling.className = 'row hideEpisodes';
                    }
                };

                $scope.$watch('savedpoint', function(newVal, oldVal){
                    $scope.savedpoint = newVal;
                });

                $scope.currentSeason = function(season){
                    if($scope.savedpoint){
                        if(season === $scope.savedpoint.s){
                            return true;   
                        }else{
                            return false;
                        }   
                    }
                    return false;
                }

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
                showsInfo: '=',
                checkpoint: '&'
            },
            templateUrl: 'views/directives/myShows.html',    
            controller: ['$scope',function($scope){

                $scope.sPlus = function(index){
                    var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid][$scope.seasons[index].data.season];
                    var currShowInfo1 = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                    if($scope.seasons[index].data.season < currShowInfo1[currShowInfo1.length - 1][1].season){
                        if(($scope.showsInfo[$scope.seasons[index].data.tvmazeid][$scope.seasons[index].data.season + 1].length - 1) >= $scope.seasons[index].data.episode)
                            $scope.seasons[index].data.season += 1;
                        else{
                            $scope.seasons[index].data.episode = 1;
                            $scope.seasons[index].data.season += 1;
                        }
                    }
                };
                $scope.sMinus = function(index){
                    var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                    if($scope.seasons[index].data.season > currShowInfo[1][1].season){
                        $scope.seasons[index].data.season -= 1;
                    }
                };
                $scope.ePlus = function(index){
                    var currShowInfo = $scope.showsInfo[$scope.seasons[index].data.tvmazeid];
                    if($scope.seasons[index].data.episode < currShowInfo[$scope.seasons[index].data.season].length - 1){
                        $scope.seasons[index].data.episode += 1;   
                    }
                    else{
                        if($scope.showsInfo[$scope.seasons[index].data.tvmazeid][$scope.seasons[index].data.season + 1]){
                            var curPoint = $scope.showsInfo[$scope.seasons[index].data.tvmazeid][$scope.seasons[index].data.season + 1][1];
                            $scope.seasons[index].data.season = curPoint.season;
                            $scope.seasons[index].data.episode = curPoint.number;
                        }
                    }
                };
                $scope.eMinus = function(index){
                    if($scope.seasons[index].data.episode > 1 ){
                        $scope.seasons[index].data.episode -= 1;   
                    }
                    else{
                        if($scope.showsInfo[$scope.seasons[index].data.tvmazeid][$scope.seasons[index].data.season - 1]){
                            var curPoint = $scope.showsInfo[$scope.seasons[index].data.tvmazeid][$scope.seasons[index].data.season - 1];
                            $scope.seasons[index].data.season = curPoint[curPoint.length - 1].season;
                            $scope.seasons[index].data.episode = curPoint[curPoint.length - 1].number;
                        }   
                    }
                };

            }]    
        }; 

    });

})();
