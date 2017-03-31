angular.module('hhs-ionic').service('LoginService', LoginService);

LoginService.$inject = ['$http', 'API_URL'];

function LoginService($http, API_URL) {

  this.login = function (model) {
    return $http.post(API_URL.url + '/api/users/login', model)
      .then(function (res) {
        return res;
      }).catch(function (err) {
        return err;
      });
  }

}
