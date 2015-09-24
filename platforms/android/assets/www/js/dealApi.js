(function () {
    'use strict';

    angular.module('TreeGigApp').factory('dealApi', ['DSCacheFactory', '$ionicLoading', '$q', '$http', 'dbApi', '$timeout', dealApi]);

    function dealApi(DSCacheFactory, $ionicLoading, $q, $http, dbApi, $timeout) {

        DSCacheFactory("dealCache", { storageMode: "localStorage", maxAge: 20000000, deleteOnExpire: "aggressive"});
        $timeout(function () {
            dbApi.init();
        }, 2000);
        //dbApi.init();
        getHotDeals();
        self.dealCache = DSCacheFactory.get("dealCache");

        self.dealCache.setOptions({
            onExpire: function (key, value) {
                getDeals()
                    .then(function () {
                        console.log("DealCache was automatically refreshed.", new Date());
                    }, function () {
                        console.log("Error getting DealCache. Putting expired item back in the cache.", new Date());
                        self.dealCache.put(key, value);
                    });
            }
        });


        function saveBookmark(deal) {
            var cacheKey = "bookmarks";
            var bookmarks = self.dealCache.get(cacheKey);

            if (!bookmarks) {
                var out = new Array();
                out.push(JSON.stringify(deal));
                self.dealCache.put(cacheKey, out);
            }
            else {
                var currenDeal = getBookMarkByID(deal.uuid);
                if (!currenDeal) {
                    bookmarks.push(JSON.stringify(deal));
                    self.dealCache.put(cacheKey, bookmarks);
                }
                else {
                    var out = new Array();

                    for (var i = 0; i < bookmarks.length; i++) {
                        var obj = JSON.parse(bookmarks[i]);
                        if (obj.uuid == deal.uuid) {

                        }
                        else {
                            out.push(JSON.stringify(obj));
                        }
                    }
                    self.dealCache.put(cacheKey, out);

                }

                //  self.dealCache.put(cacheKey,bookmarks);

            }

        }

        function getBookMarkByID(uuId) {
            var cacheKey = "bookmarks";
            var bookmarks = self.dealCache.get(cacheKey);

            var rtn;
            if (!bookmarks) {
                return rtn;
            }
            for (var i = 0; i < bookmarks.length; i++) {
                var obj = JSON.parse(bookmarks[i]);
                if (obj.uuid == uuId) {
                    rtn = obj;
                    return rtn;
                }
            }
            return rtn;
        }


        function getMenus() {
            var deferred = $q.defer();

            var menuData;


            $http.get("json/menu.json")
                .success(function (data) {

                    deferred.resolve(data);
                })
                .error(function (data, status) {
                    // console.log("Error getting Data via HTTP call."+status+ " data:"+data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        function getDeals() {
            var deferred = $q.defer();
            var cacheKey = "deals";
            var dealData = self.dealCache.get(cacheKey);

            if (dealData) {
                console.log("Found deals inside cache", dealData);
                deferred.resolve(dealData);
            }
            else {
                $http.get("http://173.70.83.50:8080/MWDBookServerStub/rest/deals.json")
                    .success(function (data) {
                        console.log("Received deals via HTTP:: " + data);
                        var deals = _.chain(data.data.publications)
                            /* .pluck('id')
                             .flatten()
                             .find({id: vm.deal_id})*/
                            .value();
                        self.dealCache.put(cacheKey, deals);
                        deferred.resolve(deals);
                    })
                    .error(function (data, status) {
                        console.log("Error getting deal while making HTTP call." + status + " data:" + data);
                        deferred.reject();
                    });
            }
            return deferred.promise;
        }

        function getHotDeals() {
            var deferred = $q.defer();
            $http.get("http://173.70.83.50:8080/MWDBookServerStub/rest/deals.json")
                .success(function (data) {
                    console.log("Received HotDeals data via HTTP:: " + data);
                    var deals = _.chain(data.data.hotdeals)
                        .value();

                    deferred.resolve(deals);
                })
                .error(function (data, status) {
                    console.log("Error while getting HotDeals in HTTP call." + status + " data:" + data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        function reduceJsonSize(data, category) {
            var newDeals = new Array();
            for (var i = 0; i < data.length; i++) {

                var deal = {category: category, title: data[i].title, uuid: data[i].uuid, dealUrl: data[i].dealUrl, shortAnnouncementTitle: data[i].shortAnnouncementTitle,
                    pitchHtml: data[i].pitchHtml, largeImageUrl: data[i].largeImageUrl, mediumImageUrl: data[i].mediumImageUrl, smallImageUrl: data[i].smallImageUrl, type: data[i].type,
                    redemptionLocation: data[i].redemptionLocation, expiresInDays: data[i].options[0].expiresInDays, redemptionLocations: data[i].options[0].redemptionLocations
                };


                newDeals.push(deal);
            }
            return newDeals;
        }

        function getLocation(data) {
            var newDeals = new Array();
            for (var i = 0; i < data.length; i++) {
                var id = data[i].uuid;
                var locations = data[i].redemptionLocations;
                for (var b = 0; b < locations.length; b++) {

                    locations[b].uuid = id;
                }
                newDeals = newDeals.concat(locations);
            }
            return newDeals;
        }


        function getDeal(uuId, category) {
            var deferred = $q.defer();
            dbApi.query("SELECT * FROM items Where  uuid = ?", [uuId])
                .then(function (result) {
                    var out1 = dbApi.fetchAll(result);
                    deferred.resolve(out1);
                });
            return deferred.promise;

        }

        function getDealLocation(uuId) {
            var deferred = $q.defer();
            dbApi.query("SELECT * FROM locations Where  uuid  like ? Limit 4 ", [uuId])
                .then(function (result) {
                    var out1 = dbApi.fetchAll(result);
                    deferred.resolve(out1);
                });
            return deferred.promise;

        }

        function getGDeals(category) {
            var startTime = new Date().getMilliseconds();
            var deferred = $q.defer();
            var url = "https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&offset=0&limit=50&radius=50&filters=category:" + category;

            if ((category === "accommodation") ||
                (category === "bed-and-breakfast-travel") ||
                (category === "cabin-travel") ||
                (category === "cruise-travel") ||
                (category === "hotels") ||
                (category === "resort-travel") ||
                (category === "vacation-rental-travel") ||
                (category === "tour-travel")) {
                url = "https://partner-api.groupon.com/deals.json?tsToken=US_AFF_0_201236_212556_0&offset=0&limit=50&include_travel_bookable_deals=true&filters=category:" + category;

            }


            $http.get(url)
                .success(function (data) {

                    var deals = _.chain(data.deals).value();

                    var newDeals = reduceJsonSize(deals, category);
                    deferred.resolve(newDeals);
                    var endTime = new Date().getMilliseconds();
                    console.log("Time :" + (endTime - startTime));
                    dbApi.insertAll("items", newDeals);


                    var out = dbApi.query("SELECT * FROM items Where category = ?", [category])
                        .then(function (result) {
                            var out1 = dbApi.fetchAll(result);
                            //  deferred.resolve(out1);
                            //  var endTime=new Date().getMilliseconds();
                            // console.log("Time :"+(endTime-startTime));
                        });


                    var locations = getLocation(newDeals);
                    dbApi.insertAll("locations", locations);


                })
                .error(function (data, status) {
                    //  console.log("Error getting deal while making HTTP call."+status+ " data:"+data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        return {
            getDeals: getDeals,
            getMenus: getMenus,
            getHotDeals: getHotDeals,
            getGDeals: getGDeals,
            getDeal: getDeal,
            saveBookmark: saveBookmark,
            getBookMarkByID: getBookMarkByID,
            getDealLocation: getDealLocation
        };
    };
})();