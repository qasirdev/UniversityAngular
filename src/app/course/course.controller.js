(function() {
'use strict';
    angular
        .module('UniversityApp.course')
        .controller('CourseController', CourseController);

     CourseController.$inject = ['$rootScope','$scope','$q','$modal','$uibModal','$filter','courses','DataService', 'DTOptionsBuilder', 'DTColumnBuilder', '$compile','toastr','CourseService'];
    
    function CourseController($rootScope,$scope,$q,$modal,$uibModal,$filter,courses,DataService, DTOptionsBuilder, DTColumnBuilder,$compile,toastr,CourseService) {
        var vm = this;
        
        vm.courses=courses;
        console.log(vm.courses);
        vm.course={};
        vm.editCourse=editCourse;
        vm.addCourse=addCourse;
        vm.deleteCourse=deleteCourse;

        vm.dtColumns = getDtColumns();
        vm.dtInstance = {};
        vm.reloadData=reloadData;

        $rootScope.$on("reloadCourseData", function(){
            vm.reloadData();
        });

        activate();
        ////////////////

        function activate() { 
              
        }//activate


        function addCourse(id) {

            vm.course= CourseService.getNewCourse();
            vm.departments= DataService.getDepartments();
            vm.course.isNew=true;

                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/course/Courseedit.html',
                    controller: 'CourseEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        course: function () { return vm.course; },
                        departments: function () { return vm.departments; }
                    }

                });            

        };

        function editCourse(id) {

            vm.course = _.find(vm.courses, function (o) { return o.id == id; });
            vm.departments= DataService.getDepartments();
            vm.course.isNew=false;

                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/course/Courseedit.html',
                    controller: 'CourseEditController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                        course: function () { return vm.course; },
                        departments: function () { return vm.departments; }
                    }

                });                            

        };

        function deleteCourse(id) {
            swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this course!",
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
                        DataService.deleteCourse(id).then(function () {
                            $rootScope.$broadcast("reloadCourseData");
                            toastr.success("Course has been successfully Deleted");
                        })

                    swal("Deleted!", "Course has been deleted.", "success");
                } else {
                    swal("Cancelled!", "Course is safe.", "error");
                }
            });
            
        };

        //start datatable related code

        function reloadData() {
            DataService.getCourses().then(function(response){
               vm.courses=response;
               vm.dtInstance.changeData( $q.when(vm.courses));
            });
        };

        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function () {
            return $q.when(vm.courses); //returned data is promise
        }).withPaginationType('full_numbers')//.withTableTools('/assets/global/img/swf/copy_csv_xls_pdf.swf')
        .withDataProp('data')
        .withOption('autoWidth', false)
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        });
        function getDtColumns() {
            
            return [
            DTColumnBuilder.newColumn('id').withTitle('Course ID'),
            DTColumnBuilder.newColumn('Title').withTitle('Title'),
            DTColumnBuilder.newColumn('OnlineCourse').withTitle('Course Type')
                .renderWith(function (data, type, full) {
                    return (angular.isUndefined(data)) ? 'Onsite' : 'Online';
                }),
            DTColumnBuilder.newColumn('Credits').withTitle('Credits'),
            DTColumnBuilder.newColumn('Department').withTitle('Department')
                .renderWith(function (data, type, full) {
                    return (angular.isUndefined(data)) ? 'None' : data.Name;//data.Name;
                }),
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
                .renderWith(function (data, type, full, meta) {
                    return '<i class="fa fa-edit" style="color:#EF4836; cursor:pointer" ng-click="vm.editCourse(' + data.id + ')"></i>    ' +
                    '<i class="fa fa-remove" style="color:#EF4836; cursor:pointer" ng-click="vm.deleteCourse(' + data.id + ')"></i>';
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
