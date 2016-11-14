(function() {
'use strict';
    angular
        .module('UniversityApp.course')
        .controller('CourseEditController', CourseEditController);

    CourseEditController.$inject = ['$rootScope','$scope','$q','$modalInstance','course','departments','DataService','LoadSettings','toastr'];
    
    function CourseEditController($rootScope,$scope,$q,$modalInstance, course,departments,DataService,LoadSettings,toastr) {
        var vm = this;
        
        vm.opened = false;
        vm.course=course;
        vm.departments=departments;
        console.log(vm.departments);

        if(vm.course.DepartmentID != null)
            vm.selectedDepartmentId = vm.course.DepartmentID.toString(); //For edit course
        else
            vm.selectedDepartmentId = "null"; //For new course
            
        vm.submitForm = submitForm;
        vm.cancelForm = cancelForm;
        vm.open = openDatePicker;

        activate();
        ////////////////
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }
        function submitForm() {
            vm.course.DepartmentID = (vm.selectedDepartmentId === "null") ? null: parseInt(vm.selectedDepartmentId);
            vm.course.Credits = parseInt(vm.course.Credits);
            if(vm.course.isNew){
                if(vm.course.hasOwnProperty('isNew')){
                    delete vm.course.isNew; //delete this extra added property from object            
                }                
                DataService.newCourse(vm.course).then(
                    function(){
                        //TODO: refresh Course list after data change                    
                        $rootScope.$broadcast("reloadCourseData");
                        toastr.success("Course has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Course has not been  Updated/Inserted");
                });
            }
            else{
                if(vm.course.hasOwnProperty('isNew')){
                    delete vm.course.isNew; //delete this extra added property from object            
                }                
                DataService.editCourse(vm.course).then(
                    function(){
                        //TODO: refresh Course list after data change                    
                        $rootScope.$broadcast("reloadCourseData");
                        toastr.success("Course has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Course has not been  Updated/Inserted");
                });

            }            
            $modalInstance.close();
        };  
        function cancelForm() {
            $modalInstance.dismiss();
        };

        function activate() { 
            //TODO : add deprtment with this object
            vm.tooltip=LoadSettings.getTooltip();
        }//activate
    }
})();
