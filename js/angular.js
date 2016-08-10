//angular.element(document.body).injector().get('ListData')
var app = angular.module('ShoppingListApp', ['ngRoute']);
var helpfullFunctions = {
    dateObjToString: function () {
        var year, month, day;
        year = String(this.getFullYear());
        month = String(this.getMonth() + 1);
        if (month.length == 1) {
            month = "0" + month;
        }
        day = String(this.getDate());
        if (day.length == 1) {
            day = "0" + day;
        }
        return year + "-" + month + "-" + day;
    },
    stringToDateObj: function(string){
        return new Date(string.substring(0,4), string.substring(5,7) - 1, string.substring(8,10));
    }
}
app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'views/ShoppingList.html',
            controller: 'ShoppingListViewController'
        })
        .when('/ShoppingList', {
            templateUrl: 'views/ShoppingList.html',
            controller: 'ShoppingListViewController'
        })
        .when('/ShoppingList/new', {
            templateUrl: 'views/NewPurchase.html',
            controller: 'NewPurchaseViewController'
        })
        .when('/ShoppingList/edit/:id', {
            templateUrl: 'views/NewPurchase.html',
            controller: 'NewPurchaseViewController'

        })
        .otherwise({
            redirectTo: '/'
        })
});
app.factory ('ListData', function(){
    var service = {};
    service.entries = [
        {id:1, description: 'food', amount: 10, date: '2014-10-01'},
        {id:2, description: 'drink', amount: 12, date: '2014-10-01'},
        {id:3, description: 'sucks', amount: 11, date: '2014-10-04'},
        {id:4, description: 'pants', amount: 20, date: '2014-10-04'},
        {id:5, description: 'hat', amount: 25, date: '2014-10-04'}
    ]
    service.entries.forEach(function(item){
        item.date = helpfullFunctions.stringToDateObj(item.date);
    })
    service.idUpdate = function(){
        this.entries.forEach(function(item, i){
            item.id = i + 1;
        })
    }
    service.idUpdate()

    service.newId = function(){
        return this.entries.length + 1;
    }
    service.getObjById = function(id){
        return this.entries[id - 1];
    }

    service.save = function(newElem){
        var toUpdate = service.getObjById(newElem.id);

        if(toUpdate){
            _.extend(toUpdate, newElem);
        }else{
            newElem.id = service.newId();
            this.entries.push(newElem);
        }
    }
    service.remove = function(id){
        service.entries.splice(id - 1, 1);
        service.idUpdate();
    }
    return service;
});

app.controller('HomeViewController', ['$scope', function($scope){
    $scope.appTitle = 'Shopping List';
}]);

app.controller('ShoppingListViewController', ['$scope','ListData', function($scope ,ListData){
    $scope.ShoppingList = ListData.entries;
    $scope.remove = function(id){
        ListData.remove(id);
    }

}]);

app.controller('NewPurchaseViewController', ['$scope', '$routeParams', '$location', 'ListData', function($scope, $routeParams, $location, ListData){
    if (!$routeParams.id){
        $scope.purchase = {id:0, description: 'kolbasa', amount: 10, date: new Date}
    }
    else{
        var paramId = $routeParams.id.substr(1);

        $scope.purchase = _.clone(ListData.getObjById(paramId));
    }

    $scope.save = function(){
        ListData.save($scope.purchase);
        $location.path('/');
    }

}]);

app.directive('qwePurchase', function(){
    return {
        restrict: 'E',
        templateUrl: 'views/purchase.html'
    }
})