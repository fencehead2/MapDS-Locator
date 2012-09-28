//locator functionality of the app
var locator = {

    spinner: null,
    loading: function (isLoading, selector, isPageLoader, settings) {
        selector = selector || '#loading';
        isLoading = isLoading == null ? true : isLoading;
        isPageLoader = isPageLoader == null ? true : isPageLoader;
        settings = settings || {
            radius: 12,
            height: 10,
            width: 2,
            dashes: 25,
            opacity: 1,
            padding: 3,
            rotation: 250,
            color: '#000000'
        };
        if (isLoading == true) {
            $(selector).show();
            this.spinner = Spinners.create(selector, settings).play();
            this.spinner.center();
            if (isPageLoader == true) {
                var midScreen = (this.getWindowDimensions().height - 10) / 2;
                $(selector).css('top', midScreen + 'px');
            }
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

    searchedLocationMarker: null,
    searchedLocationMarkerSettings: {
        img: '../www/img/current-location.png',
        height: 25,
        width: 25
    },
    createSearchedLocaitonMarker: function (lat, lng, searchedlocation) {
        if (this.searchedLocationMarker != null) {
            this.searchedLocationMarker.setMap(null);
        }
        var settings = {
            position: new google.maps.LatLng(lat, lng),
            map: this.map,
            icon: new google.maps.MarkerImage(this.searchedLocationMarkerSettings.img, null, null, null, new google.maps.Size(this.searchedLocationMarkerSettings.width, this.searchedLocationMarkerSettings.height)),
            title: searchedlocation
        };
        this.searchedLocationMarker = new google.maps.Marker(settings);
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
        $('#current-location').click(function () {
            $('#current-location').css('width', '44');
            $('#current-location').css('height', '30');
            $('#current-location').html('<div id="current-location-loading" ></div>');
            _SELF.loading(true, '#current-location-loading', false, {
                radius: 5,
                height: 5,
                width: 1,
                dashes: 21,
                opacity: 1,
                padding: 3,
                rotation: 250,
                color: '#000000'
            });
            navigator.geolocation.getCurrentPosition(
            //sucess
                function (position) {
                    if (_SELF.map && google) {
                        _SELF.createSearchedLocaitonMarker(position.coords.latitude, position.coords.longitude, 'Current Location')
                        _SELF.map.setCenter(new google.maps.LatLng(
                            position.coords.latitude,
                            position.coords.longitude
                        ));
                        _SELF.map.setZoom(16);
                        _SELF.loading(false, '#current-location-loading', false);
                        $('#current-location').html('<i class="icon-screenshot"></i>');
                    }
                },
            //error
                function (error) { },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        });
        $('#map-btn').click(function () {
            $('#searchResults').hide();
            $('#list').hide();
            $('#map').show();
            window.scrollTo(0, 0.5);
        });
        $('#list-btn').click(function () {
            $('#searchResults').hide();
            $('#map').hide();
            $('#list').show();
            window.scrollTo(0, 0.5);
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
window.scrollTo(0, 0.5);