angular.module('hhs-ionic', ['ionic'])

  .run(function ($ionicPlatform, $window, $rootScope) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if ($window.sessionStorage.token) {
        $rootScope.isLoggedIn = true;
      } else {
        $rootScope.isLoggedIn = false;
      }

      $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
        if (nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
          event.preventDefault();
          $location.path('#/login');
        } else {
          if ($window.sessionStorage.token) {
            $rootScope.isLoggedIn = true;
          } else {
            $rootScope.isLoggedIn = false;
          }
        }
      })
    });
  })

  .constant('API_URL', {url: 'http://localhost:1337'})
  // .constant('API_URL', {url: 'https://household-expenses.herokuapp.com'})

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'js/components/login/login-view.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'js/components/register/register-view.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: 'js/components/forgot/forgot-view.html',
        controller: 'ForgotController',
        controllerAs: 'vm'
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'js/components/dashboard/dashboard-view.html',
        controller: 'DashboardController',
        controllerAs: 'vm'
      })
      .state('expense-add', {
        url: '/expense/add',
        templateUrl: 'js/components/expense/expense-add-view.html',
        controller: 'ExpenseController',
        controllerAs: 'vm'
      })
      .state('expense-edit', {
        url: '/expense/edit/:id',
        templateUrl: 'js/components/expense/expense-add-view.html',
        controller: 'ExpenseController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/login');

  });
