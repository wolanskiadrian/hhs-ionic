angular.module('hhs-ionic').service('RegisterService', RegisterService);

RegisterService.$inject = ['$http', 'API_URL'];

function RegisterService($http, API_URL) {

  this.register = function (model) {
    return $http.post(API_URL.url + '/api/users/register', model).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  }

}
