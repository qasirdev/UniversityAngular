(function() {
'use strict';
    angular
        .module('UniversityApp.student')
        .controller('StudentEditController', StudentEditController);

    StudentEditController.$inject = ['$rootScope','$scope','$q','$modalInstance','student','DataService','LoadSettings','toastr'];
    
    function StudentEditController($rootScope,$scope,$q,$modalInstance, student,DataService,LoadSettings,toastr) {
        var vm = this;
        
        vm.submitForm = submitForm;
        vm.cancelForm = cancelForm;
        vm.open = openDatePicker;
        vm.opened = false;
        
        activate();
        ////////////////
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.opened = true;
        }
        function submitForm() {
            if(vm.student.isNew){
                if(vm.student.hasOwnProperty('isNew')){
                    delete vm.student.isNew; //delete this extra added property from object            
                }                
                DataService.newStudent(vm.student).then(
                    function(){
                        //TODO: refresh student list after data change                    
                        $rootScope.$broadcast("reloadStudentData");
                        toastr.success("Student has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Student has not been  Updated/Inserted");
                });
            }
            else{
                if(vm.student.hasOwnProperty('isNew')){
                    delete vm.student.isNew; //delete this extra added property from object            
                }                
                DataService.editStudent(vm.student).then(
                    function(){
                        //TODO: refresh student list after data change                    
                        $rootScope.$broadcast("reloadStudentData");
                        toastr.success("Student has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Student has not been  Updated/Inserted");
                });
            }

            $modalInstance.close();
        };  
        function cancelForm() {
            $modalInstance.dismiss();
        };

        function activate() { 
            vm.student=student;
            vm.student.EnrollmentDate=new Date(vm.student.EnrollmentDate); //convert from string date to date object
            vm.tooltip=LoadSettings.getTooltip();
        }//activate
    }
})();
