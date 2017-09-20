(function(){
    'use strict';
    loggerApp.directive("episodes",function(){
        return  {
            restrict : 'E',
            templateUrl : 'views/directives/episodes.html',
            replace : true
        } 
    })
        .directive("searchResult",function(){
        return  {
            restrict : 'E',
            templateUrl : 'views/directives/searchResult.html',
            replace : true       
        } 
    });
})();
