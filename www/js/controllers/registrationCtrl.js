angular.module('app.controllers')

/*
Source: http://codepen.io/niyando/pen/GpEeQR
*/
.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-positive');
        if (newVal === scope.value) {
          element.addClass('button-positive');
        }
      });
    }
  };
})

.controller('registrationCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPopup, Patient, Medication) {
  $scope.user  = {};
  $scope.user.email = $stateParams.email;
  $scope.user.password = $stateParams.password;
  $scope.state = {loading: false}
  $scope.register = function()   {
    $scope.state.loading = true;

    Patient.auth().$createUser($scope.user).then(function(authData) { //Create User
      //console.log(authData)
      Patient.auth().$authWithPassword($scope.user).then(function(authData) { //Then Log in
        $scope.state.loading = false;

        Patient.set(authData); //this will also set the Token

        var ref = Patient.ref().child('profile');
        ref.set({email: $scope.user.email})

        //TODO: much later, delete this.
        Medication.setDefaultMeds(); // Setting default meds/instructions for patient once they register

        //Use UPDATE, to NOT OVERWRITE email address!
        var req = ref.update($scope.user) //Setting Patient Information.
        req.then(function(ref) {
          $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true,
          })

          $state.go("intro.welcome");
        })

      }).catch(function(error) {
        handleError(error)
      })

    }).catch(function(error) {
      handleError(error)
    })
  }

  var handleError = function(error) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error
    });
    $scope.state.loading = false;
  }

})
