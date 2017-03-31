angular.module('hhs-ionic').factory('AuthFactory', AuthFactory);

function AuthFactory() {
    var auth = {
        isLoggedIn: false
    };

    return {
        auth: auth
    };
}
