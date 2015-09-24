angular.module("TreeGigApp", ["ionic", "ngCordova", "angular-data.DSCacheFactory"])
    .run(function ($ionicPlatform, DSCacheFactory) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


        });
    })
    .filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider


            .state('category', {
                url: '/category/:id/:category',
                templateUrl: 'templates/category.html'
            })

            .state('app.bookmars', {
                url: '/bookmars/:id',
                views: {
                    'mainContent': {
                        templateUrl: 'templates/bookmarks.html'
                    }}
            })


            .state('app', {
                abstract: true,
                url: "/app",
                templateUrl: "templates/menu-layout.html"
            })


            .state('app.deal', {

                url: '/deal/:id/:category',
                views: {
                    'mainContent': {

                        templateUrl: "templates/deal_detail.html"
                    }
                }
            })

            .state('app.start', {

                url: '/start',
                views: {
                    'mainContent': {

                        templateUrl: "templates/start.html"
                    }
                }
            })

            .state('app.locations', {

                url: '/category/:id/:category',
                views: {
                    'mainContent': {

                        templateUrl: "templates/category.html"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback

        $urlRouterProvider.otherwise('app/start');


    });