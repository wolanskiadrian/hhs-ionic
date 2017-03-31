angular.module('hhs-ionic').controller('ForgotController', ForgotController);

ForgotController.$inject = ['ForgotService', 'ValidatorService'];

function ForgotController(ForgotService, ValidatorService) {
  var vm = this;
  vm.errorMessage = null;
  vm.message = null;
  vm.forgotData = {};
  vm.validationResults = {};

  vm.forgot = function () {
    vm.validationResults = ValidatorService.validateForm(['email'], vm.forgotData);

    if(angular.equals({}, vm.validationResults)) {
      ForgotService.forgot(vm.forgotData.email)
        .then(function (res) {
          if (res.status === 200) {
            vm.message = res.data.message;
          } else {
            vm.errorMessage = res.data;
          }
        })
    }
  }
}
