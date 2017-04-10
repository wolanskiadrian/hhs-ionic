angular.module('hhs-ionic').controller('ExpenseController', ExpenseController);

ExpenseController.$inject = ['$state', '$timeout', '$window', 'ExpenseService', 'ValidatorService', '$ionicPopup', '$scope', '$ionicModal'];

function ExpenseController($state, $timeout, $window, ExpenseService, ValidatorService, $ionicPopup, $scope, $ionicModal) {
  var vm = this;
  vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
  vm.errorMessage = null;
  vm.validationResults = {};
  vm.expenseData = {};
  vm.categories = [];
  vm.editMode = $state.params.id ? true : false;
  vm.pageTitle = 'Add Expense';
  vm.categoryName = '';

  function getCategoryName(id) {
    return _.find(vm.categories, {'_id': id}).name;
  }

  function init() {
    ExpenseService.getCategories(vm.user.id)
      .then(function (res) {
        vm.categories = res.data;
      });

    if($state.params.id) {
      ExpenseService.getExpense($state.params.id)
        .then(function (res) {
          if(res.status === 200) {
            vm.expenseData.categoryId = res.data.categoryId;
            vm.expenseData.vendor = res.data.vendor;
            vm.expenseData.amount = res.data.amount;
            vm.expenseData.expenseDate = new Date(res.data.expenseDate);
            vm.expenseData.description = res.data.description;

            vm.categoryName = getCategoryName(res.data.categoryId);
          }
        });

      if($state.current.name === 'expense-edit') {
        vm.pageTitle = 'Edit Expense';
      } else if($state.current.name === 'expense-details') {
        vm.pageTitle = 'Expense Details';
      }
    }
  }

  init();

  $ionicModal.fromTemplateUrl('js/shared/popup-templates/categories.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });


  vm.showCategoriesPopup = function () {
    $scope.categories = vm.categories;

    $scope.modal.show();
  };

  $scope.setCategory = function (item) {
    vm.expenseData.categoryId = item._id;
    vm.categoryName = item.name;

    $scope.modal.hide();
  };

  $scope.closeModal = function () {
    init();
    $scope.modal.hide();
  };

  vm.backToDashboard = function () {
    $state.go('tab.dashboard');
  };

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
              $state.go('tab.dashboard');
            }
          });
        }
      })
    } else {
      if (angular.equals({}, vm.validationResults)) {
        vm.expenseData.userId = vm.user.id;
        ExpenseService.add(vm.expenseData).then(function (res) {
          if (res.status === 201) {
            $state.go('tab.dashboard');
          }
        });
      }
    }
  };
}
