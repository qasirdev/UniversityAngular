(function() {
'use strict';

    angular
        .module('UniversityApp')
        .factory('CourseService', CourseService);

    CourseService.$inject = [];
    function CourseService() {
        var service = {
            getNewCourse:getNewCourse
        };
        
        return service;

        ////////////////
         function getNewCourse(title, credits, departmentID) { 
             return {
                    "id": Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
                    "Title": typeof title !== 'undefined' ? title : "",
                    "Credits": typeof credits !== 'undefined' ? credits : 3,
                    "DepartmentID": typeof departmentID !== 'undefined' ? departmentID : null,
                    };

             }

    }
})();