//main app logic
var app = {
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
    getPage: function (id) {
        //get page from page object
        var page = null;
        for (var i = 0; i < this.pages.length; i++) {
            if (this.pages[i].id == id) {
                page = this.pages[i];
            }
        }
        return page;
    },
    renderPage: function (id) {
        //render the page template into the container
        var pageTemplate = this.getPage(id).template;

    },
    setPage: function (id) {
        //set the current page for the app
        this.previousPageId = this.currentPageId;
        this.currentPageId = id;
        this.renderPage(this.currentPageId);
    },
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