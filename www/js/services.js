angular.module('starter.services', [])

.factory('CreateNewUserService', function($http, $rootScope) {
    return {
        getUserType: function() {
            return $http.get($rootScope.backend_url+'user_type.php');
        },
        getTeam: function() {
            return $http.get($rootScope.backend_url+'team_all.php');
        },
        getTeamNoMgr: function() {
            return $http.get($rootScope.backend_url+'team_no_mgr.php');
        },
        create: function (data) {
            return $http.post($rootScope.backend_url+'user_add.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        addteammem: function (data) {
            return $http.post($rootScope.backend_url+'team_add_mem.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
    };
})

.factory('LoginService', function($http, $rootScope) {
    return {
        getData: function(data) {
            return $http.post($rootScope.backend_url+'login_auth.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });   
        }
    };
})

.factory('FeedbackService', function($http, $rootScope) {
    return {
        create: function (data) {
            return $http.post($rootScope.backend_url+'feedback_add.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    };
})

.factory('AttendanceService', function($http, $rootScope) {
    return {
        checkin: function (data) {
            return $http.post($rootScope.backend_url+'attendance_add.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        checkout: function(data) {
            return $http.post($rootScope.backend_url+'attendance_out.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getData: function(data) {
            return $http.get($rootScope.backend_url+'attendance_data.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    };
})


.factory('CreatetaskService', function($http, $rootScope) {
    return {
        getEmployee: function(data) {
            return $http.post($rootScope.backend_url+'user_employee.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getJobType: function() {
            return $http.get($rootScope.backend_url+'job_type.php');
        },       
        getProject: function() {
            return $http.get($rootScope.backend_url+'project_all.php')
        },
        getProjectByID: function(data) {
            return $http.post($rootScope.backend_url+'project.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        create: function (data) {
            return $http.post($rootScope.backend_url+'task_add.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }         
    };
})

.factory('ManagerScreenService', function($http, $rootScope) {
    return {
        getAssignedTask: function(data) {
            return $http.post($rootScope.backend_url+'task_list_assigned.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getUnassignedTask: function(data) {
            return $http.post($rootScope.backend_url+'task_list_unassigned.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },   
    };
})

.factory('EmployeeScreenService', function($http, $rootScope) {
    return {
        getTask: function(data) {
            return $http.post($rootScope.backend_url+'task_list_by_user.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },      
    };
})

.factory('TaskService', function($http, $rootScope) {
    return {
        getTask: function(data) {
            return $http.post($rootScope.backend_url+'task_assigned.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
         getTaskDetail: function(data) {
            return $http.post($rootScope.backend_url+'task_detail.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },        
        taskSetTimestamp: function(data) {
            return $http.post($rootScope.backend_url+'task_set_timestamp.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        taskSetStatus: function(data) {
            return $http.post($rootScope.backend_url+'task_set_status.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getStartDate: function(data) {
            return $http.post($rootScope.backend_url+'task_get_timestamp_start.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },                               
    };
})


.factory('ReportService', function($http, $rootScope) {
    return {
        getEmployee: function(data) {
            return $http.post($rootScope.backend_url+'user_employee.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        generateReport: function (data) {
            return $http.post($rootScope.backend_url+'report_generate.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getManhoursByTeam: function(data) {
            return $http.post($rootScope.backend_url+'manhour_by_team.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getManhoursByUser: function(data) {
            return $http.post($rootScope.backend_url+'manhour_by_user.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getManhoursByDay: function(data) {
            return $http.post($rootScope.backend_url+'manhourdetail_by_user.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },            
    };
})


.factory('JobtypeService', function($http, $rootScope) {
    return {
        create: function (data) {
            return $http.post($rootScope.backend_url+'jobtype_add.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }         
    };
})

.factory('CreateTeamService', function($http, $rootScope) {
    return {
        create: function (data) {
            return $http.post($rootScope.backend_url+'team_add.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }         
    };
})


.factory('AssignTaskService', function($http, $rootScope) {
    return {
        getEmployee: function(data) {
            return $http.post($rootScope.backend_url+'user_employee.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getTask: function(data) {
            return $http.post($rootScope.backend_url+'task_unassigned.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },   
        assign: function(data) {
            return $http.post($rootScope.backend_url+'task_assign.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },            
    };
})

.factory('TimesheetService', function($http, $rootScope) {
    return {
        getDetail: function(data) {
            return $http.post($rootScope.backend_url+'timesheet_detail.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },  
        getDetailByUser: function(data) {
            return $http.post($rootScope.backend_url+'timesheet_detail_by_user.php', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },                
    };
})


;