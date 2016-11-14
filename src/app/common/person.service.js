(function() {
'use strict';

    angular
        .module('UniversityApp')
        .factory('PersonService', PersonService); //TODO: rename it to StudentService

    PersonService.$inject = [];
    function PersonService() {
        var service = {
            getNewStudent:getNewStudent
        };
        
        return service;

        ////////////////
         function getNewStudent(firstName, lastName, enrollmentDate) { 
             //TODO add default picture avatar
             return {
                    "FirstName" :  typeof firstName !== 'undefined' ? firstName : "",
                    "LastName" : typeof lastName !== 'undefined' ? lastName : "",
                    "picture": "../assets/pages/media/users/avatar10.jpg", 
                    "HireDate": "null",
                    "EnrollmentDate" : typeof enrollmentDate !== 'undefined' ? enrollmentDate : new Date()
                    };

             }

    }
})();