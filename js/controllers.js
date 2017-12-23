(function () {
    'use strict';
    loggerApp.controller("loginController", ['$scope','AppConfig','$http','$state','$location',function($scope,AppConfig,$http,$state,$location){
        $scope.data = {};
        $scope.loginFailed = false;
        $scope.signIn = function(){
            $http.post(AppConfig.forms.userLogin, {data: $scope.data}, {headers: {'Content-Type': 'application/json'} })
                .then(function (response) {
                var rdata = response.data;
                var token = response.headers()['x-jwt-token'];
                var status = response.status;
                var statusText = response.statusText;
                if(status == 200 ){
                    localStorage.setItem('formioToken',token);
                    localStorage.setItem('appUser',JSON.stringify(rdata));   
                    $state.go('main.home');
                }
            },function(error){
                //console.log(error.data +", "+error.status+", "+error.statusText);
                $scope.loginFailed = true;
                $scope.errorMessage = error.data;
            });
        };
    }])


        .controller('homeController',['$scope','AppConfig','$http','$state','seriesInfo',function($scope,AppConfig,$http,$state,searchSuggestions,seriesInfo){
                     $http.get('episodes.json').then(function(res){
                         $scope.seasons = [];
                         var curr;
                         var season = [];
                         angular.forEach(res.data,function(value,key){
    
                             if(!curr){
                                curr = value.season;    
                             }
                             
                             if(curr !== value.season){
                                $scope.seasons.push(season); 
                                season = []; 
                                curr = value.season;    
                             }
                             
                             season.push(value);  
                         });
                         $scope.seasons.push(season);
                         console.log($scope.seasons);
                    });
        }])
    
        .controller('headerController',['$scope','AppConfig','$http','$state','userInfo','$timeout','$q','searchResults','$location',function($scope,AppConfig,$http,$state,userInfo,$timeout,$q,searchResults,$location){
            $scope.username = userInfo.username;
            var timeout;
            $scope.suggesstions = function(searchText){
                var deferred = $q.defer();
                if(timeout){
                    $timeout.cancel(timeout);
                }
                timeout = $timeout(function() {
                    searchResults.getResults(searchText,function(result){
                        deferred.resolve(result);
                    });  
                }, 1000);
                return deferred.promise;
            };

            $scope.searchShows = function(object){
                var stateName = JSON.parse(JSON.stringify($state.current)).name;
                if(stateName == 'main.resultInfo'){
                    $state.reload();
                }else{
                    $location.path('/series/'+object.showName+"/"+object.id);
                }
            };

            $scope.logout = function(){
                localStorage.clear();
                $state.go('login');    
            };
        }])

        .controller('seriesInfoController',['$scope','$state','$q','$location','$stateParams',function($scope,$state,$q,$location,$stateParams){
            $scope.showName = $stateParams.showName;
        }]);

})();    




