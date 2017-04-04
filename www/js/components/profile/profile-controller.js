angular.module('hhs-ionic').controller('ProfileController', ProfileController);

ProfileController.$inject = ['$scope', '$state', '$window', '$timeout', 'ProfileService', 'ValidatorService', '$ionicModal', '$ionicPopup'];

function ProfileController($scope, $state, $window, $timeout, ProfileService, ValidatorService, $ionicModal, $ionicPopup) {
  var vm = this;
  vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
  vm.message = null;
  vm.errorMessage = null;
  vm.userCategories = [];
  vm.validationResults = {};
  vm.profileData = {};

  function init() {
    ProfileService.getUserCategories(vm.user.id)
      .then(function (res) {
        if (res.status === 200) {
          vm.userCategories = res.data;
          $scope.categories = vm.userCategories;
        }
      });
  };

  init();

  vm.passwordChange = function () {
    vm.validationResults = ValidatorService.validateForm(['password', 'confirm'], vm.profileData);

    if (angular.equals({}, vm.validationResults)) {
      ProfileService.changePassword(vm.profileData.password, vm.user.id)
        .then(function (res) {
          if (res.status === 200) {
            vm.message = res.data.message;
            $timeout(function () {
              vm.message = null;
            }, 2000);
          } else {
            vm.errorMessage = res.data;
          }
        });
    }
  };

  $ionicModal.fromTemplateUrl('js/shared/popup-templates/categories-manage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });

  vm.manageCategories = function () {
    $scope.showDelete = false;
    $scope.modal.show();
  };

  $scope.closeModal = function () {
    $scope.modal.hide();
    init();
  };

  $scope.deleteUserCatetory = function (item, $index) {
    console.log(item);
    $ionicPopup.confirm({
      title: 'Remove category',
      template: 'Are you sure to delete this category?'
    }).then(function (res) {
      if (res) {
        ProfileService.deleteCategory(item._id)
          .then(function (res) {
            if (res.status === 204) {
              $scope.categories.splice($index, 1);
            }
          });
      }
    })
  };

  $scope.addCategory = function () {
    $scope.newCategory = {};

    $ionicPopup.show({
      template: '<div><input type="text" placeholder="Category name" ng-model="newCategory.name"><hr><input type="password" placeholder="Category icon" ng-model="newCategory.icon"></div>',
      title: 'New category',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: 'Add',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.newCategory.name && !scope.newCategory.icon) {
              e.preventDefault();
            } else {
              return $scope.newCategory;
            }
          }
        }
      ]
    }).then(function (res) {
      if (res) {
        ProfileService.addCategory(res.name, res.icon, vm.user.id)
          .then(function (res) {
            if (res.status === 201) {
              $scope.newCategory = {};
              init();
            }
          })
      }
    })
  };

  vm.addCategory = function () {
    ProfileService.addCategory(vm.categoryName, vm.categoryIcon, vm.user.id)
      .then(function (res) {
        if (res.status === 201) {
          vm.categoryName = '';
          vm.categoryIcon = '';

          init();
        }
      })
  };

  vm.logout = function () {
    AuthFactory.isLoggedIn = false;
    delete $window.sessionStorage.token;
    delete $window.sessionStorage.userData;

    $state.go('login');
  };
};
