(function () {
    'use strict';
    
    loggerApp.controller("loginController", ['$scope', 'AppConfig', '$http', '$state', '$location', function ($scope, AppConfig, $http, $state, $location) {
        $scope.data = {};
        $scope.loginFailed = false;
        $scope.user = {};
        $scope.signIn = function () {
            $http.post(AppConfig.forms.userLogin, {
                data: $scope.data
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                var rdata = response.data;
                var token = response.headers()['x-jwt-token'];
                var status = response.status;
                var statusText = response.statusText;
                if (status == 200) {
                    localStorage.setItem('formioToken', token);
                    localStorage.setItem('appUser', JSON.stringify(rdata));
                    $state.go('main.home');
                }
            }, function (error) {
                //console.log(error.data +", "+error.status+", "+error.statusText);
                $scope.loginFailed = true;
                $scope.errorMessage = error.data;
            });
        };
        $scope.signUp = function () {
            $http.post(AppConfig.forms.userRegister, {
                data: $scope.user
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response){
                var rdata = response.data;
                console.log(response.data);
                var token = response.headers()['x-jwt-token'];
                var status = response.status;
                var statusText = response.statusText;
                if (status == 200) {
                    localStorage.setItem('formioToken', token);
                    localStorage.setItem('appUser', JSON.stringify(rdata));
                    $state.go('main.home');
                }
            }, function (error){
                $scope.loginFailed = true;
                $scope.errorMessage = error.data;
            });
        };
    }]).controller('homeController', ['$scope', 'AppConfig', '$http', '$state', 'seriesInfo', '$stateParams', 'ngToast', function ($scope, AppConfig, $http, $state, seriesInfo, $stateParams, ngToast) {
        seriesInfo.myShows(function (result) {
            $scope.seasons = result;
            $scope.showsInfo = {};
            $scope.seasons.forEach(function(value,key){
             seriesInfo.seasons(value.data.tvmazeid,function(res){
              $scope.showsInfo[value.data.tvmazeid] = res; 
          });
         });
        });
        $scope.saveCheckpoint = function (episode) {
            var savepoint = {};
            savepoint.seriesname = episode.data.seriesname;
            savepoint.tvmazeid = episode.data.tvmazeid;
            savepoint.season = episode.data.season;
            savepoint.episode = episode.data.episode;
            $http.put(AppConfig.forms.useractivity + "/" + episode._id, {
                data: savepoint
            }, {
                headers: {
                    'Content-Type': 'application/json'
                    , 'x-jwt-token': localStorage.getItem('formioToken')
                }
            }).then(function (response) {
                var token = response.headers()['x-jwt-token'];
                var status = response.status;
                var statusText = response.statusText;
                console.log(statusText);
                if (status == 200) {
                    localStorage.setItem('formioToken', token);
                    toastmessage(ngToast,'Checkpoint Updated');
                }
            }, function (error) {
                $scope.errorMessage = error.data;
            });
        };
    }]).controller('headerController', ['$scope', 'AppConfig', '$http', '$state', 'userInfo', '$timeout', '$q', 'searchResults', '$location', function ($scope, AppConfig, $http, $state, userInfo, $timeout, $q, searchResults, $location) {
        $scope.username = userInfo.username;
        var timeout;
        $scope.suggesstions = function (searchText) {
            var deferred = $q.defer();
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(function () {
                searchResults.getResults(searchText, function (result) {
                    deferred.resolve(result);
                });
            }, 1000);
            return deferred.promise;
        };
        $scope.searchShows = function (object) {
            var stateName = JSON.parse(JSON.stringify($state.current)).name;
            $location.path('/series/' + object.showName + "/" + object.id);
        };
        $scope.logout = function () {
            localStorage.clear();
            $state.go('login');
        };
    }]).controller('seriesInfoController', ['$scope', '$state', '$q', '$location', '$stateParams', 'seriesInfo', '$http', 'AppConfig', 'ngToast', function ($scope, $state, $q, $location, $stateParams, seriesInfo, $http, AppConfig, ngToast) {

        seriesInfo.info($stateParams.showId, function (result) {
            $scope.showName = result.name;
            $scope.imageUrl = result.image.original;
            $scope.summary = result.summary;
        });
        seriesInfo.seasons($stateParams.showId, function (result) {
            $scope.seasons = result;
        });
        seriesInfo.checkpoint($stateParams.showId, function (res) {
            if (res.e && res.s) {
                $scope.savedpoint = res;
            }
        });
        $scope.saveCheckpoint = function (episode) {
            var savepoint = {};
            savepoint.seriesname = $scope.showName;
            savepoint.tvmazeid = $stateParams.showId;
            savepoint.season = episode.season;
            savepoint.episode = episode.number;
            if ($scope.savedpoint) {
                $http.put(AppConfig.forms.useractivity + "/" + $scope.savedpoint._id, {
                    data: savepoint
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                        , 'x-jwt-token': localStorage.getItem('formioToken')
                    }
                }).then(function (response) {
                    var token = response.headers()['x-jwt-token'];
                    var status = response.status;
                    var statusText = response.statusText;
                    console.log(statusText);
                    if (status == 200) {
                        localStorage.setItem('formioToken', token);
                        $scope.savedpoint.s = episode.season;
                        $scope.savedpoint.e = episode.number;
                        toastmessage(ngToast,'Checkpoint Updated');
                    }
                }, function (error) {
                    $scope.errorMessage = error.data;
                });
            }
            else {
                $http.post(AppConfig.forms.useractivity, {
                    data: savepoint
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                        , 'x-jwt-token': localStorage.getItem('formioToken')
                    }
                }).then(function (response) {
                    var token = response.headers()['x-jwt-token'];
                    var status = response.status;
                    var statusText = response.statusText;
                    console.log(statusText);
                    if (status == 201) {
                        localStorage.setItem('formioToken', token);
                        $scope.savedpoint = {
                            s: episode.season
                            , e: episode.number
                        };
                        toastmessage(ngToast,'Checkpoint Created');
                    }
                }, function (error) {
                    $scope.errorMessage = error.data;
                });
            }
        };
    }]);
    
    var toastmessage = function(ngToast, content){
        ngToast.create({
            content: content,
            animation: 'fade', 
            timeout : 2000
        });
    };
})();