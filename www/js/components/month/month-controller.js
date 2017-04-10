var MOUNTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

angular.module('hhs-ionic').controller('MonthController', MonthController);

MonthController.$inject = ['$state', '$q', '$timeout', '$window', 'MonthService'];

function MonthController($state, $q, $timeout, $window, MonthService) {
  var vm = this;
  vm.user = JSON.parse($window.sessionStorage.getItem('userData'));
  vm.errorMessage = null;
  vm.monthsList = MOUNTHS;
  vm.yearsList = [];

  function setCurrentDataFilters() {
    var todayDate = new Date();
    var currentMonth = todayDate.getMonth();
    var currentYear = todayDate.getFullYear();

    vm.selectedMonth = MOUNTHS[currentMonth];
    vm.selectedYear = currentYear;

    filterExpenses();
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

    if(vm.categoryIndex) {
      vm.currentCategory = vm.categoriesInMonth[vm.categoryIndex];
      vm.totalAmountOfCategory = vm.currentCategory.amount;
      vm.currentCategoriesExpenses = [];

      _.forEach(vm.filteredExpenses, function (expense) {
        if(expense.categoryName === vm.currentCategory.name) {
          vm.currentCategoriesExpenses.push(expense);
        }
      })
    }

    vm.totalAmountOfMouth = parseFloat(Math.round(vm.totalAmountOfMouth * 100) / 100).toFixed(2);
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

  init();

  function init() {
    $q.all([
      MonthService.getAll(vm.user.id),
      MonthService.getCategories(vm.user.id)
    ]).then(function (res) {
      vm.expenses = res[0].data;
      vm.categories = res[1].data;

      setCategoryForExpense(vm.expenses, vm.categories);
      vm.yearsList = getYearsFromExpenses(vm.expenses);
      setCurrentDataFilters();
    });

    if($state.params.index) {
      vm.categoryIndex = $state.params.index;
    }
  }

  vm.filterExp = function () {
    filterExpenses();
  };

  vm.backToMonth = function () {
    $state.go('tab.month');

  }

}
