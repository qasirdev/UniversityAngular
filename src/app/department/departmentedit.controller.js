(function() {
'use strict';
    angular
        .module('UniversityApp.department')
        .controller('DepartmentEditController', DepartmentEditController);

    DepartmentEditController.$inject = ['$rootScope','$scope','$q','$modalInstance','department','administrators','DataService','LoadSettings','toastr'];
    
    function DepartmentEditController($rootScope,$scope,$q,$modalInstance, department,administrators,DataService,LoadSettings,toastr) {
        var vm = this;
        
        vm.opened = false;
        vm.department=department;
        vm.department.StartDate=new Date(vm.department.StartDate); //convert from string date to date object
        vm.administrators=administrators;

        if(vm.department.Administrator != null)
            vm.selectedAdministratorId = vm.department.Administrator.toString(); //For edit department
        else
            vm.selectedAdministratorId = "null"; //For new course
        

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
            vm.department.PersonId = (vm.selectedAdministratorId === "null") ? null: parseInt(vm.selectedAdministratorId);
            if(vm.department.isNew){
                if(vm.department.hasOwnProperty('isNew')){
                    delete vm.department.isNew; //delete this extra added property from object            
                }                
                DataService.newDepartment(vm.department).then(
                    function(){
                        //TODO: refresh Department list after data change                    
                        $rootScope.$broadcast("reloadDepartmentData");
                        toastr.success("Department has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Department has not been  Updated/Inserted");
                });
            }
            else{
                if(vm.department.hasOwnProperty('isNew')){
                    delete vm.department.isNew; //delete this extra added property from object            
                }                
                DataService.editDepartment(vm.department).then(
                    function(){
                        //TODO: refresh Department list after data change                    
                        $rootScope.$broadcast("reloadDepartmentData");
                        toastr.success("Department has been successfully Updated/Inserted");
                    },
                    function (result) {
                        toastr.error("Department has not been  Updated/Inserted");
                });

            }            
            $modalInstance.close();
        };  
        function cancelForm() {
            $modalInstance.dismiss();
        };

        function activate() { 
            vm.tooltip=LoadSettings.getTooltip();
        }//activate
    }
})();
