(function () {
    'use strict';

    angular.module('TreeGigApp').controller('DealDetailCtrl', ['$stateParams', 'dealApi', '$scope', 'DSCacheFactory', '$cordovaSocialSharing', '$state', '$cordovaGeolocation', DealDetailCtrl]);

    function DealDetailCtrl($stateParams, dealApi, $scope, DSCacheFactory, $cordovaSocialSharing, $state, $cordovaGeolocation) {
        var vm = this;
        var deal_id;
        var data;

        vm.deal_id = $stateParams.id;
        vm.category = $stateParams.category;
        vm.deal = null;

        var options = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            /*   var marker = new google.maps.Marker({
             map: $scope.map,
             animation: google.maps.Animation.DROP,
             position: latLng
             });
             */
            for (var i = 0; i < vm.locations.length; i++) {
                var latitude = vm.locations[i].lat
                var longitude = vm.locations[i].lng;
                var myLatlng = new google.maps.LatLng(latitude, longitude);
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: myLatlng
                });
            }


            google.maps.event.addListener(marker, 'click', function () {
                //  infoWindow.open($scope.map, marker);
                var latitude = 40.9444444, longitude = -74.0758333;
                launchnavigator.navigate([latitude, longitude]);
            });

            var infoWindow = new google.maps.InfoWindow({
                // content: "Here I am!"

            });
            /* google.maps.event.addListenerOnce($scope.map, 'idle', function(){

             var marker = new google.maps.Marker({
             map: $scope.map,
             animation: google.maps.Animation.DROP,
             position: latLng
             });
             });
             */

        }, function (error) {
            console.log("Could not get location");
        });

        vm.openDeal = function () {
            window.open(vm.deal.dealUrl, "_blank", "location=no");

        }


        $scope.share = function () {

            $cordovaSocialSharing.share(
                vm.deal.title, vm.deal.title, null,
                vm.deal.dealUrl
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

        /*  $scope.openDeal = function() {
         window.open( vm.documenturl, "_blank", "location=no");

         }*/

        vm.bookmark = function () {
            console.log("Bookmark :" + vm.deal_id);

            dealApi.saveBookmark(vm.deal);
            //add item

        }

        vm.checkBookmark = function () {
            if (dealApi.getBookMarkByID(vm.deal_id)) {
                return "Remove Bookmark";
            }
            else {
                return "Save to Bookmark";
            }
        }

        dealApi.getDealLocation(vm.deal_id)
            .then(function (data) {
                vm.locations = data;
                setupMarker(data);
                console.log("UUID : " + vm.deal_id);
            });

        dealApi.getDeal(vm.deal_id, vm.category)
            .then(function (data) {
                vm.deal = data[0];
            });

        function setupMarker(data) {
            for (var i = 0; i < data.length; i++) {
                var latitude = data[i].lat
                var longitude = data[i].lng;
                var myLatlng = new google.maps.LatLng(latitude, longitude);

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: myLatlng
                });

            }
        }

        vm.navigate = function (lat, lng) {
            var latitude = lat, longitude = lng;
            launchnavigator.navigate([latitude, longitude]);
        }
        console.log("Received deals via HTTP:: " + JSON.stringify(vm.deal));


    }

})();