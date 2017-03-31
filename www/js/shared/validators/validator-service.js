angular.module('hhs-ionic').service('ValidatorService', ValidatorService);

ValidatorService.$inject = [];

function ValidatorService() {

    this.validateForm = function validateForm(FieldsArray, model) {
        var validationErrors = {};

        _.forEach(FieldsArray, function (field) {
            if(!model[field]) {
                validationErrors[field] = {
                    required: true
                }
            } else {
                if(field == 'email') {
                    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if(!re.test(model[field])) {
                        validationErrors[field] = {
                          format: true
                        }
                    }
                }
            }
        });

        return validationErrors;
    }
}
