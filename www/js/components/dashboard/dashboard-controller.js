var MOUNTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

angular.module('hhs-ionic').controller('DashboardController', DashboardController);

DashboardController.$inject = ['$window', '$state', '$q', 'AuthFactory', 'DashboardService', 'ExpenseService'];

function DashboardController($window, $state, $q, AuthFactory, DashboardService, ExpenseService) {
    var vm = this;
    vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
    vm.expenses = [];
    vm.mountsList = MOUNTHS;
    console.log(vm.mountsList);
    vm.yearsList = [];
    vm.categoriesInMonth = [];

    function setCurrentDataFilters() {
        var todayDate = new Date();
        var currentMonth = todayDate.getMonth();
        var currentYear = todayDate.getFullYear();

        vm.selectedMonth = MOUNTHS[currentMonth];
        vm.selectedYear = currentYear;

        filterExpenses();
    }

    function getYearsFromExpenses(expenses) {
        var tYearList = [];

        _.forEach(expenses, function (expense) {
            var year = new Date(expense.expenseDate).getFullYear();
            tYearList.push(year);
        });

        return _.uniq(tYearList);
    }

    function setCategoryForExpense(expenses, categories) {
        angular.forEach(expenses, function (item) {
            var category = _.find(categories, {_id: item.categoryId});

            if(category){
                item.categoryName = category.name;
            } else {
                item.categoryName = 'No category included';
            }
        })
    }

    function filterExpenses() {

        function checkYear(e) {
            var eYear = new Date(e.expenseDate).getFullYear();
            if(eYear === vm.selectedYear) {
                return true;
            }

            return false;
        }

        function checkMonth(e) {
            var eMonthIndex = new Date(e.expenseDate).getMonth();
            var eMonth = MOUNTHS[eMonthIndex];
            if(eMonth === vm.selectedMonth) {
                return true;
            }

            return false;
        }

        vm.filteredExpenses = [];

        _.forEach(vm.expenses, function (e) {
            if(checkYear(e) && checkMonth(e)) {
                vm.filteredExpenses.push(e);
            }
        });

        vm.categoriesInMonth = getUniqCategoriesFromFilteredList(vm.filteredExpenses);
        getMonthDetailsData(vm.categoriesInMonth, vm.filteredExpenses);
        vm.totalAmountOfMouth = 0;

        _.forEach(vm.categoriesInMonth, function (cat) {
            vm.totalAmountOfMouth += cat.amount;
        });
    }

    function getMonthDetailsData(categoriesInMonth, fe) {
        _.forEach(fe, function (e) {
            var tCat = _.find(categoriesInMonth, {'name': e.categoryName});

            if(tCat) {
                tCat.amount += e.amount;
            }
        });
    }

    function getUniqCategoriesFromFilteredList(fe) {
        var tCategories = [];

        _.forEach(fe, function (e) {
            tCategories.push({
                name: e.categoryName,
                amount: 0
            });
        });

        return _.uniqBy(tCategories, 'name');
    }

    function init() {
        $q.all([
            DashboardService.getAll(vm.user.id),
            DashboardService.getCategories(vm.user.id)
        ]).then(function (res) {
            vm.expenses = res[0].data;
            vm.categories = res[1].data;

            setCategoryForExpense(vm.expenses, vm.categories);
            vm.yearsList = getYearsFromExpenses(vm.expenses);
            setCurrentDataFilters();
        });
    }

    init();

    vm.logout = function () {
        AuthFactory.isLoggedIn = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.userData;

        $location.path('/login');
    };

    vm.addExpense = function () {
      $state.go('expense');
    };

    // vm.showAddNewExpenseModal = function () {
    //     ModalService.showModal({
    //         templateUrl: 'app/shared/modals/add-new-expense-modal/add-new-expense-modal-view.html',
    //         controller: 'AddNewExpenseModalController',
    //         controllerAs: 'vm',
    //         inputs: {
    //             title: 'Add New Expense',
    //             categories: vm.categories,
    //             userId: vm.user.id
    //         }
    //     }).then(function (modal) {
    //         modal.close.then(function (res) {
    //             if(res) {
    //                 init();
    //             }
    //         })
    //     });
    // };

    vm.userProfile = function () {
        $location.path('/user/profile');
    };

    vm.filterExp = function () {
        filterExpenses()
    };

    vm.quickEditMode = function (expense, param) {
        expense.expenseDate = new Date(expense.expenseDate);
        expense.editMode = param;
    };

    // vm.editExpense = function (expense) {
    //     ModalService.showModal({
    //         templateUrl: 'app/shared/modals/confirm/confirm-view.html',
    //         controller: 'ConfirmController',
    //         controllerAs: 'vm',
    //         inputs: {
    //             title: 'Edit Expense',
    //             message: 'Are you sure to edit this expense ?'
    //         }
    //     }).then(function (modal) {
    //         modal.close.then(function (res) {
    //             if(res) {
    //                 ExpenseService.edit(expense._id, expense).then(function () {
    //                     vm.quickEditMode(expense, false);
    //                     init();
    //                 });
    //             }
    //         })
    //     });
    // };

    // vm.deleteExpense = function (id) {
    //     ModalService.showModal({
    //         templateUrl: 'app/shared/modals/confirm/confirm-view.html',
    //         controller: 'ConfirmController',
    //         controllerAs: 'vm',
    //         inputs: {
    //             title: 'Delete Expense',
    //             message: 'Are you sure to delete this expense ?'
    //         }
    //     }).then(function (modal) {
    //         modal.close.then(function (res) {
    //             if(res) {
    //                 ExpenseService.deleteOne(id).then(function () {
    //                     init();
    //                 });
    //             }
    //         })
    //     });
    // };
};