(function() {
'use strict';

    angular
        .module('UniversityApp')
        .factory('DepartmentService', DepartmentService); 

    DepartmentService.$inject = [];
    function DepartmentService() {
        var service = {
            getNewDepartment:getNewDepartment
        };
        
        return service;

        ////////////////
         function getNewDepartment(departmentName, budget, startDate, administratorId) { 
             return {
                     "Name": typeof departmentName !== 'undefined' ? departmentName : "",
                    "Budget": typeof budget !== 'undefined' ? budget : "",
                    "StartDate": typeof startDate !== 'undefined' ? startDate : new Date(),
                    "PersonId": typeof administratorId !== 'undefined' ? administratorId : null,
                    };

             }
    }
})();