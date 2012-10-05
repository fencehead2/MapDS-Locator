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

    clickInfoBox: null,
    initMarkerEvents: function (marker, id, displayname, Latitude, Longitude, isCurrentLocation, isCluster) {
        var _SELF = this;
        var popupLink = !isCurrentLocation && !isCluster ? '#' : '#';
        var popupClass = !isCurrentLocation && !isCluster && id != 'Searched Location' ? 'markerlink' : 'markerlinkcl';
        var popupWidth = !isCurrentLocation && !isCluster ? '175px' : '130px';

        var pixelOffsetx = -51;
        var pixelOffsety = -100;
        if (isCurrentLocation == true) {
            pixelOffsetx = -50;
            pixelOffsety = -74;
        } else if (id == 'Searched Location') {
            popupWidth = '160px';
        }

        if (!isCurrentLocation && displayname.length >= 16) {
            displayname = displayname.substring(0, 16) + '...';
        }

        google.maps.event.addListener(marker, 'click', function () {
            //go to the detail page for the marker, uses the global ft variable
            marker.setZIndex(999);
            if (isCluster) {
                _SELF.Map.setCenter(marker.getPosition());
                _SELF.Map.setZoom(_SELF.Map.getZoom() + 1);
            } else {
                if (_SELF.clickInfoBox != null) { _SELF.clickInfoBox.close(); }
                var boxText = document.createElement("div");
                boxText.innerHTML = '<span class="popuplogo"><a class="' + popupClass + '" href="#" onclick="document.location.href=\'' + popupLink + '\'; return false;">' + displayname + '</a></span>';
                _SELF.clickInfoBox = new InfoBox({
                    content: boxText,
                    disableAutoPan: false,
                    maxWidth: 0,
                    pixelOffset: new google.maps.Size(pixelOffsetx, pixelOffsety),
                    zIndex: null,
                    boxStyle: {
                        background: "url('../www/img/infowindow/tipbox.png') no-repeat scroll -67pt 31pt transparent",
                        opacity: 1,
                        width: popupWidth
                    },
                    closeBoxMargin: "11px 3px 3px 3px",
                    closeBoxURL: "",
                    infoBoxClearance: new google.maps.Size(1, 1),
                    isHidden: false,
                    pane: "floatPane",
                    enableEventPropagation: false
                });
                _SELF.clickInfoBox.open(_SELF.map, marker);
            }
        });
    },

    searchedLocationMarkerSettings: {
        img: '../www/img/searched-location.png',
        shadow: '../www/img/searched-location-shadow.png',
        height: 74,
        width: 58
    },
    currentLocationMarker: null,
    currentLocationMarkerSettings: {
        img: '../www/img/current-location.png',
        height: 25,
        width: 25
    },
    createSearchedLocaitonMarker: function (lat, lng, searchedlocation, isCurrentLocation) {
        //remove existing markers
        if (this.currentLocationMarker != null) {
            this.currentLocationMarker.setMap(null);
        }
        //set marker settings
        var settings = {};
        if (isCurrentLocation == true) {
            settings = {
                position: new google.maps.LatLng(lat, lng),
                map: this.map,
                icon: new google.maps.MarkerImage(this.currentLocationMarkerSettings.img, null, null, null, new google.maps.Size(this.currentLocationMarkerSettings.width, this.currentLocationMarkerSettings.height)),
                title: searchedlocation
            };
        } else {
            settings = {
                position: new google.maps.LatLng(lat, lng),
                map: this.map,
                icon: new google.maps.MarkerImage(this.searchedLocationMarkerSettings.img, null, null, null, new google.maps.Size(this.searchedLocationMarkerSettings.width, this.searchedLocationMarkerSettings.height)),
                shadow: new google.maps.MarkerImage(this.searchedLocationMarkerSettings.shadow, null, null, null, new google.maps.Size(100, 90)),
                title: searchedlocation,
                optimized: false
            };
        }
        this.currentLocationMarker = new google.maps.Marker(settings);
        this.initMarkerEvents(this.currentLocationMarker, 'Searched Location', searchedlocation, lat, lng, isCurrentLocation, false);
    },

    find: function (address) {
        var _SELF = this;
        if (_SELF.clickInfoBox != null) { _SELF.clickInfoBox.close(); }
        if (address != '' && address != null && address != 'Enter Suburb / Postcode...') {
            (_SELF.directionsDisplay ? _SELF.directionsDisplay.setMap(null) : '');
            $('#results-btn').trigger('click');
            $('#directions-toggle').removeClass('active');
            $('#directions-toggle').hide();
            if (address.toLowerCase() == 'current location') {
                $('#current-location').trigger('click');
                return null;
            }
            this.geocode(address, '', false, function (location) {
                _SELF.geocodeResult = location;
                $('#search-input').val(_SELF.geocodeResult.formatted_address);
                _SELF.map.setCenter(new google.maps.LatLng(location.geometry.location.lat(), location.geometry.location.lng()));
                _SELF.map.setZoom(14);
                _SELF.createSearchedLocaitonMarker(location.geometry.location.lat(), location.geometry.location.lng(), _SELF.geocodeResult.formatted_address, false);
                $('#search-input').blur();
            });
        } else {
            //error msg - input missing
            $('#search-input').addClass('error');
            $('#search-input').focus(function () {
                $('#search-input').removeClass('error');
            });
        }
    },

    initInputEvents: function () {
        $('.directionsitem input').blur(function () {
            if ($(this).val() == '') {
                $(this).addClass('blur');
                $(this).val('Enter Suburb / Postcode');
            }
        });
        $('.directionsitem input').focus(function () {
            if ($(this).val() == 'Enter Suburb / Postcode') {
                $(this).val('');
                $(this).removeClass('blur');
            }
        });
        $('input[type="text"]').unbind('keyup');
        $('.clear-input').unbind('click');

        $('input[type="text"]').keyup(function () {
            var clearSelector = '#' + $(this).attr('id') + '-clear';
            if ($(this).val().length > 0) {
                $(clearSelector).show();
            }
            else {
                $(clearSelector).hide();
            }
        });
        $('.clear-input').click(function () {
            $(this).hide();
            var inputSelector = '#' + $(this).attr('id').replace('-clear', '');
            $(inputSelector).val('');
            $(inputSelector).blur();
        });

    },
    initEvents: function () {
        var _SELF = this;
        _SELF.initInputEvents();
        $('#searchBtnDir').click(function () {
            $('#map-btn').trigger('click');
            _SELF.getDirections();
        });
        $(window).resize(function () {
            _SELF.windowResize();
        });
        $('#search-input').focus(function () {
            if ($(this).val() == 'Current Location...' || $(this).val() == '') {
                $(this).val('');
            }
        });
        $('#search-input').bind('keypress', function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                _SELF.find($('#search-input').val());
                return false;
            }
        });
        $('#search-input-btn').click(function () {
            _SELF.find($('#search-input').val());
            return false;
        });
        $('#directions-search').submit(function () {
            $('#map-btn').trigger('click');
            $('#search-input').removeClass('current-location');
            $('#search-input').val('');
            $('#search-input').blur();
            $('.directionsitem input').blur();
            window.scrollTo(0, 0.5);
            return false;
        });
        $('.dropdown-toggle').click(function () {
            $('.dropdown-toggle').parent().find('.dropdown-menu').toggle();
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
                        (_SELF.directionsDisplay ? _SELF.directionsDisplay.setMap(null) : '');
                        $('#results-btn').trigger('click');
                        $('#directions-toggle').removeClass('active');
                        $('#directions-toggle').hide();
                        _SELF.createSearchedLocaitonMarker(position.coords.latitude, position.coords.longitude, 'Current Location', true)
                        _SELF.map.setCenter(new google.maps.LatLng(
                            position.coords.latitude,
                            position.coords.longitude
                        ));
                        _SELF.map.setZoom(16);
                        _SELF.loading(false, '#current-location-loading', false);
                        $('#current-location').html('<i class="icon-screenshot"></i>');
                        $('#search-input').val('Current Location...');
                        $('#search-input').addClass('current-location');
                        $('#search-input').focus(function () {
                            $('#search-input').removeClass('current-location');
                            $('#search-input').val('');
                        });
                    }
                },
            //error
                function (error) {                 
                    _SELF.loading(false, '#current-location-loading', false);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        });

        $('#results-btn').click(function () {
            $('#directions-btn').removeClass('active');
            $('#results-btn').addClass('active');
            $('#directions').hide();
            $('#results').show();
            window.scrollTo(0, 0.5);
            google.maps.event.trigger(_SELF.map, "resize");
        });
        $('#directions-btn').click(function () {
            $('#results-btn').removeClass('active');
            $('#directions-btn').addClass('active');
            $('#results').hide();
            $('#directions').show();
            window.scrollTo(0, 0.5);
            google.maps.event.trigger(_SELF.map, "resize");
        });
        $('#map-btn').click(function () {
            $('#list-btn').removeClass('active');
            $('#map-btn').addClass('active');
            $('#searchResults').hide();
            $('#list').hide();
            $('#map').show();
            $('#directions-toggle').hide();
            window.scrollTo(0, 0.5);
            google.maps.event.trigger(_SELF.map, "resize");
        });
        $('#list-btn').click(function () {
            $('#map-btn').removeClass('active');
            $('#list-btn').addClass('active');
            $('#searchResults').hide();
            $('#map').hide();
            $('#list').show();
            if ($('#directions-toggle').hasClass('active')) {
                $('#directions-toggle').show();
            }
            window.scrollTo(0, 0.5);
            google.maps.event.trigger(_SELF.map, "resize");
        });

        $('#addDestination').click(function () {
            _SELF.directionsWaypointCount++;
            _SELF.directionsWaypointId++;
            if (_SELF.directionsWaypointCount <= 5) {
                if (_SELF.directionsWaypointCount >= 5) {
                    $('#addDestination').hide();
                    $('#controlSeperator').hide();
                } else {
                    $('#addDestination').show();
                    $('#controlSeperator').show();
                }
                var html = '<div class="directionsitem"><div class="directionsLabel" id="directionsLabel' + _SELF.directionsWaypointId.toString() + '"></div><input id="waypointInput' + _SELF.directionsWaypointId.toString() + '"type="text" value="Enter Suburb / Postcode" class="blur" /><div id="waypointInput' + _SELF.directionsWaypointId.toString() + '-clear" class="clear-input clear-input-dir"></div><div class="removeDirectionField tooltipw" title="Remove this destination"></div></div>';
                $('#directionsFields').append(html);
                $('#directionsFields .directionsitem input').css('width', '65%');
                $('#directionsFields .directionsitem .directionsError').css('width', '65%');
                $('.clear-input-dir').css('right', '42px');
                if (_SELF.directionsWaypointCount > 2) {
                    $('.removeDirectionField').show();
                }
                $('.removeDirectionField').unbind('click');
                $('.removeDirectionField').click(function () {
                    if (_SELF.directionsWaypointCount == 3) {
                        $('.removeDirectionField').hide();
                        $('#directionsFields .directionsitem input').css('width', '78%');
                        $('#directionsFields .directionsitem .directionsError').css('width', '78%');
                        $('.clear-input-dir').css('right', '18px');
                    }
                    if (_SELF.directionsWaypointCount > 2) {
                        $(this).parent().remove();
                        _SELF.directionsWaypointCount--;
                    }
                    _SELF.presentWaypointIcons(false);
                    if (_SELF.directionsWaypointCount >= 5) {
                        $('#addDestination').hide();
                        $('#controlSeperator').hide();
                    } else {
                        $('#addDestination').show();
                        $('#controlSeperator').show();
                    }
                });
                _SELF.presentWaypointIcons(false);
            }
            _SELF.initInputEvents();
        });
        $('#hideShowDirOpt').click(function () {
            if ($('#directionsOptions').hasClass('hidden')) {
                $('#hideShowDirOpt').html('Hide Options');
            } else {
                $('#hideShowDirOpt').html('Show Options');
                $('#avoidhighways').attr("checked", false);
                $('#avoidtolls').attr("checked", false);
            }
            $('#directionsOptions').toggleClass('hidden');
            if (!$('#advancedSearchToggle').hasClass('show')) {
                $('#advancedSearchToggle').trigger('click');
            }
        });
    },

    presentWaypointIcons: function () {
        var waypointCount = 1;
        $('#directionsFields .directionsitem .directionsLabel').each(function () {
            $(this).html('');
            $(this).append('<img class="directionsItemIcn" src="../www/img/markers/waypointIcon' + waypointCount + '.png" alt="" />');
            $(this).css('background-repeat', 'no-repeat');
            waypointCount++;
        });
    },

    wayPoints: [],
    directionsWaypointCount: 2,
    directionsWaypointId: 1,
    directionsDisplay: null,
    getDirections: function () {
        var _SELF = this;
        if (_SELF.clickInfoBox != null) { _SELF.clickInfoBox.close(); }
        //remove all pervious errors
        _SELF.wayPoints = [];
        $('#directionsFields .directionsitem').find('.directionsError').remove();
        $('#directionsFields .directionsitem').find('input').removeClass('error');
        $('#directionsFields .directionsitem input').each(function (key, val) {
            var value = $(this).val();
            if (value == '' || value == 'Enter Suburb / Postcode') {
                $(this).parent().addClass('error');
                $(this).addClass('error');
                $(this).after('<div style="width: ' + $(this).width() + 'px;" class="errorMessage directionsError">Input a Suburb / Postcode</div>');
                $(this).focus(function () {
                    $(this).val('');
                    $(this).removeClass('error');
                    $(this).parent().removeClass('error');
                    $(this).parent().find('.directionsError').remove();
                });
            }
            var k = key;
            _SELF.wayPoints.push({
                address: value,
                index: k,
                geometry: null
            });
        });
        for (var i = 0; i < _SELF.wayPoints.length; i++) {
            if (_SELF.wayPoints[i].address != '' && _SELF.wayPoints[i].address != 'Enter Suburb / Postcode') {

                var callback = function (location, waypointNumber) { };

                _SELF.geocode(_SELF.wayPoints[i].address, i, true, function (location, waypointNumber) {

                    _SELF.wayPoints[waypointNumber].geometry = location.geometry.location.lat().toString() + ',' + location.geometry.location.lng().toString();

                    //all waypoints have been geocoded & there were no errors
                    if (waypointNumber == _SELF.wayPoints.length - 1 && $('#directionsFields .directionsitem').find('.directionsError').length == 0) {
                        var request = {
                            travelMode: google.maps.DirectionsTravelMode.DRIVING,
                            provideRouteAlternatives: true
                        };
                        var waypointsForRequest = [];
                        var waypointCount = 0;
                        var errors = 0;
                        $.each(_SELF.wayPoints, function (id, wayPoint) {
                            if (waypointCount == 0) {
                                $.extend(request, { origin: wayPoint.geometry });
                            }
                            else if (waypointCount == _SELF.wayPoints.length - 1) {
                                $.extend(request, { destination: wayPoint.geometry });
                            } else {
                                waypointsForRequest.push({ location: wayPoint.geometry });
                            }
                            waypointCount++;
                            if (wayPoint.geometry == ',' || wayPoint.geometry == null || wayPoint.geometry == '') { errors++; }
                        });

                        $.extend(request, { waypoints: waypointsForRequest });

                        if ($('#avoidhighways').attr("checked")) {
                            $.extend(request, { avoidHighways: true });
                        }
                        if ($('#avoidtolls').attr("checked")) {
                            $.extend(request, { avoidTolls: true });
                        }

                        if (errors == 0) {
                            //perform directions request and display result
                            _SELF.directionsService = (_SELF.directionsService ? _SELF.directionsService : new google.maps.DirectionsService());
                            _SELF.directionsDisplay = (_SELF.directionsDisplay ? _SELF.directionsDisplay : new google.maps.DirectionsRenderer({
                                draggable: false
                            }));
                            _SELF.directionsDisplay.setPanel(document.getElementById('directions'));
                            _SELF.directionsDisplay.setMap(_SELF.map);

                            _SELF.directionsService.route(request, function (response, status) {
                                if (status == google.maps.DirectionsStatus.OK) {

                                    _SELF.currentLocationMarker ? _SELF.currentLocationMarker.setMap(null) : '';

                                    $('.dropdown-menu').hide();
                                    _SELF.directionsLegsDistance = [];
                                    var legs = response.routes[0].legs;
                                    for (var i = 0; i < legs.length; i++) {
                                        var leg = legs[i];
                                        _SELF.directionsLegsDistance.push({
                                            distance: leg.distance,
                                            duration: leg.duration
                                        });
                                    }
                                    _SELF.directionsDisplay.setDirections(response);
                                    google.maps.event.addListener(_SELF.directionsDisplay, 'directions_changed', function () {
                                        var response = _SELF.directionsDisplay.getDirections();
                                        _SELF.directionsLegsDistance = [];
                                        var legs = response.routes[0].legs;
                                        for (var i = 0; i < legs.length; i++) {
                                            var leg = legs[i];
                                            _SELF.directionsLegsDistance.push({
                                                distance: leg.distance,
                                                duration: leg.duration
                                            });
                                        }
                                    });
                                    $('#results').hide();
                                    $('#directions').show();
                                    $('#directions-toggle').addClass('active');
                                    $('#directions-btn').trigger('click');
                                    _SELF.loading(false);
                                } else {
                                    //error msg - directions failed
                                    $('#errors').html('').append('<div class="errorMessage directionsError">Directions request failed, please check your inputs.</div>');
                                    _SELF.loading(false);
                                }
                            });
                        }

                    }
                });
            }
        }
        return false;
    },

    allowedAddressTypes: [
        'street_number',
        'street_address',
        'route',
        'intersection',
        'political',
        'country',
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'locality',
        'sublocality',
        'neighborhood',
        'premise',
        'subpremise',
        'postal_code',
        'colloquial_area'
    ],
    filterAddresses: function (results, region) {
        //NT: special filtering rules applied to colloquial_area        
        var _SELF = this;
        var filtered_values = [];
        if (results != null) {
            //NT: if there is > 1 result then filter out colloquial_area (workaround suggested by Google)
            if (results.length > 1) {
                var newResults = [];
                for (var i = 0; i < results.length; i++) {
                    if ($.inArray('colloquial_area', results[i].types) == -1) {
                        newResults.push(results[i]);
                    }
                }
                results = newResults;
            }

            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                var numComponents = result.address_components.length;
                var types = result.types;
                var found = false;
                var addressAllowed = true;

                //check if this is an allowed address
                for (var l = 0; l < types.length; l++) {
                    if ($.inArray(types[l], _SELF.allowedAddressTypes) == -1) {
                        addressAllowed = false;
                    }
                }

                if (addressAllowed) {
                    for (var j = 0; j < numComponents && !found; j++) {
                        var component = result.address_components[j];
                        var types = component.types;
                        for (var k = 0; k < types.length && !found; k++) {
                            if (types[k] == 'country') {
                                if (component.long_name == region) {
                                    filtered_values.push(results[i]);
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                //reset
                addressAllowed = true;
            }
        }
        return filtered_values;
    },

    geocode: function (address, waypointNumber, isDirections, resultsCallback) {
        var _SELF = this;
        if (!this.geocoder) { this.geocoder = new google.maps.Geocoder(); }
        var request = {
            address: address.replace("%25", ""),
            region: "AU"
        };
        this.geocoder.geocode(request, function (results, status) {
            if (status == 'OK') {
                results = _SELF.filterAddresses(results, 'Australia');
                _SELF.filteredGeocodeResults = results;
                if (results.length == 1) {
                    resultsCallback(results[0], waypointNumber);
                } else {
                    //error msg                    
                    if (!isDirections) {
                        //search form                        
                        if (results.length > 1) {
                            //multiple results - search                             
                            $('#ddlMultipleAddresses').html('');
                            $('#multipleAddressDialog').find($('#multipleAddressDialog').find('#ddlMultipleAddresses').html(''));
                            $("<option/>").attr('value', '0').html('Choose an address:').appendTo($('#multipleAddressDialog').find('#ddlMultipleAddresses'));
                            if (results.length > 0) {
                                $.each(results, function (i, address) {
                                    $("<option/>").html(this.formatted_address).appendTo($('#multipleAddressDialog').find('#ddlMultipleAddresses'));
                                });
                                _SELF.multipleAddressDialog = $.colorbox({ href: "#multipleAddressDialog", inline: true, transition: "none", width: "380px", overlayClose: false, escKey: false, onLoad: function () { $('#cboxClose').remove(); } });
                            } else {
                                //error msg - no results came back
                                _SELF.displayException('No results found');
                                $('#loadingOverlay').hide();
                            }
                        } else {
                            //no results - search                            
                            $('#searchInp').addClass('error');
                            $('#searchInp').focus(function () {
                                $('#searchInp').removeClass('error');

                            });
                            _SELF.displayException('No results found');
                        }
                    } else {
                        //directions form error                        
                        if (results.length == 0) {
                            //error msg - no results came back
                            var count = 0;
                            $('#directionsFields .directionsitem input').each(function (key, value) {
                                if (count == waypointNumber) {
                                    $(this).parent().addClass('error');
                                    $(this).addClass('error');
                                    $(this).after('<div class="errorMessage directionsError" style="width: ' + $(this).width() + 'px;">No results found, please try a different input.</div>');
                                    $(this).focus(function () {
                                        $(this).val('');
                                        $(this).removeClass('error');
                                        $(this).parent().removeClass('error');
                                        $(this).parent().find('.directionsError').remove();
                                    });
                                }
                                count++;
                            });
                        }
                        else {
                            //error msg - multiple results
                            var count = 0;
                            $('#directionsFields .directionsitem input').each(function (key, value) {
                                if (count == waypointNumber) {
                                    $(this).parent().addClass('error');
                                    $(this).addClass('error');
                                    var htmlDDL = '<select class="multiResultSelect" id="multiResult' + waypointNumber + '"><option val="default">Select...</option>';
                                    $(results).each(function (key, value) {
                                        htmlDDL += '<option value="' + value.formatted_address + '">' + value.formatted_address + '</option>';
                                    });
                                    htmlDDL += '</select>';
                                    $(this).after('<div style="width: ' + $(this).width() + 'px;" class="errorMessage directionsError">Multiple results found:<div>' + htmlDDL + '</div></div>');
                                    $('#multiResult' + waypointNumber).change(function () {
                                        $(this).parent().parent().parent().find('input').val($(this).val());
                                        $(this).parent().parent().parent().find('input').removeClass('error');
                                        $(this).parent().parent().parent().removeClass('error');
                                        $(this).parent().parent().remove();
                                    });
                                }
                                count++;
                            });

                        }
                    }
                }
            }
            else {
                //error msg - no results came back
                if (!isDirections) {
                    $('#searchInp').addClass('error');
                    $('#searchInp-clear').hide();
                    $('#searchInp').focus(function () {
                        $('#searchInp').val('');
                        $('#searchInp').removeClass('error');
                    });
                    _SELF.displayException('No results found');
                } else {
                    var count = 0;
                    $('#directionsFields .directionsitem input').each(function (key, value) {
                        if (count == waypointNumber) {
                            $(this).addClass('error');
                            $(this).parent().addClass('error');
                            $(this).after('<div class="errorMessage directionsError" style="width: ' + $(this).width() + 'px;">No results found, please try a different input.</div>');
                            $(this).focus(function () {
                                $(this).val('');
                                $(this).removeClass('error');
                                $(this).parent().removeClass('error');
                                $(this).parent().find('.directionsError').remove();
                            });
                        }
                        count++;
                    });
                }
            }
        });
    },

    browserFix: function() {
        //ios6 

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
            var _SELF = this;
            google.maps.event.addListener(_SELF.map, 'click', function () {
                if (_SELF.clickInfoBox != null) { _SELF.clickInfoBox.close(); }
            });

            google.maps.event.addListener(_SELF.map, 'zoom_changed', function () { _SELF.loading(true); });
            google.maps.event.addListener(_SELF.map, 'dragstart', function () { _SELF.loading(true); });
            google.maps.event.addListener(_SELF.map, 'tilesloaded', function () { _SELF.loading(false); });
            google.maps.event.addListener(_SELF.map, 'idle', function () {
                setTimeout(function () {
                    _SELF.loading(false);
                }, 200);
            });

        } else {
            return null;
        }
    },

    autoCompleteOptions: {},
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
            autoCompleteFunction.initAutoComplete('#search-input', _SELF.autoCompleteOptions);
            //_SELF.loading(false);
            $('#current-location').trigger('click');
        }, 500);
    }

};
locator.initialize();
window.scrollTo(0, 0.5);