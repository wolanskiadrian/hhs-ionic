// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
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

  // .constant('API_URL', {url: 'http://localhost:1337'})
  .constant('API_URL', {url: 'https://household-expenses.herokuapp.com'})

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    //   .state('tab', {
    //   url: '/tab',
    //   abstract: true,
    //   templateUrl: 'templates/tabs.html'
    // })

    // Each tab has its own nav history stack:

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
      .state('expense', {
        url: '/expense/add',
        templateUrl: 'js/components/expense/expense-add-view.html',
        controller: 'ExpenseController',
        controllerAs: 'vm'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
