(function () {
    'use strict';
    loggerApp.config(routerConfig);
    function routerConfig($stateProvider,$urlRouterProvider){

        $stateProvider
            .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller : 'loginController'
        }).state('main', {
            abstract : true,
            templateUrl: 'views/main.html'
        }).state('main.home',{
            url: '/',
            views: {
                'headerBar' : {
                    templateUrl : 'views/header.html',
                    controller : 'headerController'
                },
                'mainBody' : {
                    templateUrl : 'views/home.html',
                    controller : 'homeController'
                }
            }
        }).state('main.resultInfo',{
            url: '/series/:showName/:showId',
            views: {
                'headerBar' : {
                    templateUrl : 'views/header.html',
                    controller : 'headerController'
                },
                'mainBody' : {
                    templateUrl : 'views/seriesInfo.html',
                    controller : 'seriesInfoController'
                }
            }
        });
        
        $urlRouterProvider.otherwise('/');
        
    };
})();






