angular.module('starter.controllers', []) 
//Employee Screen Controller
.controller('EmployeeScreenCtrl', function($rootScope, $scope, $ionicPopup, $state, stepwatch, EmployeeScreenService, TaskService, AttendanceService) {

  //display data
  $scope.showData = function() {
        
    if($rootScope.attendid != 0) {
      $scope.checkInDisabled = true;
      if($rootScope.checkout != 0) {
        $scope.checkOutDisabled = true;
      } else {
        $scope.checkOutDisabled = false;
      }
    } else {
      $scope.checkInDisabled = false;
      $scope.checkOutDisabled = true;
    } 

    $scope.curdate = new Date();

    EmployeeScreenService.getTask({
          id: $rootScope.userid,
    }).success(function(data){
      $scope.tasklist = data;
    });

    $scope.$broadcast('scroll.refreshComplete');

  };
  $scope.showData();   

  //attendance check in button
  $scope.AttendIn = function() {
    console.log($rootScope.userid);
    var confirmPopup = $ionicPopup.confirm({
      title: 'Check In',
      template: 'Confirm check-in?'
    });

    confirmPopup.then(function(res) {

      if(res) {
        
        AttendanceService.checkin({
            userid: $rootScope.userid
        }).success(function(data){
            $scope.userid = 0; 
            $rootScope.checkin_check = true;
            $scope.checkInDisabled = true;
            $scope.checkOutDisabled = false;

            var alertPopup = $ionicPopup.alert({
              title: 'Check In',
              template: 'You have successfully checked in'
          });

        }).error(function(data){
            $rootScope.showError({
                title: "INFORMATION",
                message: "Connection failed."
            });
          });  
      }

    });
  }

  //attendance check out button
  $scope.AttendOut = function() {

    var confirmPopup2 = $ionicPopup.confirm({
      title: 'Check Out',
      template: 'Confirm Check Out?'
    });

    confirmPopup2.then(function(res) {

      if(res) {
        AttendanceService.checkout({
            userid: $rootScope.userid
        }).success(function(data){
            $scope.userid = 0; 
            $scope.checkOutDisabled = true;
            $rootScope.checkOutDone = true;

            var alertPopup = $ionicPopup.alert({
              title: 'Check Out',
              template: 'You have successfully checked out'
          });

        }).error(function(data){
            $rootScope.showError({
                title: "INFORMATION",
                message: "Connection failed."
            });
          });  
      }

    })
  } 

  //start task swipe button
  $scope.showStartTaskAlert = function(id) {
     if ($rootScope.starttask_check == true) {
       var alertPopup = $ionicPopup.alert({
         title: 'Current task is active',
         template: 'You need to pause/finish your current task first.'
       });
     } else { 

      $rootScope.hours = 0;
      $rootScope.minutes = 0;
      $rootScope.seconds = 0;

      TaskService.taskSetStatus({
          id: id,
          taskstatusid: 'S',
      });

      TaskService.taskSetTimestamp({
          id: id,
          taskstatusid: 'S',
          userid: $rootScope.userid,
      }).success(function(data){
         $rootScope.starttask_check = true;
         $state.go($state.current, {}, {reload: true});
         var alertPopup = $ionicPopup.alert({
           title: 'Start Task',
           template: 'Task started.'
         });
      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      }); 
    }
  }     

  //stop task swipe button
  $scope.showStopTaskConfirm = function(id) {

   var confirmPopup = $ionicPopup.confirm({
     title: 'Stop Task',
     template: 'Are you sure you want to finish this task?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      TaskService.taskSetStatus({
          id: id,
          taskstatusid: 'F',
      });

        TaskService.taskSetTimestamp({
            id: id,
            taskstatusid: 'F',
            userid: $rootScope.userid,
        }).success(function(data){
            $rootScope.starttask_check = false;
            $state.go($state.current, {}, {reload: true}); 
            var alertPopup = $ionicPopup.alert({
             title: 'Finish Task',
             template: 'Task finished.'
           });       
        }).error(function(data){
            $rootScope.showError({
                title: "INFORMATION",
                message: "Connection failed."
            });
        }); 

     }
   });        
  };   

})

