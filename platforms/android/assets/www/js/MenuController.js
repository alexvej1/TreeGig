/**
 * Created by x197579 on 7/25/15.
 */
(function () {
    'use strict';

    angular.module('TreeGigApp').controller('MenuController', ['$scope', '$location', 'dealApi', MenuController]);

    function MenuController($scope, $location, dealApi) {
        var vm = this;


        $scope.goTo = function (category, page) {
            console.log('Going to ' + page + ' Category :' + category);
            if (category == "Hot Deals") {
                $location.url('app/start1');
            }
            else {
                $location.url('/app/category/' + page + '/' + category);
            }

        };

        function myGoBack() {
            console.log("Go Back");
        }

        function loadList() {
            dealApi.getMenus().then(function (data) {
                $scope.list = data;
                console.log("DATA:" + $scope.list);
            }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        loadList();

    };
})();