angular.module('hhs-ionic').controller('ExpenseController', ExpenseController);

ExpenseController.$inject = ['$state', '$timeout', '$window', 'ExpenseService', 'ValidatorService', '$ionicPopup'];

function ExpenseController($state, $timeout, $window, ExpenseService, ValidatorService, $ionicPopup) {
  var vm = this;
  vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
  vm.errorMessage = null;
  vm.validationResults = {};
  vm.expenseData = {};
  vm.categories = [];
  vm.editMode = $state.params.id ? true : false;
  vm.pageTitle = 'Add Expense';

  function init() {
    ExpenseService.getCategories(vm.user.id)
      .then(function (res) {
        vm.categories = res.data;
      });

    if($state.params.id) {
      vm.pageTitle = 'Edit Expense';

      ExpenseService.getExpense($state.params.id)
        .then(function (res) {
          if(res.status === 200) {
            vm.expenseData.categoryId = res.data.categoryId;
            vm.expenseData.vendor = res.data.vendor;
            vm.expenseData.amount = res.data.amount;
            vm.expenseData.expenseDate = new Date(res.data.expenseDate);
            vm.expenseData.description = res.data.description;
          }
          console.log(res);
          // if(res.sta)
        });
    }
  }

  init();

  vm.sendExpense = function () {
    vm.validationResults = ValidatorService.validateForm(['categoryId', 'amount', 'expenseDate'], vm.expenseData);

    if(vm.editMode) {
      $ionicPopup.confirm({
        title: 'Edit expense',
        template: 'Aure you sure to edit this expense?'
      }).then(function (res) {
        if(res){
          ExpenseService.edit($state.params.id,vm.expenseData).then(function (res) {
            if (res.status === 204) {
              $state.go('dashboard');
            }
          });
        }
      })
    } else {
      if (angular.equals({}, vm.validationResults)) {
        vm.expenseData.userId = vm.user.id;
        ExpenseService.add(vm.expenseData).then(function (res) {
          if (res.status === 201) {
            $state.go('dashboard');
          }
        });
      }
    }
  };
}
