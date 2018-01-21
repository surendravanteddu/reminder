(function () {
    'use strict';
    loggerApp.config(routerConfig);
    function routerConfig($stateProvider,$urlRouterProvider){

        $stateProvider
            .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller : 'loginController'
        })  
            .state('resetpass', {
            url: '/resetpass',
            views: {
                '':{
                    templateUrl: 'views/resetPass.html',
                    controller : 'resetpassController'
                },
                'header@resetpass':{
                    templateUrl: 'views/main.html',
                    controller: 'headerController',
                },
            }
        })
            .state('main', {
            abstract : true,
            templateUrl: 'views/main.html',
            controller: 'headerController'
        }).state('main.home',{
            url: '/',
            views: {
                'mainBody' : {
                    templateUrl : 'views/home.html',
                    controller : 'homeController'
                }
            }
        }).state('main.resultInfo',{
            url: '/series/:showName/:showId',
            views: {
                'mainBody' : {
                    templateUrl : 'views/seriesInfo.html',
                    controller : 'seriesInfoController'
                }
            }
        });
        
        $urlRouterProvider.otherwise('/');
        
    };
})();






