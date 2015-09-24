/**
 * Created by x197579 on 7/25/15.
 */
(function () {
    'use strict';

    angular.module('TreeGigApp').controller('BookmarksController', ['$scope' , '$stateParams', '$state', 'dealApi', '$location', BookmarksController]);

    function BookmarksController($scope, $stateParams, $state, dealApi, $location) {
        var vm = this;
        var deal_id;
        var data;
        var title;
       vm.title = $stateParams.category;
        $scope.leftButtons = [
            {
                type: 'button-icon icon ion-navicon',
                tap: function (e) {
                    $scope.sideMenuController.toggleLeft();
                }
            }
        ];

        $scope.rightButtons = [];
        console.log("$stateParams", $stateParams);

        vm.loadList = function () {
            var cacheKey = "bookmarks";
            vm.listBookmarks = [];
            var list = self.dealCache.get(cacheKey);
            for (var i = 0; i < list.length; i++) {
                var obj = JSON.parse(list[i]);
                vm.listBookmarks.push(obj);
            }
            console.log(vm.listBookmarks);
        };
        vm.loadList();
     vm.selectDeal = function (id, category) {
            $location.url('/app/deal/' + id + "/" + category);

        }
    };
})();