angular.module('hhs-ionic').controller('RegisterController', RegisterController);

RegisterController.$inject = ['$state', '$timeout', 'RegisterService', 'ValidatorService'];

function RegisterController($state, $timeout, RegisterService, ValidatorService) {
  var vm = this;
  vm.errorMessage = null;
  vm.message = null;
  vm.registerData = {};
  vm.validationResults = {};

  vm.register = function () {
    vm.validationResults = ValidatorService.validateForm(['email', 'password', 'confirm'], vm.registerData);

    if (angular.equals({}, vm.validationResults)) {
      RegisterService.register(vm.registerData)
        .then(function (res) {
          if (res.status === 201) {
            vm.errorMessage = null;
            vm.message = res.data.message;

            $timeout(function () {
              $state.go('login');
            }, 2000);
          } else {
            vm.errorMessage = res.data.message;
          }
        })
        .catch(function (err) {
          vm.errorMessage = err;
          console.log(err);
        });
    }
  };
};
