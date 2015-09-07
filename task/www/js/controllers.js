angular.module('starter.controllers', []) 

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { task: 'Inspection', title: 'Inti College Subang', id: 1 },
    { task: 'Repair', title: 'Taylor\'s Lakeside University', id: 2 },
    { task: 'Maintenance', title: 'Sri KL HS', id: 3 },
  ];
})

.controller('ListCtrl', function($scope) {
   $scope.swipeLeft = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Attendance',
     template: 'Are you sure you want to check out?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };
})

.controller('PlaylistCtrl', function($scope, $stateParams, $state) {
    $scope.changeState = function(page) {
    $state.go(page);
  }
});

