/**
 * Created by x197579 on 7/25/15.
 */
(function () {
    'use strict';

    angular.module('TreeGigApp').controller('StartCtrl1', ['$scope' , 'dealApi', '$ionicSlideBoxDelegate', '$cordovaSocialSharing', StartCtrl1]);

    function StartCtrl1($scope, dealApi, $ionicSlideBoxDelegate, $cordovaSocialSharing) {
        var vm = this;
        var deal_id;
        var data;

        vm.deal_id;
        var deal;
        var dealTitle;
        var smallpreviewimage;
        var largepreviewimage;
        var category;
        var subcategory;
        var expirydate;
        var documenturl;
        var price;


        $scope.share = function () {
            //  getDeal();
            $cordovaSocialSharing.share(
                deal.title, deal.title, null,
                deal.documenturl
                , null

            );
        }

// Share via email. Can be used for feedback
        $scope.sendFeedback = function () {
            $cordovaSocialSharing
                .shareViaEmail('Some message', 'Some Subject', 'to_address@gmail.com');
        }

// Share via SMS. Access multiple numbers in a string like: '0612345678,0687654321'
        $scope.sendSMS = function (message, number) {
            $cordovaSocialSharing.shareViaSMS(message, number);
        }


        vm.loadList = function (forceRefresh) {
            dealApi.getHotDeals().then(function (data) {
                vm.deals = data;
                deal = vm.deals[0];
                vm.dealTitle = deal.title;
                vm.smallpreviewimage = deal.smallpreviewimage;
                vm.largepreviewimage = deal.largepreviewimage;
                vm.category = deal.category;
                vm.subcategory = deal.subcategory;
                vm.expirydate = deal.expirydate;
                vm.documenturl = deal.documenturl;
                vm.price = deal.price;
                vm.deal_id = deal.id;
                console.log("Hot Deals:" + vm.deals);
                $ionicSlideBoxDelegate.update();
            });
        };

        vm.loadList(true);


        vm.selectDeal = function (id) {
            $location.url('/app/deal/' + id);

        }


        vm.slideHasChanged = function (id) {

            console.log(id);
            deal = vm.deals[id];
            console.log(deal);
            vm.dealTitle = deal.title;
            vm.smallpreviewimage = deal.smallpreviewimage;
            vm.largepreviewimage = deal.largepreviewimage;
            vm.category = deal.category;
            vm.subcategory = deal.subcategory;
            vm.expirydate = deal.expirydate;
            vm.documenturl = deal.documenturl;
            vm.price = deal.price;
            vm.deal_id = deal.id;
        }

        vm.checkBookmark = function () {
            if (window.localStorage.getItem(vm.deal_id)) {
                return "Remove Bookmark";
            }
            else {
                return "Save to Bookmark";
            }
        }

        vm.bookmark = function () {
            console.log("Bookmark :" + vm.deal_id);


            var deal = window.localStorage.getItem(vm.deal_id);
            if (deal) {
                window.localStorage.removeItem(vm.deal_id);
            }
            else {
                window.localStorage.setItem(vm.deal_id, vm.deal_id);
            }


        }


        $scope.openDeal = function () {
            window.open(deal.documenturl, "_blank", "location=no");

        }

    };
})();