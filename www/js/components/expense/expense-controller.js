angular.module('hhs-ionic').controller('ExpenseController', ExpenseController);

ExpenseController.$inject = ['$state', '$timeout', '$window', 'ExpenseService', 'ValidatorService'];

function ExpenseController($state, $timeout, $window, ExpenseService, ValidatorService) {
  var vm = this;
  vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
  vm.errorMessage = null;
  vm.validationResults = {};
  vm.expenseData = {};
  vm.categories = [];



  function init() {
    ExpenseService.getCategories(vm.user.id)
      .then(function (res) {
        vm.categories = res.data;
      });
  }

  init();

  vm.addExpense = function () {
    vm.validationResults = ValidatorService.validateForm(['categoryId', 'amount', 'expenseDate'], vm.expenseData);

    if (angular.equals({}, vm.validationResults)) {
      vm.expenseData.userId = vm.user.id;
      ExpenseService.add(vm.expenseData).then(function (res) {
        if(res.status === 201) {
          $state.go('dashboard');
        }
      });
    }
  };
}
