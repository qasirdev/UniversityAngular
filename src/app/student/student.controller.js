(function() {
'use strict';
    angular
        .module('UniversityApp.student')
        .controller('StudentController', StudentController);

    StudentController.$inject = ['$rootScope','$scope','$q','$modal','$uibModal','$filter','students','DataService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile','toastr','PersonService'];
    
    function StudentController($rootScope,$scope,$q,$modal,$uibModal,$filter,students,DataService, DTOptionsBuilder, DTColumnBuilder,$compile,toastr,PersonService) {
        var vm = this;
        
        vm.students=students;
        vm.student={};
        vm.editStudent=editStudent;
        vm.addStudent=addStudent;
        vm.deleteStudent=deleteStudent;

        vm.dtColumns = getDtColumns();
        vm.dtInstance = {};
        vm.reloadData=reloadData;

        $rootScope.$on("reloadStudentData", function(){
            vm.reloadData();
        });

        activate();
        ////////////////

        function activate() { 
              
        }//activate


        function addStudent(id) {

            vm.student= PersonService.getNewStudent();
            vm.student.isNew=true;
            
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/student/studentedit.html',
                    controller: 'StudentEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        student: function () { return vm.student; }
                    }

                });            

        };

        function editStudent(id) {

            vm.student = _.find(vm.students, function (o) { return o.id == id; });
            vm.student.EnrollmentDate== $filter('date')(vm.student.EnrollmentDate, "dd.MM.yyyy");
            vm.student.isNew=false;

                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/student/studentedit.html',
                    controller: 'StudentEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        student: function () { return vm.student; }
                    }

                });                            

        };

        function deleteStudent(id) {
            swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this student!",
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
                        DataService.deleteStudent(id).then(function () {
                            $rootScope.$broadcast("reloadStudentData");
                                toastr.success("Student has been successfully Deleted");
                        })

                    swal("Deleted!", "Student has been deleted.", "success");
                } else {
                    swal("Cancelled!", "Student is safe.", "error");
                }
            });
            
        };

        //start datatable related code

        function reloadData() {
            DataService.getStudents().then(function(response){
               vm.students=response;
               vm.dtInstance.changeData($q.when(vm.students));

            });
        };
        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            return $q.when(vm.students); //returned data is promise
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
                      return '<div class="mt-action-img"><img ng-src="' + data.picture + '" ng-click="vm.editStudent(' + data.id + ')" style="cursor:pointer" /></div>'
                  }).notSortable(),    
            DTColumnBuilder.newColumn('FirstName').withTitle('First Name'),
            DTColumnBuilder.newColumn('LastName').withTitle('Last Name'),
            DTColumnBuilder.newColumn('EnrollmentDate').withTitle('Enrollment Date')
                .renderWith(function (data, type, full) {
                    return $filter('date')(data, "dd.MM.yyyy");//(data.length===0)? 'None' : coursesTitle;
                }),
            DTColumnBuilder.newColumn('couses').withTitle('Enrollments')
                .renderWith(function (data, type, full) {
                    var coursesName=[];
                        angular.forEach(data, function (value, key) {
                            coursesName.push(value.Title);
                        });
                        var coursesTitle = coursesName.join(' , ');
                    return (angular.isUndefined(data)) ? 'None' : coursesTitle;
                }),
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<i class="fa fa-edit" style="color:#EF4836; cursor:pointer" ng-click="vm.editStudent(' + data.id + ')"></i>    ' +
                    '<i class="fa fa-remove" style="color:#EF4836; cursor:pointer" ng-click="vm.deleteStudent(' + data.id + ')"></i>';
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