//Task Controller for Task screens
.controller('TaskCtrl', function($scope, $rootScope, $ionicPopup, $state, $stateParams,stepwatch, TaskService) {

  $scope.myStopwatch = stepwatch;
  stepwatch.stop();
  stepwatch.start();

  $scope.curdate = new Date();
  $scope.task={};
  $scope.mgr = true;
  //console.log($rootScope.usertypeid);
  //hide button
  $scope.hidebutton = function(){
      if ($rootScope.usertypeid == 2) {
        return true;
      } 
      else {
        return false;
      }
  }

  //get task info
  TaskService.getTask({
    id: $stateParams.taskId,    
  }).success(function(data){

    // manually parse json
    $stringi = JSON.stringify(data);
    $stringi = $stringi.replace("[","");
    $stringi = $stringi.replace("]","");
    var json = JSON.parse($stringi);

    $scope.id = json.id;
    $scope.type = json.type;
    $scope.city_or_user = json.status_id == "C" ? json.city : json.fullname;
    $scope.status = json.status;
    $scope.time = json.time;
    $scope.address = json.address;
    $scope.contact = json.contact;
    $scope.city = json.city;
    $scope.notes = json.notes;
    $scope.hideproject = function(){
      if (json.projectid == 0) {
        return true;
      }
      else {
        return false;
      }
    }
    //console.log(projectid);
    $scope.projectname = json.projectname;
    $scope.projectdesc = json.projectdesc;
    $scope.taskdate = json.taskdate;
  });

  //start task button
  $scope.startTask = function(id) {
     if ($rootScope.starttask_check == true) {
       var alertPopup = $ionicPopup.alert({
         title: 'Current task is active',
         template: 'You need to finish your current task first.'
       });
     } else { 

      $rootScope.hours = 0;
      $rootScope.minutes = 0;
      $rootScope.seconds = 0;

       TaskService.taskSetStatus({
          id: id,
          taskstatusid: 'S',
      });

      //paste timestamp
      TaskService.taskSetTimestamp({
          id: id,
          taskstatusid: 'S',
          userid: $rootScope.userid,
      }).success(function(data){
        $rootScope.starttask_check = true;
        $state.go("app.taskactive", { taskId: id });

        stepwatch.data.hours = 0;
        stepwatch.data.minutes = 0;
        stepwatch.data.seconds = 0;

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      }); 
    }
  }  

 //task finished button
  $scope.showFinishTaskAlert = function(id) {

    TaskService.taskSetStatus({
        id: id,
        taskstatusid: 'F',
    });

    TaskService.taskSetTimestamp({
        id: id,
        taskstatusid: 'F',
        userid: $rootScope.userid,
    }).success(function(data){
        $rootScope.starttask_check = false;
        $state.go("app.employeescreen", {reload: true}); 
        var alertPopup = $ionicPopup.alert({
         title: 'Finish Task',
         template: 'Job has been finished. Go back to main menu to select other task.'
       });          
    }).error(function(data){
        $rootScope.showError({
            title: "INFORMATION",
            message: "Connection failed."
        });
    }); 
 };   

 //pause task button
 $rootScope.showPauseTaskAlert = function(id) {

    TaskService.taskSetStatus({
        id: id,
        taskstatusid: 'P',
    });

    TaskService.taskSetTimestamp({
        id: id,
        taskstatusid: 'P',
        userid: $rootScope.userid,
        reason: $scope.task.reason,
    }).success(function(data){
        $rootScope.starttask_check = false;
        $state.go("app.employeescreen", {reload: true});
       var alertPopup = $ionicPopup.alert({
         title: 'Pause Task',
         template: 'Job has been paused.'
       });          
    }).error(function(data){
        $rootScope.showError({
            title: "INFORMATION",
            message: "Connection failed."
        });
    });    
 };    
})

//Controller for Manager Screen
.controller('ManagerScreenCtrl', function($scope, $rootScope, $ionicPopup, $state, ManagerScreenService, AttendanceService) {

  $scope.showData = function() {

    if($rootScope.attendid != 0) {
      $scope.checkInDisabled = true;
      if($rootScope.checkout != 0) {
        $scope.checkOutDisabled = true;
      } else {
        $scope.checkOutDisabled = false;
      }
    } else {
      $scope.checkInDisabled = false;
      $scope.checkOutDisabled = true;
    } 

    $scope.curdate = new Date();

    //get assigned tasks
    ManagerScreenService.getAssignedTask({
            id: $rootScope.teamid,
        }).success(function(data){
      $scope.assignedTasks = data;
    });

    //get unassigned tasks
    ManagerScreenService.getUnassignedTask({
            id: $rootScope.teamid,
        }).success(function(data){
      $scope.unassignedTasks = data;
    });

    $scope.$broadcast('scroll.refreshComplete');

  };
  $scope.showData();

  //attendance check in button
  $scope.AttendIn = function() {
    console.log($rootScope.userid);
    var confirmPopup = $ionicPopup.confirm({
      title: 'Check In',
      template: 'Confirm check-in?'
    });

    confirmPopup.then(function(res) {

      if(res) {
        
        AttendanceService.checkin({
            userid: $rootScope.userid
        }).success(function(data){
            $scope.userid = 0; 
            $rootScope.checkin_check = true;
            $scope.checkInDisabled = true;
            $scope.checkOutDisabled = false;

            var alertPopup = $ionicPopup.alert({
              title: 'Check In',
              template: 'You have successfully checked in'
          });

        }).error(function(data){
            $rootScope.showError({
                title: "INFORMATION",
                message: "Connection failed."
            });
          });  
      }

    });
  }
  //attendance check out button
  $scope.AttendOut = function() {

    var confirmPopup2 = $ionicPopup.confirm({
      title: 'Check Out',
      template: 'Confirm Check Out?'
    });

    confirmPopup2.then(function(res) {

      if(res) {
        AttendanceService.checkout({
            userid: $rootScope.userid
        }).success(function(data){
            $scope.userid = 0; 
            $scope.checkOutDisabled = true;
            $rootScope.checkOutDone = true;

            var alertPopup = $ionicPopup.alert({
              title: 'Check Out',
              template: 'You have successfully checked out'
          });

        }).error(function(data){
            $rootScope.showError({
                title: "INFORMATION",
                message: "Connection failed."
            });
          });  
      }

    })
  }

  $scope.createtask = function() {
    $state.go("app.createtask");
  }
})

