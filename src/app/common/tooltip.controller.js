(function() {
'use strict';

    angular
        .module('UniversityApp')
        .controller('tooltipController', tooltipController);

    tooltipController.$inject = ['LoadSettings'];
    function tooltipController(LoadSettings) {
        var vm = this;
        

        activate();

        ////////////////

        function activate() {
            vm.tooltip = {};
            vm.tooltip.firstName = "Enter the First Name";
            vm.tooltip.lastName = "Enter the Last Name";
            vm.tooltip.enrollmentDate = "Select the Enrollment Date";

            vm.tooltip.courseId="Enter the Course Id";
            vm.tooltip.courseTitle="Enter the Course Title";
            vm.tooltip.courseCredits="Enter the Course Credit";

            vm.tooltip.departmentName="Enter the Department Name";
            vm.tooltip.budget="Enter the Department Budget";

            LoadSettings.setTooltip(vm.tooltip);
            
         }
    }
})();
