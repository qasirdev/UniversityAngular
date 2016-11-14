/***
University AngularJS App Main Script
***/

/* University App */
var UniversityApp = angular.module("UniversityApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "toastr",
    "UniversityApp.dashboard",
    "UniversityApp.student",
    "UniversityApp.course",
    "UniversityApp.instructor",
    "UniversityApp.department"
]); 

 UniversityApp.config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            showDuration: "5000",
            timeOut: "5000",
            newestOnTop: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body',
            tapToDismiss: true,
        });
    });

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
UniversityApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
UniversityApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
UniversityApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout4',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
UniversityApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
UniversityApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
UniversityApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
UniversityApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Quick Sidebar */
UniversityApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
UniversityApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
UniversityApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);
    

/* Setup Rounting For All Pages */
UniversityApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/home/dashboard");  
    
    $stateProvider

             //Home
            .state('home', {
                url: "/home",
                templateUrl: "app/layout/home.html",
                data: { pageTitle: 'Home' },
                controller: "HomeController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'UniversityApp',
                            insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                            files: [
                                '../assets/global/plugins/morris/morris.css',
                            ]
                        },
                        {
                            name: 'UniversityApp',
                            insertBefore: '#ng_load_plugins_after', 
                            files: [

                                '../assets/layouts/layout4/css/themes/light.min.css',
                                '../assets/layouts/layout4/css/custom.min.css',
                                '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css',
                                '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                                '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                                '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css'

                            ]
                        },
                        {
                            name: 'UniversityApp',
                            insertBefore: '#ng_load_scripts_before', 
                            files: [
                                 '../assets/global/plugins/morris/morris.min.js',
                                '../assets/global/plugins/morris/raphael-min.js',
                                '../assets/global/plugins/jquery.sparkline.min.js',
                                '../assets/pages/scripts/dashboard.min.js',
                                //'../assets/pages/scripts/ui-general.min.js',
                                '../assets/pages/scripts/components-date-time-pickers.min.js',
                                '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                                '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                                '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                                '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js',
                                
                                '../assets/global/plugins/bootstrap-toastr/toastr.min.css',
                                '../assets/global/plugins/bootstrap-toastr/toastr.min.js',

                                //'app/common/modals/reportChild.controller.js',
                                'app/dashboard/dashboard.controller.js',
                            ]
                        },
                        {
                            name: 'UniversityApp',
                            insertBefore: '#ng_load_scripts_after', 
                            files: [
                                '../assets/pages/scripts/components-date-time-pickers.min.js',
                            ]
                        },
                        ]);
                    }]
                }
            });

}]);

/* Init global settings and run the app */
UniversityApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);

  /* Setup App Main Controller */
UniversityApp.controller('HomeController', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
    //$rootScope.isAuthenticated = true;

    if ($state.current.name === "home") {
        $state.go("home.student");
    }
}]);