(function() {
'use strict';
    angular
        .module('UniversityApp.instructor')
        .controller('InstructorController', InstructorController);

    InstructorController.$inject = ['$rootScope','$scope','$q','$modal','$uibModal','$filter','instructors','DataService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile','toastr','InstructorService'];
    
    function InstructorController($rootScope,$scope,$q,$modal,$uibModal,$filter,instructors,DataService, DTOptionsBuilder, DTColumnBuilder,$compile,toastr,InstructorService) {
        var vm = this;
        
        vm.instructors=instructors;
        vm.instructor={};
        vm.editInstructor=editInstructor;
        vm.addInstructor=addInstructor;
        vm.deleteInstructor=deleteInstructor;

        vm.dtColumns = getDtColumns();
        vm.dtInstance = {};
        vm.reloadData=reloadData;

        $rootScope.$on("reloadInstructorData", function(){
            vm.reloadData();
        });

        activate();
        ////////////////

        function activate() { 
              
        }//activate


        function addInstructor(id) {

            vm.instructor= InstructorService.getNewInstructor();
            vm.instructor.isNew=true;

                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/instructor/instructoredit.html',
                    controller: 'InstructorEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        instructor: function () { return vm.instructor; }
                    }

                });            

        };

        function editInstructor(id) {

            vm.instructor = _.find(vm.instructors, function (o) { return o.id == id; });
            //vm.instructor.EnrollmentDate== $filter('date')(vm.instructor.EnrollmentDate, "dd.MM.yyyy");
            vm.instructor.isNew=false;

                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/instructor/instructoredit.html',
                    controller: 'InstructorEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        instructor: function () { return vm.instructor; }
                    }

                });                            

        };

        function deleteInstructor(id) {
            swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this instructor!",
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
                        DataService.deleteInstructor(id).then(function () {
                            $rootScope.$broadcast("reloadInstructorData");
                                toastr.success("Instructor has been successfully Deleted");
                        })

                    swal("Deleted!", "Instructor has been deleted.", "success");
                } else {
                    swal("Cancelled!", "Instructor is safe.", "error");
                }
            });
            
        };

        //start datatable related code

        function reloadData() {
            DataService.getInstructors().then(function(response){
               vm.instructors=response;
               vm.dtInstance.changeData($q.when(vm.instructors));

            });
        };
        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            return $q.when(vm.instructors); //returned data is promise
        }).withPaginationType('full_numbers')//.withTableTools('/assets/global/img/swf/copy_csv_xls_pdf.swf')
        .withDataProp('data')
        .withOption('autoWidth', false)
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        });
        function getDtColumns() {
            
            return [
            DTColumnBuilder.newColumn(null).withTitle('Images')
                  .renderWith(function (data, type, full, meta) {
                      return '<div class="mt-action-img"><img ng-src="' + data.picture + '" ng-click="vm.editInstructor(' + data.id + ')" style="cursor:pointer" /></div>'
                  }).notSortable(),    
            DTColumnBuilder.newColumn('FirstName').withTitle('First Name'),
            DTColumnBuilder.newColumn('LastName').withTitle('Last Name'),
            DTColumnBuilder.newColumn('HireDate').withTitle('Hire Date')
                .renderWith(function (data, type, full) {
                    return $filter('date')(data, "dd.MM.yyyy");//(data.length===0)? 'None' : coursesTitle;
                }),
            DTColumnBuilder.newColumn('couses').withTitle('Couses Taught')
                .renderWith(function (data, type, full) {
                    var coursesName=[];
                        angular.forEach(data, function (value, key) {
                            coursesName.push(value.id + "-" + value.Title);
                        });
                        var coursesTitle = coursesName.join(' , ');
                    return (data.length===0)? 'None' : coursesTitle;
                }),
            DTColumnBuilder.newColumn('OfficeAssignment').withTitle('Office')
                .renderWith(function (data, type, full) {
                    return (angular.isUndefined(data)) ? 'None' : data.Location;
                }),
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<i class="fa fa-edit" style="color:#EF4836; cursor:pointer" ng-click="vm.editInstructor(' + data.id + ')"></i>    ' +
                    '<i class="fa fa-remove" style="color:#EF4836; cursor:pointer" ng-click="vm.deleteInstructor(' + data.id + ')"></i>';
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
