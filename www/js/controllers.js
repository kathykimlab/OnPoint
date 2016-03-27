angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {
})

.controller('timelineCtrl', function($scope, Card, Comment, CARD) {
  $scope.cards = Card.get();
  $scope.CARD = CARD;

  $scope.getTime = function(timestamp) {
    return new Date(timestamp);
  };

  $scope.getCommentsCount = function(card_id){
    return Comment.get_comments_count_by_id(card_id);
  }

})

.controller('measurementsCtrl', function($scope, Measurement) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
  $scope.measurements = Measurement.get();
})

.controller('addMeasurementsCtrl', function($scope, $state, Measurement, $ionicPopup, $ionicHistory) {
  $scope.newMeasurement = {};
  $scope.newMeasurement.bpcolor = 'black';

  $scope.addMeasurement = function() {
    Measurement.add($scope.newMeasurement);
    $state.go('tabsController.measurements');
  };

  $scope.disableDone = function() {
    if ($scope.newMeasurement.weight!=null || $scope.newMeasurement.heartRate!=null || $scope.newMeasurement.systolic!=null || $scope.newMeasurement.diastolic!=null)
      return false;
    else
      return true;
  };

  $scope.checkBP = function() {
    if (Measurement.hasHighBP($scope.newMeasurement)) {
      $scope.newMeasurement.bpcolor = 'red';
      $scope.bpAlert('Blood Pressure High');
    }
  };

$scope.bpAlert = function(value) {
  $scope.data = {};

  var myPopup = $ionicPopup.show({
    title: value,
    subTitle: 'Try taking another measurement in one minute. To ensure a good reading, please follow the tips.',
    scope: $scope,
    buttons: [
      {
        text: 'View Tips',
        onTap: function(e) { $state.go('tabsController.measurementTips'); }
      },
      {text: '<b>OK</b>'}
    ]
  });
 };
})

.controller('measurementTipsCtrl', function($scope, MeasurementTips) {
  // We inject the Measurement Tips factory so that we view tips
  $scope.measurementsTips = MeasurementTips.get();
})

.controller('appointmentCtrl', function($scope) {
})

.controller('goalsCtrl', function($scope, Goal) {
  // TODO use enums for personal/clinical here
  $scope.goals = Goal.get(),

  // See https://github.com/angular/angular.js/wiki/Understanding-Scopes
  // on why we're creating an Object here rather than assigning
  // a scope variable to a primitive boolean.
  $scope.visible = {personal: false, clinical: false}

  $scope.addGoal = function(goal) {
    Goal.add(goal);
  }
})

.controller('appointmentsCtrl', function($scope, $location, $state, Appointment) {

  var appointmentRecord = Appointment.get();
  $scope.eventDates = []

  // TODO: Shouldn't this be moved into a convenience method of Appointment factory?
  for(var i = 0; i < appointmentRecord.length; i++){
    var oneEventDay = new Date(appointmentRecord[i].timestamp);
    $scope.eventDates.push(oneEventDay.getDate());
  }

  $scope.hasAppointment = function(day) {
    return ($scope.eventDates.indexOf(parseInt(day)) !== -1);
  }

  $scope.transitionToAppointment = function(day){
    var index = $scope.eventDates.indexOf(parseInt(day)).toString();
    if(index > -1)
      $state.go('tabsController.appointment', {appointmentId: index});
  }

  // TODO: This is way too verbose and should be moved into Appointment factory.
  var oDate = new Date();
  $scope.curDate = oDate;
  $scope.today = oDate.getDate();

  var firstDate = new Date();
  firstDate.setDate(1);
  var totalDays = new Date(oDate.getFullYear(),       oDate.getMonth() + 1, 0).getDate();
  $scope.weeks = [];

  var numWeeks = totalDays/7;
  var day = 1;
  for(var i = 0; i < numWeeks; i++){
    $scope.weeks[i] = [];
    for(var j = 0; j < 7; j++){
       if(i == 0 && j < firstDate.getDay()){
          $scope.weeks[i].push("");
       }else{
          if(day <= totalDays){
              $scope.weeks[i].push(day.toString());
          }else{
              $scope.weeks[i].push("");
          }
          day++;
       }
    }
  }
})

.controller('appointmentCtrl', function($scope,$stateParams, Appointment) {
  var appointmentRecord = Appointment.get();
  $scope.appointment = appointmentRecord[parseInt($stateParams.appointmentId)];
})

.controller('goalsCtrl', function($scope, Goal) {
  // We inject the Goal factory so that we can query for the personal
  // goals associated with the user.
  $scope.personal_goals = Goal.get();
})

.controller('addGoalCtrl', function($scope) {

})

.controller('symptomsSliderCtrl', function($scope) {

})

.controller('symptomsListCtrl', function($scope) {

})

.controller('symptomsListMultipleCtrl', function($scope) {

})
