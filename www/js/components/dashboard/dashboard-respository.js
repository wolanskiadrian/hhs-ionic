angular.module('hhs-ionic').service('DashboardService', DashboardService);

DashboardService.$inject = ['$http', 'API_URL'];

function DashboardService($http, API_URL) {

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
