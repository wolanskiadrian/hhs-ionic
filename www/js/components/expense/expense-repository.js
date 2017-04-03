angular.module('hhs-ionic').service('ExpenseService', ExpenseService);

ExpenseService.$inject = ['$http', 'API_URL'];

function ExpenseService($http, API_URL) {

  this.add = function (model) {
    return $http.post(API_URL.url + '/api/expense', model).then(function (res) {
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
    });
  };

  this.edit = function edit(id, model) {
    return $http.put(API_URL.url + '/api/expense/' + id, model).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

  this.deleteOne = function deleteOne(id) {
    return $http.delete(API_URL.url + '/api/expense/' + id).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

  this.getExpense = function getExpense(id) {
    return $http.get(API_URL.url + '/api/expense/' + id).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

}
