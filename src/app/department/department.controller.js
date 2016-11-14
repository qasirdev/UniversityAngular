(function() {
'use strict';
    angular
        .module('UniversityApp.department')
        .controller('DepartmentController', DepartmentController);

    DepartmentController.$inject = ['$rootScope','$scope','$q','$modal','$uibModal','$filter','departments','DataService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile','toastr','DepartmentService'];
    
    function DepartmentController($rootScope,$scope,$q,$modal,$uibModal,$filter,departments,DataService, DTOptionsBuilder, DTColumnBuilder,$compile,toastr,DepartmentService) {
        var vm = this;
        
        vm.departments=departments;
        console.log(vm.departments);
        vm.department={};
        vm.editDepartment=editDepartment;
        vm.addDepartment=addDepartment;
        vm.deleteDepartment=deleteDepartment;

        vm.dtColumns = getDtColumns();
        vm.dtInstance = {};
        vm.reloadData=reloadData;

        $rootScope.$on("reloadDepartmentData", function(){
            vm.reloadData();
        });

        activate();
        ////////////////

        function activate() { 
              
        }//activate


        function addDepartment(id) {

            vm.department= DepartmentService.getNewDepartment();
            vm.administrators= DataService.getInstructors();
            vm.department.isNew=true;
            
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/department/departmentedit.html',
                    controller: 'DepartmentEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        department: function () { return vm.department; },
                        administrators: function () { return vm.administrators; }
                    }

                });            

        };

        function editDepartment(id) {

            vm.department = _.find(vm.departments, function (o) { return o.id == id; });
            vm.department.StartDate== $filter('date')(vm.department.StartDate, "dd.MM.yyyy");
            vm.administrators= DataService.getInstructors();
            vm.department.isNew=false;

                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/department/departmentedit.html',
                    controller: 'DepartmentEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        department: function () { return vm.department; },
                        administrators: function () { return vm.administrators; }
                    }

                });                            

        };

        function deleteDepartment(id) {
            swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this depertment!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                
                    if (isConfirm) {
                        DataService.deleteDepartment(id).then(function () {
                            $rootScope.$broadcast("reloadDepartmentData");
                                toastr.success("Department has been successfully Deleted");
                        })

                    swal("Deleted!", "Department has been deleted.", "success");
                } else {
                    swal("Cancelled!", "Department is safe.", "error");
                }
            });
            
        };

        //start datatable related code

        function reloadData() {
            DataService.getDepartments().then(function(response){
               vm.departments=response;
               vm.dtInstance.changeData($q.when(vm.departments));

            });
        };
        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            return $q.when(vm.departments); //returned data is promise
        }).withPaginationType('full_numbers')//.withTableTools('/assets/global/img/swf/copy_csv_xls_pdf.swf')
        .withDataProp('data')
        .withOption('autoWidth', false)
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        });
        function getDtColumns() {
            
            return [
            DTColumnBuilder.newColumn('id').withTitle('#'),
            DTColumnBuilder.newColumn('Name').withTitle('Name'),
            DTColumnBuilder.newColumn('Budget').withTitle('Budget')
                .renderWith(function (data, type, full) {
                    return (angular.isUndefined(data)) ? 'None' : '£ '+ data;
                }),
             DTColumnBuilder.newColumn('StartDate').withTitle('Start Date')
                .renderWith(function (data, type, full) {
                    return $filter('date')(data, "dd.MM.yyyy");
                }),
            DTColumnBuilder.newColumn('Administrator').withTitle('Administrator')
                .renderWith(function (data, type, full) {
                    return (angular.isUndefined(data)) ? 'None' : data;
                }),
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<i class="fa fa-edit" style="color:#EF4836; cursor:pointer" ng-click="vm.editDepartment(' + data.id + ')"></i>    ' +
                    '<i class="fa fa-remove" style="color:#EF4836; cursor:pointer" ng-click="vm.deleteDepartment(' + data.id + ')"></i>';
                })
            ];
        };
        //end datatable related code

        // set sidebar closed and body solid layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;  

    }
})();
