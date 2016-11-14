(function() {
'use strict';
    angular
        .module('UniversityApp.instructor')
        .controller('InstructorEditController', InstructorEditController);

    InstructorEditController.$inject = ['$rootScope','$scope','$q','$modalInstance','instructor','DataService','LoadSettings','toastr'];
    
    function InstructorEditController($rootScope,$scope,$q,$modalInstance, instructor,DataService,LoadSettings,toastr) {
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
            if(vm.instructor.isNew){
                if(vm.instructor.hasOwnProperty('isNew')){
                    delete vm.instructor.isNew; //delete this extra added property from object            
                }                
                DataService.newInstructor(vm.instructor).then(
                    function(){
                        //TODO: refresh Instructor list after data change                    
                        $rootScope.$broadcast("reloadInstructorData");
                        toastr.success("Instructor has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Instructor has not been  Updated/Inserted");
                }); 
           }
            else{
                if(vm.instructor.hasOwnProperty('isNew')){
                    delete vm.instructor.isNew; //delete this extra added property from object            
                }                
                DataService.editInstructor(vm.instructor).then(
                    function(){
                        //TODO: refresh Instructor list after data change                    
                        $rootScope.$broadcast("reloadInstructorData");
                        toastr.success("Instructor has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Instructor has not been  Updated/Inserted");
                });                
            }

            $modalInstance.close();
        };  
        function cancelForm() {
            $modalInstance.dismiss();
        };

        function activate() { 
            vm.instructor=instructor;
            vm.instructor.HireDate=new Date(vm.instructor.HireDate); //convert from string date to date object
            vm.tooltip=LoadSettings.getTooltip();
        }//activate
    }
})();
