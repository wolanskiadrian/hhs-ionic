angular.module('hhs-ionic').service('MonthService', MonthService);

MonthService.$inject = ['$http', 'API_URL'];

function MonthService($http, API_URL) {

  this.getAll = function getAll(userId) {
    return $http.get(API_URL.url + '/api/expenses/' + userId).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

  this.getCategories = function getCategories(userId) {
    return $http.get(API_URL.url + '/api/categories/all/' + userId).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    })
  }
}
