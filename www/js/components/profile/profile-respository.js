angular.module('hhs-ionic').service('ProfileService', ProfileService);

ProfileService.$inject = ['$http', 'API_URL'];

function ProfileService($http, API_URL) {

  this.changePassword = function changePassword(password, userId) {
    var model = {
      password: password,
      userId: userId
    };

    return $http.post(API_URL.url + '/api/users/change-password', model).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

  this.getUserCategories = function getUserCategories(userId) {
    return $http.get(API_URL.url + '/api/categories/user/' + userId).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

  this.addCategory = function addCategory(name, icon, userId) {
    var model = {
      name: name,
      icon: icon
    };

    return $http.post(API_URL.url + '/api/category/' + userId, model).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };

  this.deleteCategory = function deleteCategory(id) {
    return $http.delete(API_URL.url + '/api/categories/' + id).then(function (res) {
      return res;
    }).catch(function (err) {
      return err;
    });
  };
}