//Login Controller
.controller('LoginCtrl', function($rootScope, $scope, $ionicPopup, $state, $stateParams, LoginService) {

  $scope.login={};

  $scope.login = function (){

      //validate form
      if (!$scope.login.username || !$scope.login.password) {
          $rootScope.showError({
              title: "INFORMATION",
              message: "Login failed. Check your username / password !"
          });  
          return;
      }

      $rootScope.checkin_check =  true;
      $rootScope.userid = null;

      LoginService.getData({
          username: $scope.login.username,
          password: $scope.login.password,
      }).success(function(data){

          if (data == "") {
            $rootScope.showError({
                title: "INFORMATION",
                message: "Login failed. Check your username / password."});   
 
          } else {
            // manually parse json
            $stringi = JSON.stringify(data);
            $stringi = $stringi.replace("[","");
            $stringi = $stringi.replace("]","");
            var json = JSON.parse($stringi);

            $rootScope.userid =  json.id;
            $rootScope.fullname =  json.fullname;
            $rootScope.usertypeid =  json.usertypeid;
            $rootScope.attendid = json.attendid;
            $rootScope.checkout = json.checkout;
            $rootScope.taskid = json.taskid;
            $rootScope.teamid = json.teamid;

            if ("3" == json.usertypeid ) {
              $state.go("app.employeescreen");
            }
            else if ("2" == json.usertypeid ) {
              $state.go("app.managerscreen");
            }      
            else if ("1" == json.usertypeid ) {
              $state.go("app.adminscreen");
            }  

            if ("0" == json.attendid) {
              $rootScope.checkin_check = false;
            }

            if ("0" != json.taskid) {
              $rootScope.starttask_check = true;
            }

            $scope.login.username = "";
            $scope.login.password = "";

          }

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });   

    }
})

//Create User Controller - Admin Screen
.controller('CreateNewUserCtrl', function($rootScope, $state, $scope, $ionicPopup, CreateNewUserService) {

  $scope.curdate = new Date();
  $scope.newuser={};
  $scope.hideteam = function() {
    return true;
  }
  $scope.hideteamnomgr = function() {
    return true;
  }
  // get data for drop down list
  CreateNewUserService.getUserType().success(function(data){
    $scope.usertypelist = data;
  });
  CreateNewUserService.getTeam().success(function(data){
    $scope.teamlist = data;
  });
  CreateNewUserService.getTeamNoMgr().success(function(data){
    $scope.teamnomgrlist = data;
  });

  $scope.newuser.usertype = "1";

  $scope.checkusertype = function() {

      $scope.hideteam = function() {
      if ($scope.newuser.usertype == "1") {
        return true;
      }
      else if ($scope.newuser.usertype == "3") {
        return false;
      }
      else if ($scope.newuser.usertype == "2") {
        return true;
      }
    }

      $scope.hideteamnomgr = function() {
      if ($scope.newuser.usertype == "1") {
        return true;
      }
      else if ($scope.newuser.usertype == "3") {
        return true;
      }
      else if ($scope.newuser.usertype == "2") {
        return false;
      }
    }
  }

  $scope.showAddUserConfirm = function() {

    // validate form
    if (!$scope.newuser.usertype || !$scope.newuser.username || !$scope.newuser.password || !$scope.newuser.fullname ) {
          $rootScope.showError({
              title: "INFORMATION",
              message: "Please fill all required fields !"
          });  
          return;      
    }
    
    /*if ( $scope.newuser.password != $scope.newuser.repassword ) {
          $rootScope.showError({
              title: "INFORMATION",
              message: "Password & Re-type Password must be same !"
          });  
          return;      
    }*/

   var confirmPopup = $ionicPopup.confirm({
     title: 'Add User',
     template: 'Are you sure you want to add a new user ?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      CreateNewUserService.create({
          usertype: $scope.newuser.usertype,
          username: $scope.newuser.username,
          password: $scope.newuser.password,
          fullname: $scope.newuser.fullname,
          employeeid: $scope.newuser.employeeid,
          email: $scope.newuser.email,
          phone: $scope.newuser.phone,
      }).success(function(data){
          $scope.newuser.usertype = "1";
          $scope.newuser.username = "";
          $scope.newuser.password = "";
          $scope.newuser.repassword = "";
          $scope.newuser.fullname = "";      
          $scope.newuser.employeeid = "";    
          $scope.newuser.email = "";
          $scope.newuser.phone = "";

         var alertPopup = $ionicPopup.alert({
           title: 'Add User',
           template: 'You have successfully added a new user'
         });

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  
        //manager update team lead to team table
       if ($scope.newuser.usertype == 2) {
            //console.log("mgr"); 
             CreateNewUserService.addteammem({
                username: $scope.newuser.username,
                usertype: $scope.newuser.usertype,
                id: $scope.newuser.teamnomgr,
            });
          } //employee insert into team matrix table
          else if ($scope.newuser.usertype == 3) {
            //console.log("mem");
            //console.log($scope.newuser.username);
            //console.log($scope.newuser.usertype);
            //console.log($scope.newuser.team);
             CreateNewUserService.addteammem({
              id: $scope.newuser.team,
              username: $scope.newuser.username,
              usertype: $scope.newuser.usertype,
            }).success(function(data){
              $state.go("app.adminscreen", {} , {reload: true, inherit: false, notify: true});
            });
          }

     }

   });
  };  

})

