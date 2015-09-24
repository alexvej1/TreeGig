/**
 * Created by x197579 on 7/25/15.
 */
(function () {
    'use strict';

    angular.module('TreeGigApp').controller('CategoryController', ['$scope' , '$stateParams', '$state', 'dealApi', '$location', CategoryController]);

    function CategoryController($scope, $stateParams, $state, dealApi, $location) {
        var vm = this;
        var deal_id;
        var data;
        var title;


        vm.title = $stateParams.category;


        $scope.rightButtons = [];
        console.log("$stateParams", $stateParams);

        vm.loadList = function (forceRefresh) {
            dealApi.getGDeals(vm.title).then(function (data) {
                vm.deals = new Array();


                vm.deals = data;
                //console.log("DATA:");
            }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };

        function calculateDate(feedDate) {
            var ret = 0;
            var currentTime = new Date().getTime();
            console.log(currentTime);

            var date = new Date(feedDate).getTime();
            var sec = parseInt((currentTime - date) / (1000));
            var min = parseInt((currentTime - date) / (60 * 1000));
            var hours = parseInt((currentTime - date) / (3600 * 1000));
            var dates = parseInt((currentTime - date) / (24 * 3600 * 1000));
            var month = parseInt((currentTime - date) / (30 * 24 * 3600 * 1000));
            var year = parseInt((currentTime - date) / (12 * 30 * 24 * 3600 * 1000));
            console.log(dates);


            if (year > 0) {
                ret = year + " year";
            }
            else if (month > 0) {
                ret = month + " month";
            }
            else if (dates > 0) {
                ret = dates + " dates";
            }
            else if (hours > 0) {
                ret = reminder + " hours";
            }
            else if (min > 0) {
                ret = hours + " min";
            }
            else if (sec > 0) {
                ret = sec + " sec";
            }
            return ret;
        }

        vm.loadList(false);


        vm.selectDeal = function (id, category) {
            $location.url('/app/deal/' + id + "/" + category);

        }

        /*  vm.selectDeal=function(id)
         {
         deal_id=id;

         }*/


    };
})();