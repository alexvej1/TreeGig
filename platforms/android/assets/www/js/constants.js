(function () {


    angular.module('TreeGigApp')
        .constant('DB_CONFIG', {
            name: 'TreeGig',
            tables: {
                items: {
                    // id: 'integer primary key',
                    category: "text",
                    title: 'text',
                    uuid: 'text UNIQUE',
                    dealUrl: 'text',
                    shortAnnouncementTitle: 'text',
                    pitchHtml: 'text',
                    largeImageUrl: 'text',
                    mediumImageUrl: 'text',
                    smallImageUrl: 'text',
                    type: 'text',
                    redemptionLocation: 'text',
                    expiresInDays: 'text'


                },
                locations: {
                    id: 'integer primary key',
                    name: 'text',
                    uuid: 'text',
                    streetAddress1: 'text',
                    state: 'text',
                    city: 'text',
                    postalCode: 'text',
                    phoneNumber: 'text',
                    lat: 'text',
                    lng: 'text',
                    country: "text"



                }

            }
        });
})();

