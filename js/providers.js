(function(){
    'use strict';
    loggerApp.factory('userInfo',function(){
        var data = localStorage.getItem("appUser");
        data = JSON.parse(data);
        return data.data;       
    });

    loggerApp.factory('searchResults',function($http,AppConfig){
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
    });
    

})();