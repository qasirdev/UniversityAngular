(function () {
    'use strict';

    angular.module('UniversityApp').factory('DataService', DataService);

    DataService.$inject = ['$rootScope', '$http', '$q'];

    function DataService($rootScope, $http, $q) {
        var service = {

            getStudents: getStudents,
            getStudent: getStudent,
            newStudent: newStudent,
            editStudent: editStudent,
            deleteStudent: deleteStudent,

            getInstructors: getInstructors,
            getInstructor: getInstructor,
            newInstructor: newInstructor,
            editInstructor: editInstructor,
            deleteInstructor: deleteInstructor,

            getCourses: getCourses,
            getCourse: getCourse,
            newCourse: newCourse,
            editCourse: editCourse,
            deleteCourse: deleteCourse,

            getDepartments:getDepartments,
            getDepartment: getDepartment,
            newDepartment: newDepartment,
            editDepartment: editDepartment,
            deleteDepartment: deleteDepartment,

        };

        //RUN fake API
        //https://github.com/typicode/json-server
        
        //Examples
        //http://localhost:3000/Departments?_embed=Courses  
        //http://localhost:3000/Courses?_expand=Department  
        //http://localhost:3000/Persons?_embed=Departments  
        
        var baseUrl = 'http://localhost:3000';
        var requestConfig = {
            headers: {
                'X-ZUMO-APPLICATION': 'GSECUHNQOOrCwgRHFFYLXWiViGnXNV88',
                'Content-Type': 'application/json; charset=utf-8'
            }
        };

        return service;

        //Student
        function getStudents() {

            var students = httpGet('/Persons?HireDate=null');
            var studentGrade = httpGet('/StudentGrade');
            var courses = httpGet('/Courses');

            $q.all([students, studentGrade, courses]).then(function (data) {
                //student objects forEach
                angular.forEach(data[0], function (studentvalue, studentkey) {
                    studentvalue.couses = [];

                    function isCourseStudy(n) {

                        if (n.StudentID === studentvalue.id) {
                            return n;
                        }
                    }
                    var courseStudy = _.filter(data[1], isCourseStudy); //we can use Array.filter

                    if (courseStudy.length > 0) {

                        angular.forEach(courseStudy, function (courseGradevalue, courseGradekey) {
                            //check from each course which student is enrolled

                            function isCourse(value, index, array) {
                                if (value.id === courseGradevalue.CourseID) {
                                    return value;
                                }
                            };
                            var course = data[2].filter(isCourse); //we can use loadash like _.filter

                            if (course.length > 0) {
                                angular.forEach(course, function (coursevalue, coursekey) {
                                    //attach courses with student object
                                    studentvalue.couses.push(coursevalue);
                                });

                            } //if (course.length > 0)

                        });


                    }//if (courseStudy.length > 0)


                }); //forEach studentvalue
            });

            return students;//HireDate = "" for student
        }

        function getStudent(id) {
            return httpGet('/Persons/' + id);
        }

        function newStudent(student) {
            if(student.hasOwnProperty('couses')){
                delete student.couses; //delete this extra added property from object            
            }
            
            return httpPost('/Persons', student);
        }
        function editStudent(student) {
            if(student.hasOwnProperty('couses')){
                delete student.couses; //delete this extra added property from object            
            }
            //TODO here update is not wroking as required so delete first then inert new.
            httpDelete('/Persons/' + student.id);
            return httpPost('/Persons', student);
        }

        function deleteStudent(id) {
            return httpDelete('/Persons/' + id);
        }

        //Instructor
        function getInstructors() {

            var instructors = httpGet('/Persons?EnrollmentDate=null'); //return data where EnrollmentDate is empty
            var courseInstructors = httpGet('/CourseInstructors');
            var courses = httpGet('/Courses');
            var officeAssignments = httpGet('/OfficeAssignments');

            $q.all([instructors, courseInstructors, courses, officeAssignments]).then(function (data) {
                //instructor objects forEach
                angular.forEach(data[0], function (instructortvalue, instructorkey) {
                    instructortvalue.couses = [];

                    function isCourseTaught(n) {

                        if (n.PersonID === instructortvalue.id) {
                            return n;
                        }
                    }
                    var courseTaught = _.filter(data[1], isCourseTaught); //we can use Array.filter

                    if (courseTaught.length > 0) {

                        angular.forEach(courseTaught, function (courseInstructorvalue, courseInstructorkey) {
                            //check from each course which instructor is teaching

                            function isCourse(value, index, array) {  
                                if (value.id === courseInstructorvalue.id) {
                                    return value;
                                }
                            };
                            var course = data[2].filter(isCourse); //we can use loadash like _.filter

                            if (course.length > 0) {
                                angular.forEach(course, function (coursevalue, coursekey) {
                                    //attach courses with instructor object
                                    instructortvalue.couses.push(coursevalue);
                                });
                            } //if (course.length > 0)

                            //if OfficeAssignments
                            var officeAssignmentFind=_.find(data[3], function (o) { return o.id == instructortvalue.id; });
                            if(!angular.isUndefined(officeAssignmentFind))
                            {
                                instructortvalue.OfficeAssignment=officeAssignmentFind
                            }
                            else{
                                instructortvalue.OfficeAssignment=null;                        
                            }

                        });


                    }//if (courseTaught.length > 0)


                }); //forEach instructortvalue
            });

            return instructors;//EnrollmentDate = "" for instructor
        }

        function getInstructor(id) {
            return httpGet('/Persons/' + id);
        }

        function newInstructor(instructor) {
            if(instructor.hasOwnProperty('couses')){
                delete instructor.couses; //delete this extra added property from object            
            }
            return httpPost('/Persons', instructor);
        }

        function editInstructor(instructor) {
            if(instructor.hasOwnProperty('couses')){
                delete instructor.couses; //delete this extra added property from object            
            }
            httpDelete('/Persons/' + instructor.id);            
            return httpPost('/Persons', instructor);
        }

        function deleteInstructor(id) {
            return httpDelete('/Persons/' + id);
        }
        
        //Course
        function getCourses() {

            var courses = httpGet('/Courses');
            var departments = httpGet('/Departments');

            var onlinecourses = httpGet('/OnlineCourses');
            var onsitecourses = httpGet('/OnsiteCourses');

            $q.all([courses,departments, onlinecourses, onsitecourses]).then(function (data) {
                //student objects forEach
                angular.forEach(data[0], function (coursevalue, coursekey) {

                    //add Department property with coursevalue object
                    coursevalue.Department = _.find(data[1], function (o) { return o.id == coursevalue.DepartmentId; });

                    //if onlinecourses
                    var onlineCourseFind=_.find(data[2], function (o) { return o.id == coursevalue.id; });
                    if(!angular.isUndefined(onlineCourseFind))
                    {
                        coursevalue.OnlineCourse=onlineCourseFind
                    }
                    else{
                        coursevalue.OnlineCourse=null;                        
                    }
                    //if onsitecourses
                    var onsiteCourseFind=_.find(data[3], function (o) { return o.id == coursevalue.id; });
                    if(!angular.isUndefined(onsiteCourseFind))
                    {
                        coursevalue.OnsiteCourse=onsiteCourseFind
                    }
                    else{
                        coursevalue.OnsiteCourse=null;                        
                    }

                }); //forEach coursevalue
            });

            return courses;
        }
        function getCourse(id) {
            return httpGet('/Courses/' + id);
        }

        function newCourse(course) {
            if(course.hasOwnProperty('Department')){
                delete course.Department; //delete this extra added property from object            
            }
            if(course.hasOwnProperty('OnlineCourse')){
                delete course.OnlineCourse;           
            }
            if(course.hasOwnProperty('OnsiteCourse')){
                delete course.OnsiteCourse;           
            }
            if(course.hasOwnProperty('People')){
                delete course.People;           
            }
            if(course.hasOwnProperty('StudentGrades')){
                delete course.StudentGrades;           
            }
            
            return httpPost('/Courses', course);
        }
        function editCourse(course) {
            if(course.hasOwnProperty('Department')){
                delete course.Department; //delete this extra added property from object            
            }
            if(course.hasOwnProperty('OnlineCourse')){
                delete course.OnlineCourse;           
            }
            if(course.hasOwnProperty('OnsiteCourse')){
                delete course.OnsiteCourse;           
            }
            if(course.hasOwnProperty('People')){
                delete course.People;           
            }
            if(course.hasOwnProperty('StudentGrades')){
                delete course.StudentGrades;           
            }
            httpDelete('/Courses/' + course.id);
            return httpPost('/Courses', course);
        }

        function deleteCourse(id) {
            return httpDelete('/Courses/' + id);
        }

        //Department
        function getDepartments() {
            return httpGet('/Departments');
        }


        function getDepartment(id) {
            return httpGet('/Departments/' + id);
        }

        function newDepartment(department) {            
            return httpPost('/Departments', department);
        }

        function editDepartment(department) {    
            httpDelete('/Departments/' + department.id);        
            return httpPost('/Departments', department);
        }

        function deleteDepartment(id) {
            return httpDelete('/Departments/' + id);
        }
/////////////////////////

/**
 * Private Methods
 */


        // function getUrlByLeagueId(url, leagueId){
        //     return url + '?$top=100&$filter=' + encodeURIComponent('leagueId eq \'' + leagueId + '\'');            
        // }

        function httpDelete(url) {
            return httpExecute(url, 'DELETE');
        }

        function httpExecute(requestUrl, method, data) {
            //TODO add spinner service in project
            //appSpinner.showSpinner();
            var deferred = $q.defer();
            return $http({
                url: baseUrl + requestUrl,
                method: method,
                data: data,
                headers: requestConfig.headers
            }).then(function (response) {

                //appSpinner.hideSpinner();
                console.log('**response from EXECUTE', response);

                deferred.resolve(response.data);
                return deferred.promise;
                //return response.data;
            });
        }

        function httpGet(url) {
            return httpExecute(url, 'GET');
        }

        function httpPatch(url, data) {
            return httpExecute(url, 'PATCH', data);
        }

        function httpPost(url, data) {
            return httpExecute(url, 'POST', data);
        }

        function httpPut(url, data) {
            return httpExecute(url, 'PUT', data);
        }

        function saveItem(url, item) {
            if (item.id) {
                return httpPatch(url + '/' + item.id, item);
            } else {
                return httpPost(url, item);
            }
        }
    }
})();
