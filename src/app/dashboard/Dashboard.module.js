(function () {
    'use strict';

    angular.module('UniversityApp.dashboard', [

    ])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider

             //Dashboard
            .state('home.dashboard', {
                url: "/dashboard",
                templateUrl: "app/dashboard/dashboard.html",
                data: { pageTitle: 'Dashboard' },
                controller: "DashboardController",
                //controllerAs: "vm",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'UniversityApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                '../assets/global/plugins/morris/morris.css',
                                '../assets/global/plugins/morris/morris.min.js',
                                '../assets/global/plugins/morris/raphael-min.js',
                                '../assets/global/plugins/jquery.sparkline.min.js',

                                '../assets/pages/scripts/dashboard.min.js',
                                'app/dashboard/dashboard.controller.js',
                            ]
                        });
                    }]
                }
            })
    }]);
})();