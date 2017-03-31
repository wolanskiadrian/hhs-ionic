angular.module('hhs-ionic').service('ForgotService', ForgotService);

ForgotService.$inject = ['$http', 'API_URL'];

function ForgotService($http, API_URL) {

    this.forgot = function (email) {
        var model = {
            email: email
        };

        return $http.post(API_URL.url + '/api/users/forgot', model).then(function (res) {
            return res;
        }).catch(function (err) {
            return err;
        });
    }

}
