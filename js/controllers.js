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


        .controller('homeController',['$scope','AppConfig','$http','$state',function($scope,AppConfig,$http,$state,searchSuggestions){
            
        }])


        .controller('headerController',['$scope','AppConfig','$http','$state','userInfo','$timeout','$q','searchResults',function($scope,AppConfig,$http,$state,userInfo,$timeout,$q,searchResults,searchSuggestions){
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

            $scope.searchShows = function(){
                searchResults.getResults($scope.keyword,function(result){
                    
                });   
            };

            $scope.logout = function(){
                localStorage.clear();
                $state.go('login');    
            };
        }]);

})();    




