angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'timer'])

.run(function($ionicPlatform, $rootScope, $ionicPopup, $state, $ionicHistory, TaskService, stepwatch) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // ============================= backend url ============================= //

  $rootScope.backend_url = 'http://localhost/collexe/';

  // ======================================================================= //

  // back to previous view
  $rootScope.goBack = function() {
    $ionicHistory.goBack();
  };

  // check out dialog
  $rootScope.showCheckoutConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Check Out',
     template: 'Are you sure you want to check out ?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       var alertPopup = $ionicPopup.alert({
         title: 'Check Out',
         template: 'You have successfully checked out'
       });
       $rootScope.checkin_check = false;
     }
   });
  };

 // check in popup
 $rootScope.showCheckinAlert = function() {
   $rootScope.checkin_check = true;  
   var alertPopup = $ionicPopup.alert({
     title: 'Check In',
     template: 'You have successfully checked in.'
   });
 };

  $rootScope.showError = function(msg) {
    $ionicPopup.alert({
        title: msg.title,
        template: msg.message,
        okText: 'Ok',
        okType: 'button-assertive'
    });
  };
  $rootScope.showSuccess = function(msg) {
    $ionicPopup.alert({
        title: msg.title,
        template: msg.message,
        okText: 'Ok',
        okType: 'button-balanced'
    });
  };   

  $rootScope.taskMore = function(id, task_status_id) {
    if ("A" == task_status_id) {
      $state.go("app.task",{taskId:id}); 
      $rootScope.isAssigned = true;
    }
    else if ("S" == task_status_id) {

       TaskService.getStartDate({
          id: id,
      }).success(function(data){

        $stringi = JSON.stringify(data);
        $stringi = $stringi.replace("[","");
        $stringi = $stringi.replace("]","");
        var json = JSON.parse($stringi);

        var dateString = json.timestamp_start;
        var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec(dateString); 
        $dateObject = new Date(
            (+dateArray[1]),
            (+dateArray[2])-1, // Careful, month starts at 0!
            (+dateArray[3]),
            (+dateArray[4]),
            (+dateArray[5]),
            (+dateArray[6])
        );

        $today = new Date();   

        var diff = ($today - $dateObject)/1000;
        var diff = Math.abs(Math.floor(diff));
        var days = Math.floor(diff/(24*60*60));
        var leftSec = diff - days * 24*60*60;
        var hrs = Math.floor(leftSec/(60*60));
        var leftSec = leftSec - hrs * 60*60;
        var min = Math.floor(leftSec/(60));
        var leftSec = leftSec - min * 60;        

        // replace days to hours + hours  
        hrs = hrs + (days * 24);

        stepwatch.data.hours = hrs;
        stepwatch.data.minutes = min;
        stepwatch.data.seconds = leftSec;
      }); 
      
      $state.go("app.taskactive",{taskId:id}); 
    }   
    else if ("P" == task_status_id) {
      $state.go("app.task",{taskId:id}); 
    }  
    else if ("F" == task_status_id) {
      $state.go("app.task",{taskId:id}); 
    }           
 }; 

 $rootScope.assignTask = function(id) {
    $state.go("app.assigntask",{taskId:id}); 
 };  

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    .state('app.employeescreen', {
      cache: false,
      url: '/employeescreen',
      views: {
        'menuContent': {
          templateUrl: 'templates/employeescreen.html',
          controller: 'EmployeeScreenCtrl'
        }
      }
    })

    .state('app.managerscreen', {
      cache: false,
      url: '/managerscreen',
      views: {
        'menuContent': {
          templateUrl: 'templates/managerscreen.html',
          controller: 'ManagerScreenCtrl'
        }
      }
    })

    .state('app.createtask', {
    url: "/createtask",
    views: {
      'menuContent': {
        templateUrl: "templates/createtask.html",
        controller: 'CreatetaskCtrl'
      }
    }
  })

  .state('app.report', {
    cache: false,
    url: "/report",
    views: {
      'menuContent': {
        templateUrl: "templates/report.html",
        controller: 'ReportExpCtrl'
      }
    }
  })

    .state('app.reporttype', {
    cache: false,
    url: "/reporttype",
    views: {
      'menuContent': {
        templateUrl: "templates/reporttype.html",
        controller: 'ReportCtrl'
      }
    }
  })

  .state('app.reportmh', {
    cache: false,
    url: "/reportmh",
    views: {
      'menuContent': {
        templateUrl: "templates/reportmh.html",
        controller: 'ReportMHCtrl'
      }
    }
  })

  .state('app.reportmhday', {
    cache: false,
    url: "/reportmhday",
    views: {
      'menuContent': {
        templateUrl: "templates/reportmhday.html",
        controller: 'ReportMHDayCtrl'
      }
    }
  })

  .state('app.reportmhteam', {
    cache: false,
    url: "/reportmhteam",
    views: {
      'menuContent': {
        templateUrl: "templates/reportmhteam.html",
        controller: 'ReportMHTeamCtrl'
      }
    }
  })

  .state('app.reportmhre', {
    cache: false,
    url: "/reportmhre?rpttitle&datefrom&dateto&id&filt&empname",
    views: {
      'menuContent': {
        templateUrl: "templates/reportmhre.html",
        controller: 'ReportMHReCtrl'
      }
    }
  })

  .state('app.reportmhdayre', {
    cache: false,
    url: "/reportmhdayre?rpttitle&datefrom&dateto&id&filt&empname",
    views: {
      'menuContent': {
        templateUrl: "templates/reportmhdayre.html",
        controller: 'ReportMHDayReCtrl'
      }
    }
  })

  .state('app.reportmhteamre', {
    cache: false,
    url: "/reportmhteamre?rpttitle&datefrom&dateto&id&filt&empname",
    views: {
      'menuContent': {
        templateUrl: "templates/reportmhteamre.html",
        controller: 'ReportMHTeamReCtrl'
      }
    }
  })

  .state('app.taskactive', {
    url: "/taskactive/:taskId",
    views: {
      'menuContent': {
        templateUrl: "templates/taskactive.html",
        controller: 'TaskCtrl'
      }
    }
  })

  .state('app.taskpause', {
    cache: false,
    url: "/taskpause/:taskId",
    views: {
      'menuContent': {
        templateUrl: "templates/taskpause.html",
        controller: 'TaskCtrl'
      }
    }
  })

  .state('app.adminscreen', {
    cache: false,
    url: "/adminscreen",
    views: {
      'menuContent': {
        templateUrl: "templates/adminscreen.html",
      }
    }
  })

  .state('app.createnewuser', {
    url: "/createnewuser",
    views: {
      'menuContent': {
        templateUrl: "templates/createnewuser.html",
        controller: 'CreateNewUserCtrl'
      }
    }
  })
                
  .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent': {
        templateUrl: "templates/feedback.html",
        controller: 'FeedbackCtrl'
      }
    }
  })

  .state('app.task', {
    cache: false,
    url: '/task/:taskId',
    views: {
      'menuContent': {
        templateUrl: 'templates/task.html',
        controller: 'TaskCtrl'
      }
    }
  })

  .state('app.assigntask', {
    cache: false,
    url: '/assigntask/:taskId',
    views: {
      'menuContent': {
        templateUrl: 'templates/assigntask.html',
        controller: 'AssignTaskCtrl'
      }
    }
  })

  .state('app.timesheet', {
    cache: false,
    url: '/timesheet',
    views: {
      'menuContent': {
        templateUrl: 'templates/timesheet.html',
        controller: 'TimesheetCtrl'
      }
    }
  })

  .state('app.timesheetdetail', {
    cache: false,
    url: '/timesheetdetail/:show/:time',
    views: {
      'menuContent': {
        templateUrl: 'templates/timesheetdetail.html',
        controller: 'TimesheetDetailCtrl'
      }
    }
  })  

  .state('app.jobtype', {
    url: '/jobtype',
    views: {
      'menuContent': {
        templateUrl: 'templates/jobtype.html',
        controller: 'JobtypeCtrl'
      }
    }
  })

  .state('app.newteam', {
    url: '/newteam',
    views: {
      'menuContent': {
        templateUrl: 'templates/newteam.html',
        controller: 'NewteamCtrl'
      }
    }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
  
});
