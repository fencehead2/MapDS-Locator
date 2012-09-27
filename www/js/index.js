//main app logic
var app = {
    config: {},
    initialize: function () {
        device.initialize({
            deviceready: function () {
                //when the app has loaded
                
            }
        });
    }
};

//device management of the app
var device = {
    initialize: function (options) {
        if (options) {
            $.extend(this, options);
        }
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);
        document.addEventListener("offline", this.deviceoffline, false);
        document.addEventListener("online", this.deviceonline, false);
    },
    deviceready: function () {
        //when the device is ready
        console.log('device ready');
    },
    deviceoffline: function () {
        //when the device is offline
        console.log('device offline');
    },
    deviceonline: function () {
        //when the device is online
        console.log('device online');
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

    },

    initialize: function (config) {
        if (config) {
            $.extend(this, config);
        }
    }

};