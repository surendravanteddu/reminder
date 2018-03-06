(function(){
    'use strict';
    loggerApp

        .factory('userInfo',function($location){
        var data = localStorage.getItem("appUser");
        if(data){
            data = JSON.parse(data);
            return data.data;           
        }else{
           localStorage.clear();    
           $location.path('/login');
            return "";
        }
    })

        .factory('searchResults',function($http,AppConfig){
        var search = {};
        search.results = [];
        search.getResults = function(keyword,next){
            $http.get(AppConfig.tvMazeApiUrl+'/search/shows',{params: {'q' : keyword}})
                .then(function(data){
                return data;
            }).then(function(data){
                search.results = [];
                angular.forEach(data['data'], function(value, key) {
                    var result = {};
                    result.showName = value.show.name;
                    result.id = value.show.id;
                    result.genres = value.show.genres;
                    result.rating = value.show.rating.average;
                    result.image = value.show.image;
                    search.results.push(result);
                });
                next(search.results);
            },function(error){
                console.log(error.status);
            });
        };
        return search;   
    })

        .factory('seriesInfo', function($http, AppConfig, $location){
        var seriesInfo = {};

        seriesInfo.info = function(showId,next){
            $http.get(AppConfig.tvMazeApiUrl+'/shows/'+showId).then(function(res){
                next(res.data);
            }).catch(function(err){
                console.log("series info", err);
            });  
        };

        seriesInfo.seasons = function(showId,next){
            $http.get(AppConfig.tvMazeApiUrl+'/shows/'+showId+'/episodes').then(function(res){
                var seasons = [];
                var curr;
                var prev;
                var season = [];
                angular.forEach(res.data,function(value,key){

                    if(!curr){
                        curr = value.season;
                        prev = curr;
                    }

                    if(curr !== value.season){
                        seasons[prev] = season; 
                        season = []; 
                        curr = value.season;    
                        prev = curr;
                    }
                    season[value.number] = value;
                });
                seasons[curr] = season;
                next(seasons);
            });  
        };

        seriesInfo.checkpoint = function(showId, next){
            $http.get(AppConfig.forms.useractivity+'?data.tvmazeid='+showId,  
                      {
                headers: {
                    'x-jwt-token': localStorage.getItem('formioToken')  
                } 
            })
                .then(function (response) {
                var result = {};
                if(response.data[0]){
                    result.s = response.data[0].data.season;
                    result.e = response.data[0].data.episode;
                    result._id = response.data[0]._id;
                }
                next(result);
            },function(error){
                if([400, 401].indexOf(error.status) > -1){
                    $location.path('/login')
                }
//                console.log(error.data +", "+error.status+", "+error.statusText);
            });  
        };

        seriesInfo.myShows = function(next){
            $http.get(AppConfig.forms.useractivity+'?sort=-created',{
                headers: {
                    'x-jwt-token': localStorage.getItem('formioToken')  
                } 
            })
                .then(function (response) {
                next(response.data);
            },function(error){
                if([400, 401].indexOf(error.status) > -1){
                    $location.path('/login')
                }
//                console.log("My Shows", error.data +", "+error.status+", "+error.statusText);
            });
        };

        return seriesInfo;  
    });

})();