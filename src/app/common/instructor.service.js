(function() {
'use strict';

    angular
        .module('UniversityApp')
        .factory('InstructorService', CourseService);

    CourseService.$inject = [];
    function CourseService() {
        var service = {
            getNewInstructor:getNewInstructor
        };
        
        return service;

        ////////////////
         function getNewInstructor(firstName, lastName, hireDate) { 
             //TODO add default picture avatar
             return {
                    "FirstName" :  typeof firstName !== 'undefined' ? firstName : "",
                    "LastName" : typeof lastName !== 'undefined' ? lastName : "",
                    "picture": "../assets/pages/media/users/avatar10.jpg",
                    "HireDate": typeof hireDate !== 'undefined' ? hireDate : new Date(),
                    "EnrollmentDate" : "null"
                    };

             }
    }
})();