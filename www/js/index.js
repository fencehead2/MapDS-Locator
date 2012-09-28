//locator functionality of the app
var locator = {

    spinner: null,
    loading: function (isLoading, selector) {
        selector = selector || '#loading';
        isLoading = isLoading == null ? true : isLoading;
        if (isLoading == true) {
            $(selector).show();
            this.spinner = Spinners.create(selector, {
                radius: 12,
                height: 10,
                width: 2,
                dashes: 25,
                opacity: 1,
                padding: 3,
                rotation: 250,
                color: '#000000'
            }).play();
            this.spinner.center();
            $(selector).css('top', '200px');
        } else {
            $(selector).hide();
            if (this.spinner) Spinners.get(selector).remove(); Spinners.removeDetached();
        }
    },

    getWindowDimensions: function () {
        var myWidth = 0, myHeight = 0;
        if (typeof (window.innerWidth) == 'number') {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        return {
            height: myHeight,
            width: myWidth
        };
    },

    windowResize: function (mapselector) {
        var _SELF = this;
        mapselector = mapselector || '#map';
        var windowDimensions = _SELF.getWindowDimensions();
        var height = windowDimensions.height;
        var width = windowDimensions.width;
        if (height < 369) {
            height = 369;
        }
        $(mapselector).height(height - 152);
        if (_SELF.map != null) {
            google.maps.event.trigger(_SELF.map, "resize");
        }
    },

    initEvents: function () {
        var _SELF = this;
        $(window).resize(function () {
            _SELF.windowResize();
        });
        $('#search').bind('keypress', function (e) {
            $('#searchResults').show();
        });
        $('.dropdown-toggle').click(function () {
            $('.dropdown-toggle').parent().find('ul').toggle();
        });
    },

    waypoints: [],
    directions: function (waypoints) {

    },

    currentLocation: function () {

    },

    lastGeocodeResult: {},
    geocode: function (address, sucessCallback, failCallback) {

    },

    infoBox: null,
    map: null,
    startPosition: null,
    startZoom: null,
    startCentre: {
        lat: -28,
        lng: 135
    },
    startZoom: 3,
    initMap: function (selector, options) {
        if (google) {
            selector = selector || 'map';
            options = options || {
                center: new google.maps.LatLng(this.startCentre.lat, this.startCentre.lng),
                zoom: this.startZoom,
                streetViewControl: false,
                panControl: false,
                minZoom: this.startZoom,
                mapTypeControl: false,
                zoomControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(document.getElementById(selector), options);                        
        } else {
            return null;
        }
    },

    initialize: function (config) {
        if (config) {
            $.extend(this, config);
        }
        this.loading(true);        
        var _SELF = this;
        setTimeout(function () {
            _SELF.initMap();
            _SELF.initEvents();
            _SELF.windowResize();
            _SELF.loading(false);
        }, 1000);
    }

};
locator.initialize();
window.scrollTo(0, 1);