(function () {
    'use strict';

    angular.module('UniversityApp.instructor', [

    ])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider

             //Dashboard
            .state('home.instructor', {
                url: "/instructor",
                templateUrl: "app/instructor/instructor.html",
                data: { pageTitle: 'Instructor' },
                controller: "InstructorController",
                controllerAs: "vm",
                 resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'UniversityApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                            files: [                             
                                '../assets/global/plugins/datatables/datatables.min.css', 
                                '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                                '../assets/global/plugins/datatables/datatables.all.min.js',
                                '../assets/global/scripts/datatable.min.js',

                                '../assets/pages/scripts/components-date-time-pickers.min.js',    

                                '../lib/angular-datatables/dist/angular-datatables.min.js',
                                
                                '../lib/bootstrap-sweetalert/dist/sweetalert.css',
                                '../lib/bootstrap-sweetalert/dist/sweetalert.min.js',

                                'app/instructor/instructor.controller.js',          
                                'app/instructor/instructoredit.controller.js',
                          ]
                        }).then(function success(args) {
                            console.log('success');
                            return args;
                        }, function error(err) {
                            console.log(err);
                            return err;
                        });
                    }],
                     instructors: function (DataService) {
                         return DataService.getInstructors();
                     }
                }
            })
    }]);
})();