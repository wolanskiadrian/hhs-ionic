angular.module('hhs-ionic').controller('LoginController', LoginController);

LoginController.$inject = ['$location', '$state', '$window', '$timeout', 'AuthFactory', 'LoginService', 'ValidatorService'];

function LoginController($location, $state, $window, $timeout, AuthFactory, LoginService, ValidatorService) {
  var vm = this;
  vm.errorMessage = null;
  vm.validationResults = {};
  vm.loginData = {};

  // function init() {
  //     if($window.sessionStorage.token) {
  //         $location.path('/dashboard');
  //     }
  // }
  //
  // init();

  vm.login = function () {
    vm.validationResults = ValidatorService.validateForm(['email', 'password'], vm.loginData);

    if (angular.equals({}, vm.validationResults)) {
      LoginService.login(vm.loginData)
        .then(function (res) {
          if (res.data.success && res.data.token && res.data.user) {
            $window.sessionStorage.token = res.data.token;
            $window.sessionStorage.userData = JSON.stringify(res.data.user);
            AuthFactory.isLoggedIn = true;
            vm.errorMessage = null;
            $state.go('tab.dashboard');
          } else {
            vm.errorMessage = res.data.message;
            $timeout(function () {
              vm.errorMessage = null;
            }, 2000);
          }
        }).catch(function (err) {
        console.log(err);
        vm.errorMessage = err;
      });
    } else {
      //TODO: validation form message
      // vm.errorMessage = '';
    }
  };

  vm.logout = function () {
    AuthFactory.isLoggedIn = false;
    delete $window.sessionStorage.token;
    delete $window.sessionStorage.userData;

    $location.path('#/login');
  };

  vm.register = function () {
    $location.path('/register');
  }
};
