var loggerApp;
(function () {
    'use strict';
    loggerApp =  angular
        .module("loggerApp", [
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ngResource',
        'ngMaterial',
        'ngRoute',
        'ngToast'
    ]).run(run);

    run.$inject = ['$rootScope', '$location', '$state'];
    function run($rootScope, $location, $state) {
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
               if(!localStorage.getItem('formioToken') && !($location.path()== '/login' || $location.path()== '/resetpass') ){
                    console.log('loginsadfas');
                    $location.path('/login');
                }else if(localStorage.getItem('formioToken') && $location.path()== '/login'){
                    $location.path('/');
                }
        });
    }
    
    var API_URL = 'https://judmyihfvslaczr.form.io';
    var TVMaze_API = 'https://api.tvmaze.com';

    loggerApp.constant('AppConfig', {
        apiUrl: API_URL,
        tvMazeApiUrl : TVMaze_API,  
        forms: {
            userRegister: API_URL + '/user/register/submission',
            userLogin: API_URL + '/user/login/submission',
            useractivity: API_URL + '/useractivity/submission',
        }
    });
})();
