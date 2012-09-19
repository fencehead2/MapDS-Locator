//device management of the app
var device = {
    initialize: function () {
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);
        document.addEventListener("offline", this.deviceoffline, false);
        document.addEventListener("online", this.deviceonline, false);
    },
    deviceready: function () {
        //when the device is ready
    },
    deviceoffline: function () {
        //when the device is offline
        alert('device offline');
    },
    deviceonline: function () {
        //when the device is online
        alert('device online');
    }
};

//page management of the app
var pageManager = {
    pages: [
        {
            id: 'home',
            name: 'Home',
            template: '',
            events: function () {

            }
        },
        {
            id: 'selectaddress',
            name: 'Select Address',
            template: '',
            events: function () {

            }
        },
        {
            id: 'resultslist',
            name: 'Results',
            template: '',
            events: function () {

            }
        },
        {
            id: 'resultsmap',
            name: 'Results',
            template: '',
            events: function () {

            }
        },
        {
            id: '{{id}}',
            name: 'Details',
            template: '',
            events: function () {

            }
        }
    ],
    baseURL: null,
    currentPageId: null,
    previousPageId: null,
    initialize: function (pages) {
        if (pages) {
            $.extend(this, pages);
        }
    }
};

//locator functionality of the app
var locator = {

    waypoints: [],
    directions: function (waypoints) {

    },

    currentLocation: function () {

    },

    lastGeocodeResult: {},
    geocode: function (address, sucessCallback, failCallback) {

    },

    map: null,
    startPosition: null,
    startZoom: null,
    initMap: function (selector, options) {

    }

};