//Feedback controller
.controller('FeedbackCtrl', function($rootScope, $scope, $state, $ionicPopup, FeedbackService) {

  $scope.curdate = new Date();
  $scope.feedback={};
  $scope.feedback.rate = 5;
  $scope.goBacktoMain = function() {
    if ("3" == $rootScope.usertypeid) {
      $state.go("app.employeescreen", {} , {reload: true, inherit: false, notify: true});
    }
    else if ("2" == $rootScope.usertypeid ) {
      $state.go("app.managerscreen", {} , {reload: true, inherit: false, notify: true});
    }      
  };

  $scope.showFeedbackConfirm = function() {

    // validate form
    if (!$scope.feedback.comment || !$scope.feedback.email || !$scope.feedback.rate) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }

   var confirmPopup = $ionicPopup.confirm({
     title: 'Feedback',
     template: 'Are you sure you want to send a feedback ?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      FeedbackService.create({
          comment: $scope.feedback.comment,
          email: $scope.feedback.email,
          rate: $scope.feedback.rate, 
      }).success(function(data){
          $scope.feedback.comment = "";
          $scope.feedback.email = "";
          $scope.feedback.rate = 5;

         var alertPopup = $ionicPopup.alert({
           title: 'Send Feedback',
           template: 'You have successfully sent a feedback'
         });

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };  

})

//Create Task Controller
.controller('CreatetaskCtrl', function($rootScope, $scope, $state, $ionicPopup, CreatetaskService) {

  $scope.curdate = new Date();
  $scope.task={};
    $scope.goBacktoMain = function() {
    if ("3" == $rootScope.usertypeid) {
      $state.go("app.employeescreen", {} , {reload: true, inherit: false, notify: false});
    }
    else if ("2" == $rootScope.usertypeid ) {
      $state.go("app.managerscreen", {} , {reload: true, inherit: false, notify: true});
    }      
  };

  //get employees for drop down list
  CreatetaskService.getEmployee({
    id: $rootScope.teamid,
  }).success(function(data){
    $scope.employeelist = data;
  });

  //get job type for drop down list
  CreatetaskService.getJobType().success(function(data){
    $scope.jobtypelist = data;
  });
  //get project for drop down list
  CreatetaskService.getProject().success(function(data){
    $scope.projectlist = data;
  })

  $scope.task.assignto = "";
  $scope.task.jobtype = "1";
  $scope.task.time = "09";
  $scope.task.timemm = "00"
  $scope.task.project = "0";
  //console.log(("0" + $scope.curdate.getDay()).slice(-2));
  console.log($scope.curdate.getFullYear());
  //$scope.task.datedd = ("0" + $scope.curdate.getDay()).slice(-2);
  //$scope.task.datemm = ("0" + $scope.curdate.getMonth()).slice(-2);
  //$scope.task.dateyy = $scope.curdate.getFullYear().toString();
  $scope.task.date = $scope.curdate;
  //fill up form from selected project drop down list
  $scope.populateProject = function() {

    if ($scope.task.project != "0") {
      CreatetaskService.getProjectByID({
        id: $scope.task.project   
      }).success(function(data){

    // manually parse json
      $stringi = JSON.stringify(data);
      $stringi = $stringi.replace("[","");
      $stringi = $stringi.replace("]","");
      var json = JSON.parse($stringi);

      $scope.task.address = json.address;
      $scope.task.contact = json.contact;
      $scope.task.city = json.city;    
      });
    } else {
      $scope.task.address = "";
      $scope.task.contact = "";
      $scope.task.city = ""; 
    }
    //console.log($scope.task.project);

  }
  //create task button
  $scope.showCreateTaskConfirm = function() {

    // validate form
    if (!$scope.task.jobtype || !$scope.task.date || !$scope.task.time || !$scope.task.timemm || !$scope.task.address ||
      !$scope.task.city || !$scope.task.contact || !$scope.task.notes) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }

   var confirmPopup = $ionicPopup.confirm({
     title: 'Create a Task',
     template: 'Are you sure you want to create a task ?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      CreatetaskService.create({
          assignto: $scope.task.assignto,
          jobtype: $scope.task.jobtype,
          jobdate: $scope.task.date,
          time: $scope.task.time + ":" + $scope.task.timemm,
          projectid: $scope.task.project,
          teamid: $rootScope.teamid,
          city: $scope.task.city,
          address: $scope.task.address,
          contact: $scope.task.contact,
          notes: $scope.task.notes,
          statusid: $scope.task.assignto == "" ? "C" : "A", // Created or Assigned
      }).success(function(data){
          $scope.task.assignto = "";
          $scope.task.jobtype = "1";
          $scope.task.time = "09";
          $scope.task.timemm = "00"
          //$scope.task.datedd = ("0" + $scope.curdate.getDay()).slice(-2);
          //$scope.task.datemm = ("0" + $scope.curdate.getMonth()).slice(-2);
          //$scope.task.dateyy = $scope.curdate.getFullYear().toString();
          $scope.task.date = $scope.curdate;
          $scope.task.project = "0";
          $scope.task.city = "";
          $scope.task.address = "";
          $scope.task.contact = "";      
          $scope.task.notes = "";    

         var alertPopup = $ionicPopup.alert({
           title: 'Add User',
           template: 'You have successfully created a task'
         });
         $state.go("app.managerscreen", {} , {reload: true, inherit: false, notify: true});
      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };  

})

//Report Controller
.controller('ReportCtrl', function($rootScope, $scope, $ionicPopup, ReportService) {

    $scope.curdate = new Date();
  $scope.report={};

  //get employees
  $first_select_id = "1";
  ReportService.getEmployee({
    id: $rootScope.teamid,
  }).success(function(data){
    $scope.employeelist = data;
    $first_select_id = data[0].id; // default to first row
    $scope.report.employee = $first_select_id;
  });


  $scope.report.datefrom = new Date();
  $scope.report.dateto = new Date();


  $scope.showGenerateReportConfirm = function() {

    // validate form
    if (!$scope.report.email || !$scope.report.subject) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }

   var confirmPopup = $ionicPopup.confirm({
     title: 'Generate Report',
     template: 'Are you sure you want to generate report ?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      $dfrom = $scope.report.datefrom;
      $dto = $scope.report.dateto;

      $dfrom_m = $dfrom.getMonth() + 1;
      $dto_m = $dto.getMonth() + 1;

      $dfrom = $dfrom.getFullYear()+"-"+$dfrom_m+"-"+$dfrom.getDate();
      $dto = $dto.getFullYear()+"-"+$dto_m+"-"+$dto.getDate();

      ReportService.generateReport({
          employee: $scope.report.employee,
          datefrom: $dfrom,
          dateto: $dto,
          email: $scope.report.email,
          subject: $scope.report.subject,
      }).success(function(data){
          $scope.report.employee = $first_select_id;
          $scope.report.datefrom = new Date();;
          $scope.report.dateto = new Date();  
          $scope.report.email = "";
          $scope.report.subject = "";

         var alertPopup = $ionicPopup.alert({
           title: 'Generate Report',
           template: 'You have successfully generated a report. Check your email.'
         });

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };  


})
//PDF export Controller
.controller('ReportExpCtrl', function($rootScope, $scope, $ionicPopup, ReportService) {

    $scope.curdate = new Date();
  $scope.report={};

  // get employees
  $first_select_id = "1";
  ReportService.getEmployee({
    id: $rootScope.teamid,
  }).success(function(data){
    $scope.employeelist = data;
    $first_select_id = data[0].id; // default to first row
    $scope.report.employee = $first_select_id;
  });


  $scope.report.datefrom = new Date();
  $scope.report.dateto = new Date();

  $scope.showGenerateReportConfirm = function() {

    // validate form
    if (!$scope.report.email || !$scope.report.subject) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }

   var confirmPopup = $ionicPopup.confirm({
     title: 'Generate Report',
     template: 'Are you sure you want to generate report ?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      $dfrom = $scope.report.datefrom;
      $dto = $scope.report.dateto;

      $dfrom_m = $dfrom.getMonth() + 1;
      $dto_m = $dto.getMonth() + 1;

      $dfrom = $dfrom.getFullYear()+"-"+$dfrom_m+"-"+$dfrom.getDate();
      $dto = $dto.getFullYear()+"-"+$dto_m+"-"+$dto.getDate();

      ReportService.generateReport({
          employee: $scope.report.employee,
          datefrom: $dfrom,
          dateto: $dto,
          email: $scope.report.email,
          subject: $scope.report.subject,
      }).success(function(data){
          $scope.report.employee = $first_select_id;
          $scope.report.datefrom = new Date();;
          $scope.report.dateto = new Date();  
          $scope.report.email = "";
          $scope.report.subject = "";

         var alertPopup = $ionicPopup.alert({
           title: 'Generate Report',
           template: 'You have successfully generated a report. Check your email.'
         });

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };  


})

//Man Hours By Team Controller
.controller('ReportMHTeamCtrl', function($rootScope, $scope, $state, $stateParams, $ionicPopup, ReportService) {

  $scope.curdate = new Date();
  $scope.report={};
  var date = new Date();
  $scope.report.datefrom = new Date(date.getFullYear(), date.getMonth(), 1);
  $scope.report.dateto = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //$scope.report.datefrom = new Date();
  //$scope.report.dateto = new Date();

  $scope.GenerateRpt = function() {
    $state.go('app.reportmhteamre', {rpttitle: 'Man Hours By Team Rpt' ,datefrom: $scope.report.datefrom, dateto: $scope.report.dateto});
  } 

})

//Man Hours By Team Results Controller
.controller('ReportMHTeamReCtrl', function($rootScope, $scope, $state, $stateParams, $ionicPopup, ReportService) {

  $scope.curdate = new Date();
  $scope.report_name = $stateParams.rpttitle;
  var date1 = new Date($stateParams.datefrom);
  var date2 = new Date($stateParams.dateto);
  var fdate1 = date1.getFullYear() +'-'+ (date1.getMonth() + 1) + '-' + date1.getDate();
  var fdate2 = date2.getFullYear() +'-'+ (date2.getMonth() + 1) + '-' + date2.getDate();
  $scope.datefrom =   ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth()+1)).slice(-2) + '/' + date1.getFullYear();
  $scope.dateto =  ('0' + date2.getDate()).slice(-2) + '/' + ('0' + (date2.getMonth()+1)).slice(-2) + '/' + date2.getFullYear();


  ReportService.getManhoursByTeam({
      id: $rootScope.teamid,
      datefrom: fdate1,  
      dateto: fdate2,   
    }).success(function(data){
      $scope.reports = data;
    });  

})

//Man Hours By User Controller
.controller('ReportMHCtrl', function($rootScope, $scope,$stateParams, $state,$filter, $ionicPopup, ReportService) {

  $scope.curdate = new Date();
  $scope.report={};

  // get employees
  $first_select_id = "1";
  ReportService.getEmployee({
    id: $rootScope.teamid,
  }).success(function(data){
    $scope.employeelist = data;
    $first_select_id = data[0].id; // default to first row
    $scope.report.employee = $first_select_id;
  });


  $scope.report.filt = "None";
  var date = new Date();
  $scope.report.datefrom = new Date(date.getFullYear(), date.getMonth(), 1);
  $scope.report.dateto = new Date(date.getFullYear(), date.getMonth() + 1, 0); 

  $scope.GenerateRpt = function() {

      var found = $filter('getById')($scope.employeelist, $scope.report.employee);
      $stringi = JSON.stringify(found);
      $stringi = $stringi.replace("[","");
      $stringi = $stringi.replace("]","");
      var json = JSON.parse($stringi);
      
    $state.go('app.reportmhre', {rpttitle: 'Man Hours By User Rpt' ,datefrom: $scope.report.datefrom, dateto: $scope.report.dateto, id: $scope.report.employee, filt: $scope.report.filt, empname: json.fullname});
  } 

})

//Man Hours By User Results Controller
.controller('ReportMHReCtrl', function($rootScope, $scope, $state, $stateParams, $ionicPopup, ReportService) {

  $scope.curdate = new Date();
  $scope.report_name = $stateParams.rpttitle;
  var date1 = new Date($stateParams.datefrom);
  var date2 = new Date($stateParams.dateto);
  var fdate1 = date1.getFullYear() +'-'+ (date1.getMonth() + 1) + '-' + date1.getDate();
  var fdate2 = date2.getFullYear() +'-'+ (date2.getMonth() + 1) + '-' + date2.getDate();
  $scope.datefrom =   ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth()+1)).slice(-2) + '/' + date1.getFullYear();
  $scope.dateto =  ('0' + date2.getDate()).slice(-2) + '/' + ('0' + (date2.getMonth()+1)).slice(-2) + '/' + date2.getFullYear();
  $scope.filter=$stateParams.filt;
  $scope.fullname = $stateParams.empname;

  ReportService.getManhoursByUser({
      id: $stateParams.id,
      datefrom: fdate1,  
      dateto: fdate2,
      filter: $stateParams.filt,
    }).success(function(data){
      $scope.reports = data;
    });  

})

//Man Hours By Day Controller
.controller('ReportMHDayCtrl', function($rootScope, $scope,$stateParams, $state,$filter, $ionicPopup, ReportService) {

  $scope.curdate = new Date();
  $scope.report={};

    // get employees
  $first_select_id = "1";
  ReportService.getEmployee({
    id: $rootScope.teamid,
  }).success(function(data){
    $scope.employeelist = data;
    $first_select_id = data[0].id; // default to first row
    $scope.report.employee = $first_select_id;
  });

  var date = new Date();
  $scope.report.datefrom = new Date(date.getFullYear(), date.getMonth(), 1);
  $scope.report.dateto = new Date(date.getFullYear(), date.getMonth() + 1, 0); 

  $scope.GenerateRpt = function() {

      var found = $filter('getById')($scope.employeelist, $scope.report.employee);
      $stringi = JSON.stringify(found);
      $stringi = $stringi.replace("[","");
      $stringi = $stringi.replace("]","");
      var json = JSON.parse($stringi);
      
    $state.go('app.reportmhdayre', {rpttitle: 'Man Hours By Days Rpt' ,datefrom: $scope.report.datefrom, dateto: $scope.report.dateto, id: $scope.report.employee, empname: json.fullname});
  } 

})

//Man Hours By Day Result Controller
.controller('ReportMHDayReCtrl', function($rootScope, $scope, $state, $stateParams, $ionicPopup, ReportService) {

  $scope.curdate = new Date();
  $scope.report_name = $stateParams.rpttitle;
  var date1 = new Date($stateParams.datefrom);
  var date2 = new Date($stateParams.dateto);
  var fdate1 = date1.getFullYear() +'-'+ (date1.getMonth() + 1) + '-' + date1.getDate();
  var fdate2 = date2.getFullYear() +'-'+ (date2.getMonth() + 1) + '-' + date2.getDate();
  $scope.datefrom =   ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth()+1)).slice(-2) + '/' + date1.getFullYear();
  $scope.dateto =  ('0' + date2.getDate()).slice(-2) + '/' + ('0' + (date2.getMonth()+1)).slice(-2) + '/' + date2.getFullYear();
  $scope.fullname = $stateParams.empname;
  console.log(fdate1 + ' ' + fdate2 +' '+ $stateParams.id);

  ReportService.getManhoursByDay({
      id: $stateParams.id,
      datefrom: fdate1,  
      dateto: fdate2,
    }).success(function(data){
      $scope.reports = data;
    });  

})

//Create Job Type Controller
.controller('JobtypeCtrl', function($rootScope, $scope, $ionicPopup, JobtypeService) {

    $scope.curdate = new Date();
  $scope.jobtype={};

  $scope.showJobtypeConfirm = function() {

    // validate form
    if (!$scope.jobtype.type ) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }
        
   var confirmPopup = $ionicPopup.confirm({
     title: 'Job Type',
     template: 'Are you sure you want to add new job type ?'
   });
   confirmPopup.then(function(res) {
     if(res) {
      JobtypeService.create({
          type: $scope.jobtype.type,
      }).success(function(data){
          $scope.jobtype.type = "";

         var alertPopup = $ionicPopup.alert({
           title: 'Job Type',
           template: 'You have successfully added a job type.'
         });

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };  

})

//Create New Team Controller
.controller('NewteamCtrl', function($rootScope, $scope, $ionicPopup, CreateTeamService) {

  $scope.curdate = new Date();
  $scope.jobtype={};

  $scope.showJobtypeConfirm = function() {

    // validate form
    if (!$scope.jobtype.type ) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }
        
   var confirmPopup = $ionicPopup.confirm({
     title: 'Create Team',
     template: 'Are you sure you want to add a new team ?'
   });
   confirmPopup.then(function(res) {
     if(res) {
      CreateTeamService.create({
          teamname: $scope.jobtype.type,
      }).success(function(data){
          $scope.jobtype.type = "";

         var alertPopup = $ionicPopup.alert({
           title: 'Create Team',
           template: 'You have successfully created a new team.'
         });

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };  

})

//Assign Task Controller
.controller('AssignTaskCtrl', function($rootScope, $scope, $ionicPopup, $state, $stateParams, AssignTaskService) {

    $scope.curdate = new Date();
  $scope.task={};

  // get employees
  $first_select_id = "1";
  AssignTaskService.getEmployee({
    id: $rootScope.teamid,
  }).success(function(data){
    $scope.employeelist = data;
    $first_select_id = data[0].id; // default to first row
    $scope.task.assignto = $first_select_id;
  });

//alert($stateParams.taskId);
  AssignTaskService.getTask({
    id: $stateParams.taskId,    
  }).success(function(data){

    // manually parse json
    $stringi = JSON.stringify(data);
    $stringi = $stringi.replace("[","");
    $stringi = $stringi.replace("]","");
    var json = JSON.parse($stringi);

    $scope.id = json.id;
    $scope.type = json.type;
    $scope.city_or_user = json.status_id == "C" ? json.city : json.fullname;
    $scope.status = json.status;
    $scope.time = json.time;
    $scope.address = json.address;
    $scope.contact = json.contact;
    $scope.city = json.city;
    $scope.notes = json.notes;
    $scope.hideproject = function(){
      if (json.projectid == 0) {
        return true;
      }
      else {
        return false;
      }
    }
    console.log(json.taskdate);
    $scope.projectname = json.projectname;
    $scope.projectdesc = json.projectdesc;
    $scope.taskdate = json.taskdate;
 
  });

  //Assign Task button
  $scope.showAssignTaskConfirm = function() {

    // validate form
    if (!$scope.task.assignto ) {
        $rootScope.showError({
            title: "INFORMATION",
            message: "Please fill all required fields !"
        });  
        return;
    }

    //console.log($stateParams.taskId);
    //console.log($scope.task.assignto);

   var confirmPopup = $ionicPopup.confirm({
     title: 'Assign Task',
     template: 'Are you sure you want to assign the task ?'
   });
   confirmPopup.then(function(res) {
     if(res) {

      AssignTaskService.assign({
        id: $stateParams.taskId,
        assignto: $scope.task.assignto,
        statusid: 'A',
      }).success(function(data){
          $scope.task.assignto = $first_select_id;
 
         var alertPopup = $ionicPopup.alert({
           title: 'Assign Task',
           template: 'You have successfully assigned the task'
         });

         $state.go("app.managerscreen", {reload: true});

      }).error(function(data){
          $rootScope.showError({
              title: "INFORMATION",
              message: "Connection failed."
          });
      });  

     } 

   });
  };    

})

//Timesheet Controller
.controller('TimesheetCtrl', function($rootScope, $scope, $ionicPopup, $state, $stateParams, TimesheetService) {

    $scope.curdate = new Date();
  $scope.timesheet={};
  $scope.timesheet.show = "D"; // Default to Daily  
  $scope.goBacktoMain = function() {
    if ("3" == $rootScope.usertypeid) {
      $state.go("app.employeescreen", {} , {reload: true, inherit: false, notify: true});
    }
    else if ("2" == $rootScope.usertypeid ) {
      $state.go("app.managerscreen", {} , {reload: true, inherit: false, notify: true});
    }      
  };


  $scope.showTimesheet = function() {

    $today = new Date();
    $today_m = $today.getMonth() + 1;
    $today_date = $today.getFullYear()+"-"+$today_m+"-"+$today.getDate();  
    $state.go("app.timesheetdetail", { show: $scope.timesheet.show, time: $today_date });

  };    
 
})

//Timesheet Detail Controller
.controller('TimesheetDetailCtrl', function($rootScope, $scope, $ionicPopup, $state, $stateParams, TimesheetService) {

  $scope.curdate = new Date(); 
  //console.log(getDateOfWeek(45,2015); 
  $scope.navtime = $stateParams.time;
  if ("D" == $stateParams.show ) {
    $scope.showType = "Daily";
    $scope.show = "D";
    $headertime_t = new Date($scope.navtime);
    $scope.headertime = $headertime_t;
    //$scope.headertime = $headertime_t.getFullYear()+"-"+($headertime_t.getMonth()+1)+"-"+$headertime_t.getDate();
  }
  else if ("W" == $stateParams.show ) {
    $scope.showType = "Weekly";
    $scope.show = "W";
    $headertime_t = new Date($scope.navtime);
    $scope.headertime = getWeekOfTheyear($headertime_t);
     
  }
  else if ("M" == $stateParams.show ) {
    $scope.showType = "Monthly";
    $scope.show = "M";
    $headertime_t = new Date($scope.navtime);
    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    $scope.headertime = monthNames[($headertime_t.getMonth())] + " " + $headertime_t.getFullYear();
  }
   
  // is user type is employee ?
  if ( "3" == $rootScope.usertypeid) {
    TimesheetService.getDetailByUser({
      show: $stateParams.show,  
      time: $stateParams.time,    
      employee: 3,  
    }).success(function(data){
      $scope.timesheets = data;
    });
  }
  else {
    TimesheetService.getDetail({
      show: $stateParams.show,  
      time: $stateParams.time,    
      teamid: $rootScope.teamid,
    }).success(function(data){
      $scope.timesheets = data;
    });  
  }
  
  $scope.showTimesheetPrev = function(show, time) {
    $today = new Date(time);
    if ("D" == $stateParams.show ) {
      $today = dayBefore($today);
    }
    else if ("W" == $stateParams.show ) {
      $today = weekBefore($today);
    }
    else if ("M" == $stateParams.show ) {
      $today = monthBefore($today);
    }
    $today_m = $today.getMonth() + 1;
    $today_date = $today.getFullYear()+"-"+$today_m+"-"+$today.getDate();  
    $state.go("app.timesheetdetail", { show: show, time: $today_date });
  };   

  $scope.showTimesheetNext = function(show, time) {
    $today = new Date(time);
    if ("D" == $stateParams.show ) {
      $today = dayAfter($today);
    }
    else if ("W" == $stateParams.show ) {
      $today = weekAfter($today);
    }
    else if ("M" == $stateParams.show ) {
      $today = monthAfter($today);
    }
    $today_m = $today.getMonth() + 1;
    $today_date = $today.getFullYear()+"-"+$today_m+"-"+$today.getDate();  
    $state.go("app.timesheetdetail", { show: show, time: $today_date });
  };     

  //functions to get before/after dates
  function dayBefore(d) {
    var nd = new Date(d.getTime());
    nd.setDate(d.getDate() - 1);
    return nd;
  }

  function dayAfter(d) {
    var nd = new Date(d.getTime());
    nd.setDate(d.getDate() + 1);
    return nd;
  }

  function weekBefore(d) {
    var nd = new Date(d.getTime());
    nd.setDate(d.getDate() - 7);
    return nd;
  }  

  function weekAfter(d) {
    var nd = new Date(d.getTime());
    nd.setDate(d.getDate() + 7);
    return nd;
  }    

  function monthAfter(d) {
    var nd = new Date(d.getTime());
    nd.setMonth(d.getMonth() + 1);
    return nd;
  }

  function monthBefore(d) {
    var nd = new Date(d.getTime());
    nd.setMonth(d.getMonth() - 1);
    return nd;
  }  
  //get week of the year
  function getWeekOfTheyear(d) {
    var nd = new Date(d.getTime());
    onejan = new Date(nd.getFullYear(), 0, 1);
    return "Week " + Math.floor( (((nd - onejan) / 86400000) + onejan.getDay() + 1) / 7 ) + " of " + nd.getFullYear();
  }

  function weeksToDate(y,w,d) {
    var days = 2 + d + (w - 1) * 7 - (new Date(y,0,1)).getDay();
    return new Date(y, 0, days);
  }

})
//function to get array from drop down list
.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
})
.filter('numberFixedLen', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
})
//running stop watch
.constant('SW_DELAY', 1000)
.factory('stepwatch', function (SW_DELAY, $timeout) {
  var data = {
      seconds: 0,
      minutes: 0,
      hours: 0
  },
  stopwatch = null;

  var start = function () {
      stopwatch = $timeout(function () {
          data.seconds++;
          if (data.seconds >= 60) {
              data.seconds = 00;
              data.minutes++;
              if (data.minutes >= 60) {
                  data.minutes = 0;
                  data.hours++;
              }
          }
          start();
      }, SW_DELAY);
  };

  var stop = function () {
      $timeout.cancel(stopwatch);
      stopwatch = null;
  };

  var reset = function () {
      stop()
      data.seconds = 0,
      data.minutes = 0,
      data.hours = 0
  };
  return {
      data: data,
      start: start,
      stop: stop,
      reset: reset
  };

})

;
