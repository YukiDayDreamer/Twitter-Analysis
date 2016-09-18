/* Initial map 
 * Generate function for dispaly density
 * */
var map, submap, dynamicmap;
var heatmap, dynamic_heatmap;
var markers = [];
var submarkers = [];
var subcircle;
var id_flag; // Use to detect whether is single user or month
var loc; // The location dataset that is used right now
var paths = [];
var infowindows = [];       // information windows for main map
var subinfowindows = []; // information windows for submap
//var textController;


// init all maps
function initMap() {
    // Change the style of map into gray level
    var light_grey_style = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

    // main map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: map_center.lat, lng: map_center.lng},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
//        styles: light_grey_style,
//        disableDefaultUI: true,
//        zoomControl: true,
//        zoomControlOptions: {
//            position: google.maps.ControlPosition.LEFT_CENTER
//        },
//        scaleControl: true
    });

//        map.data.setStyle({
//            fillColor: 'blue',
//            fillOpacity: 0.3,
//            strokeColor: 'blue',
//            strokeOpacity: 0.5,
//            strokeWeight: 1
//        });
//        
//        var infowindow = new google.maps.InfoWindow();
//        map.data.addListener('click', function(event) {
//            map.data.revertStyle();
//            infowindow.setContent(
//                "<strong>Abbr: </strong>" + event.feature.getProperty('BLDG_ABBR') + "<br>" + 
//                "<strong>Full Name: </strong>" + event.feature.getProperty('BUILDING_N') + "<br>" + 
//                "<strong>Area: </strong>" + (event.feature.getProperty('Shape_Area') * 0.3048 * 0.3048).toFixed(2) + " m<sup>2</sup>"
//            );
//            infowindow.setPosition(event.latLng);
//            infowindow.setOptions({pixelOffset: new google.maps.Size(0,-34)});
//            infowindow.open(map);
//            map.data.overrideStyle(event.feature, {strokeWeight: 5});
//        });
//        map.data.addListener('mouseout', function(event) {
//            map.data.revertStyle();
//            infowindow.close();
//        });

    // sub-map
    submap = new google.maps.Map(document.getElementById('submap'), {
        zoom: 12,
        center: {lat: map_center.lat, lng: map_center.lng},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
//        styles: light_grey_style,
//        disableDefaultUI: true,
//        zoomControl: true,
//        zoomControlOptions: {
//            position: google.maps.ControlPosition.LEFT_CENTER
//        },
//        scaleControl: true
    });

    // main map
    dynamicmap = new google.maps.Map(document.getElementById('dynamic_map'), {
        zoom: 12,
        center: {lat: map_center.lat, lng: map_center.lng},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
//        styles: light_grey_style,
//        disableDefaultUI: true,
//        zoomControl: true,
//        zoomControlOptions: {
//            position: google.maps.ControlPosition.LEFT_CENTER
//        },
//        scaleControl: true
    });

}


// init dummy maps and scale bar through ESRI and eliminate the maps
function initDummy() {
    /* Main Map */
    var dummymapMainMap = new esri.Map("dummymap-MainMap", {
        basemap: "topo",
        center: [map.center.lng(), map.center.lat()],
        zoom: 13
    });

    var scalebarMainMap = new esri.dijit.Scalebar({
        map: dummymapMainMap,
        scalebarUnit: "metric"
    }, dojo.byId("scalebar-MainMap"));

    google.maps.event.addListener(map, "center_changed", function () {
        var lat = map.center.lat();
        var lng = map.center.lng();
        var point = new esri.geometry.Point(lng, lat);
        dummymapMainMap.centerAt(point);
    });

    google.maps.event.addListener(map, "zoom_changed", function () {
        var zoom = map.getZoom();
        dummymapMainMap.setLevel(zoom);
    });

    // insert into google map
    var scalebar = document.getElementById('scalebar-MainMap');
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(scalebar);


    /* Sub Map */
    var dummymapSubMap = new esri.Map("dummymap-SubMap", {
        basemap: "topo",
        center: [submap.center.lng(), submap.center.lat()],
        zoom: 13
    });

    var scalebarSubMap = new esri.dijit.Scalebar({
        map: dummymapSubMap,
        scalebarUnit: "metric"
    }, dojo.byId("scalebar-SubMap"));

    google.maps.event.addListener(submap, "center_changed", function () {
        var lat = submap.center.lat();
        var lng = submap.center.lng();
        var point = new esri.geometry.Point(lng, lat);
        dummymapSubMap.centerAt(point);
    });

    google.maps.event.addListener(submap, "zoom_changed", function () {
        var zoom = submap.getZoom();
        dummymapSubMap.setLevel(zoom);
    });

    // insert into google map
    var scalebar = document.getElementById('scalebar-SubMap');
    submap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(scalebar);


    /* Dynamic Map */
    var dummymapDynamicMap = new esri.Map("dummymap-DynamicMap", {
        basemap: "topo",
        center: [dynamicmap.center.lng(), dynamicmap.center.lat()],
        zoom: 13
    });

    var scalebarDynamicMap = new esri.dijit.Scalebar({
        map: dummymapDynamicMap,
        scalebarUnit: "metric"
    }, dojo.byId("scalebar-DynamicMap"));

    google.maps.event.addListener(dynamicmap, "center_changed", function () {
        var lat = dynamicmap.center.lat();
        var lng = dynamicmap.center.lng();
        var point = new esri.geometry.Point(lng, lat);
        dummymapDynamicMap.centerAt(point);
    });

    google.maps.event.addListener(dynamicmap, "zoom_changed", function () {
        var zoom = dynamicmap.getZoom();
        dummymapDynamicMap.setLevel(zoom);
    });

    // insert into google map
    var scalebar = document.getElementById('scalebar-DynamicMap');
    dynamicmap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(scalebar);
}

// Get User ID
function getUserID() {
    id_flag = this.id;
    var user_id = this.id;
    $.post(user_loc_url, {year: year, user_id: user_id}, function (data) {
        user_loc = eval(data);
    });
    document.getElementById("user-dropdown").innerHTML = "ID: " + user_id;
    document.getElementById("month-dropdown").innerHTML = "Month";
}

// Get the markers of the user data  
function dropSample() {
    if (isNaN(parseInt(id_flag))) {
        var loc = month_loc;
    } else {
        var loc = user_loc;
    }
    clearMarkers();
    if (loc.length > 50) {
        len = 50;
    } else {
        len = loc.length;
    }
    for (var i = 0; i < len; i++) {
        index = Math.round(loc.length * Math.random());
        addMarkerWithTimeout(loc[index], i * 50);
    }
}

function addMarkerWithTimeout(position, timeout) {
    window.setTimeout(function () {
        markers.push(new google.maps.Marker({
            position: position,
            map: map,
            icon: "img/twitter.png",
            animation: google.maps.Animation.DROP
        }));
    }, timeout);
}

function showAll() {
    // Check id
    var loc = id_check(id_flag);

    clearMarkers();
    for (var i = 0; i < loc.length; i++) {
        showAllMarkers(loc[i]);
    }
}

function showAllMarkers(position) {
    markers.push(new google.maps.Marker({
        position: position,
        map: map,
        icon: "img/twitter.png"
    }));
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// Create Heat Map
function createHeatmap() {
    // Check id
    var loc = id_check(id_flag);

    if (typeof (heatmap) !== "undefined") {
        clearHeatmap();
    }
    heatPoints = [];
    for (var i = 0; i < loc.length; i++) {
        heatPoints.push(new google.maps.LatLng(loc[i].lat, loc[i].lng));
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatPoints,
        map: map
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function clearHeatmap() {
    if (typeof heatmap !== "undefined") {
        heatmap.setMap(null);
    }
}

// Check the id is a month(str) or is user id(int)
function id_check(id) {
    if (isNaN(parseInt(id))) {
        loc = month_loc;
    } else {
        loc = user_loc;
    }
    return loc;
}
/* The code below is used to do clustering for every user
 * It is generated by DBSCAN Method in every hour
 */

// Init id, url and etc.
var ST_url;
var id = [];
var minute = [];
var hour = [];
var weekday = [];
var point_xy = []; // Points by x, y
var point_ll = []; // Points by lng, lat
var length;
var all_day = [];
var all_week = [];

function spinEffect(status) {
    // 1 for spining, 0 for stoping
    if (status === 1) {
        // add waiting layer to all box
        $(".load").append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
    } else {
        // remove waiting layer from all boxs
        $(".overlay").remove();
    }
}

// Fetch month data
function fetchMonth(year, month) {
    spinEffect(1);  // start spining

    /* init empty global variables */
    id = [];
    user_id = [];
    epoch = [];
    minute = [];
    hour = [];
    date = [];
    weekday = [];
    point_xyt = [];
    point_ll = [];
    text = [];
    text_raw = "";
    length = 0;
    // Ajax request
    $.post(month_ST_url, {year: year, month: month}, function (data) {
        var month_details = eval(data);  // encode josn data
        length = month_details.length;  // Array length
        /* init global variables */
        for (var i = 0; i < length; i++) {
            // Get Data from JSON files
            id.push(month_details[i].id);
            user_id.push(month_details[i].user_id);
            epoch.push(month_details[i].epoch);
            tmp_date = new Date(month_details[i].epoch * 1000);
            minute.push(tmp_date.getMinutes());
            hour.push(month_details[i].hour);
            date.push(month_details[i].date);
            weekday.push(month_details[i].weekday);
            point_xyt.push([month_details[i].x, month_details[i].y, month_details[i].epoch]);
            point_ll.push([month_details[i].lat, month_details[i].lng]);
            text.push([removeAt(month_details[i].text)]); // preprocessing: remove @someone
            text_raw += month_details[i].text;
        }

        /* Futher Processing */
        getST(epoch, date, point_xyt, text);  // ST-DBSCAN 
        getUT();  // Plot Temporal Chart
        spinEffect(0);  // stop spining
    });
}

// get t clustes by date
function getST(_epoch, _date, _point_xyt, _text) {
    // time record start
    time_tick = new Date();

    // Clustering
    cluster_month = {};


    // st-dbscan
    var eps1 = 100;
    var eps2 = 1800;
    var MinPts = 5;

    // new test field, group the points according to their date
    var label = _date[0];
    var a = {};
    var b = {};
    a[label] = [];
    b[label] = [];
    for (var i = 0; i < _point_xyt.length; i++) {
        if (date[i] === label) {
            a[label].push(_point_xyt[i]);
            b[label].push(i);
        } else {
            label = _date[i];
            a[label] = [];
            b[label] = [];
            a[label].push(_point_xyt[i]);
            b[label].push(i);
        }
    }

    for (var i = 0; i < Object.keys(a).length; i++) {
        var data = a[Object.keys(a)[i]];
//            //console.log(data);
        var label = b[Object.keys(b)[i]];
        var clusters = st_dbscan(data, eps1, eps2, MinPts);
//            //console.log(clusters);

        // Build up cluster structure for every date
        var cluster_date = [];       // Clusters for date
        for (var cluster_id = 0; cluster_id < clusters.length; cluster_id++) {
            var cluster = {};            // Charateristics of cluster
            var cluster_raw = [];        // Raw point data
            var text_cluster = "";       // Text data of cluster
            var cluster_keywords = [];   // keywords of cluster
            var center_lat = 0;          // lat of center
            var center_lng = 0;          // lng of center
            var radius = 0;              // Radius of cluster
            var time_start = 9999999999; // Start time stamp of cluster
            var time_end = 0;            // End time stamp of cluster
            var point_ids = [];          // point id in the cluster
            var point_id;
            var label_id;
            // Calculate center and time span
            for (var item_id = 0; item_id < clusters[cluster_id].length; item_id++) {
                point_id = clusters[cluster_id][item_id];   // point id in data for clustering
                label_id = label[point_id];                 // point id in point_xyt
                point_ids.push(label_id);
                text_cluster += _text[label_id] + " ";
                center_lat += point_ll[label_id][0];
                center_lng += point_ll[label_id][1];
                cluster_raw.push(point_ll[label_id]);
                time_start = Math.min(time_start, _epoch[label_id]);
                time_end = Math.max(time_end, _epoch[label_id]);
            }
            // keywords of cluster 
            var cluster_wf = wf.freq(text_cluster, noStopWords = true, shouldStem = false);
            var cluster_keywords = sortJson(cluster_wf);
            // only get first 5 hot words
            var cluster_keywords_display = cluster_keywords;
            if (cluster_keywords.length > 5) {
                cluster_keywords_display = cluster_keywords.slice(0, 5);
            }
            // Coordinates traslation
            center_lat = center_lat / clusters[cluster_id].length;
            center_lng = center_lng / clusters[cluster_id].length;

            // Calculate radius
            for (var j = 0; j < cluster_raw.length; j++) {
                var d = dist(cluster_raw[j], [center_lat, center_lng]);
                radius = Math.max(radius, d);
            }
            ;
            cluster.center = {lat: center_lat, lng: center_lng}; // Center
            cluster.radius = radius; // Radius
            cluster.number = cluster_raw.length; // Numbers
            cluster.time_start = new Date(time_start * 1000);
            cluster.time_end = new Date(time_end * 1000);
            cluster.keywords_5 = cluster_keywords_display;
            cluster.keywords_all = cluster_keywords;
            cluster.points = point_ids; // id of point data

            cluster_date.push(cluster); // JSON object order by cluster id
        }
        ;
        // if length of cluster is 0, cluster_date will be empty
        if (cluster_date.length !== 0) {
            cluster_month[Object.keys(a)[i]] = cluster_date;
        }
    }
//        //console.log(cluster_month);

    // time record end
    time_tock = new Date();
    time_gap = time_tock.getSeconds() - time_tick.getSeconds();
    //console.log("Processing Time: " + time_gap + "s");

    clearAll();  // Clear All
    drawLegend();  // Draw legends
    drawST(cluster_month);  // Draw Map
    slider_change();  // Listen to Slider Change
}


/* UI part of the webpage
 * Display Clusters' Points in circles
 * Be careful about async problem 
 */
// Color Bar for legend and markers
var colors = ['D2534F', 'FFD174', '9CFF9C', '6BD0EE', '777777']; // Black at last
// Initialization of data chart
var chart;
var chart_data = [];
var frequency_name = ["Frequently", "Often", "Sometimes", "Rarely", "Unknown"];

// Draw Legend
function drawLegend() {
    var legend = document.getElementById('legend');
    legend.style.background = "white";
    if (!legend.firstChild) {
        var legend_title = document.createElement('h4');
        legend_title.setAttribute('id', 'legend_title');
        var legend_title_node = document.createTextNode('# Tweets');
        legend_title.appendChild(legend_title_node);
        legend.appendChild(legend_title);

        // Color Gradient and icon
        icon_names = [' >50', '49 ~ 30', '29 ~ 10', '<10'];
        var range = [[99999, 50], [49, 30], [29, 10], [9, 0]];

        for (var i = 0; i < icon_names.length; i++) {
            var icon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colors[i];
            var name = icon_names[i];
            var img = '<img src="' + icon + '"> ' + name;
            var div = '<div class=><input range = "' + range[i] + '" tabindex="1" type="checkbox" id="check-' + i + '" checked>' + img + '</div>';
            // append to html
            $("#legend").append(div);
            // event listen to checkbox
            document.getElementById('check-' + i).addEventListener('change', visible_check);
        }
    }
}


// Draw circles and markers
var circles_para = [];
var circles = [];
var circlesBuffer = [];

// Remove elements related to ST Pattern
function clearST() {
    // Remove Circle
    for (var i = 0; i < circles.length; i++) {
        circles[i].setMap(null);
        //circlesBuffer[i].setMap(null);
    }

    // Empty paras
    circles_para = [];
    circles = [];
    //circlesBuffer = [];
    clearMarkers();
}

// Main Draw Function
function drawST(cluster_month) {
    // Clear existed stuff
    clearST();
    infowindows = [];
    for (var i = 0; i < Object.keys(cluster_month).length; i++) {
        var cluster_date = cluster_month[Object.keys(cluster_month)[i]];

        for (var j = 0; j < cluster_date.length; j++) {
            var circle = cluster_date[j];

            var circle_center = circle.center;
            var circle_radius = circle.radius;
            var circle_number = circle.number;
            var circle_time_start = circle.time_start;
            var circle_time_end = circle.time_end;
            var circle_keywords_5 = circle.keywords_5;
            var circle_keywords_all = circle.keywords_all;
            var circle_points = circle.points;

            var PinColor;
            if (circle_number >= 50) {
                PinColor = colors[0];
            } else if (circle_number >= 30) {
                PinColor = colors[1];
            } else if (circle_number >= 10) {
                PinColor = colors[2];
            } else {
                PinColor = colors[3];
            }

            var pinImage = new google.maps.MarkerImage(
                    "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
                    + PinColor);

            //            circleOption = {
            //                strokeColor: "#" + PinColor,
            //                strokeOpacity: 0.95,
            //                strokeWeight: 2,
            //                fillColor: "#" + PinColor,
            //                fillOpacity: 0.35,
            //                map: map,
            //                center: circle_center,
            //                radius: circle_radius
            //            };

            // text prepare
            var keywords_text = "";
            for (var k = 0; k < circle_keywords_5.length; k++) {
                keywords_text += circle_keywords_5[k][0] + "  ";
            }
            var circle_time_start_text =
                    circle_time_start.toLocaleTimeString().slice(0, 11) + ', ' + circle_time_start.toLocaleDateString();
            var circle_time_end_text =
                    circle_time_end.toLocaleTimeString().slice(0, 11) + ', ' + circle_time_end.toLocaleDateString();
            var radius_text = circle_radius.toFixed(2) + " m";

            // construct info window
            var infotext = '<div id="content">' +
                    '<p><b># Tweets:  </b>' + circle_number + '</p>' +
                    '<p><b>Radius:  </b>' + radius_text + '</p>' +
                    '<p><b>Start from:  </b>' + circle_time_start_text + '</p>' +
                    '<p><b>End at:  </b>' + circle_time_end_text + '</p>' +
                    '<p><b>Keywords:  </b>' + keywords_text + '</p>' +
                    '</div>';

            // info window
            var infowindow = new google.maps.InfoWindow({
                content: infotext,
                maxWidth: 300
            });

            // marker with customized colors
            var marker_center = new google.maps.Marker({
                position: circle_center,
                radius: circle_radius,
                map: map,
                icon: pinImage,
                infowindow: infowindow,
                num: circle_number,
                points: circle_points,
                keywords: circle_keywords_all,
                time_start: circle_time_start,
                time_end: circle_time_end
            });

            // add click function event
            google.maps.event.addListener(marker_center, 'click', function () {
                for (var j = 0; j < infowindows.length; j++) {
                    infowindows[j].close();
                }

                // reset map center and zoom level
                map.setCenter(this.getPosition());
                if (map.getZoom() < 13) {
                    map.setZoom(13);
                }
                this.infowindow.open(map, this);
                // init sub map
                plot_submap(this.getPosition(), this.points, this.radius, this.keywords, this.time_start, this.time_end);
            });

            //            circlesBuffer.push(new google.maps.Circle(circleBufferOption));
            //            circles.push(new google.maps.Circle(circleOption));
            markers.push(marker_center);
            infowindows.push(infowindow);
        }
    }
}

// Calculate distance by two points
function dist(a, b) {
    // approximation
    // var toRadius = 0.017453292519943295;
    var lat1 = a[0], lng1 = a[1], lat2 = b[0], lng2 = b[1];
    var R = 6371000; // radius of earth in meter
    var toRadius = 0.0174533;
    var meanLat = (lat1 + lat2) * toRadius / 2;
    var x = (lng2 - lng1) * Math.cos(meanLat);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R * toRadius;

    return d;
}

// Remove all the stuff
function clearAll() {

    // Remove Legend's children and its attribute
    var legend = document.getElementById('legend');
    while (legend.firstChild) {
        legend.removeChild(legend.firstChild);
    }

    // Remove possible Heatmap and s-t pattern(which contains clearMarkers)
    clearST();
}

function clearSubcircle() {
    // Remove Circle in Sub Map
    if (typeof (subcircle) !== "undefined") {
        subcircle.setMap(null);
    }
}

// plot in sub map
function plot_submap(center, point_ids, radius, keywords, time_start, time_end) {
    // clear
    clear_submap();
    clearSubcircle();

    // set center and zoom level
    submap.setCenter(center);
    if (submap.getZoom() < 15) {
        submap.setZoom(15);
    }

    // plot center
    submarkers.push(new google.maps.Marker({
        position: center,
        map: submap,
        animation: google.maps.Animation.DROP
    }));
//               
//        // plot circle for the points
//        subcircle = new google.maps.Circle({
//            strokeColor: '#FF0000',
//            strokeOpacity: 0.8,
//            strokeWeight: 2,
//            fillColor: '#FF0000',
//            fillOpacity: 0.1,
//            map: submap,
//            center: center,
//            radius: radius
//        });

    // use time_zone_seperate funciton to get time chart var
    var zone_result = time_zone_seperate(time_start, time_end);
    var zone_start = zone_result.zone_start;
    var time_zone = zone_result.time_zone;

    // heat map data points
    var heatmap_points = [];

    // construct infowindow
    for (var i = 0; i < point_ids.length; i++) {
        // text prepare
        var tweet = urlify(text[point_ids[i]][0]);
        var time_stamp = new Date(epoch[point_ids[i]] * 1000);
        var time_stamp_text =
                time_stamp.toLocaleTimeString().slice(0, 11) + ', ' + time_stamp.toLocaleDateString();

        // confirm time zone
        var time_zone_label = parseInt((epoch[point_ids[i]] - zone_start) / 1800);
        time_zone[time_zone_label] += 1;

        // posistion
        var pos = {lat: point_ll[point_ids[i]][0], lng: point_ll[point_ids[i]][1]};

        // heatmap point data
        heatmap_points.push(new google.maps.LatLng(pos));
//            // construct info window
//            infotext ='<div id="content">'+
//                    '<p><b>Time:  </b>' + time_stamp_text + '</p>' +
//                    '<p><b>Tweet:  </b>' + tweet + '</p>' +
//                    '</div>';
//
//            // info window
//            var infowindow = new google.maps.InfoWindow({
//                content: infotext,
//                maxWidth: 200
//            });
//            subinfowindows.push(infowindow);
//            
//            // create marker
//            var submarker = new google.maps.Marker({
//                 position: pos,
//                 map: submap,
//                 icon: "img/twitter.png",
//                 animation: google.maps.Animation.DROP,
//                 infowindow: infowindow
//            });
//            
//            // add event listener
//            google.maps.event.addListener(submarker, 'click', function() {
//                for(var i =  0; i < subinfowindows.length; i++){
//                    subinfowindows[i].close();
//                }
//                submap.setCenter(this.position);
//                this.infowindow.open(submap, this);
//            });
//            
//            // store in marker array
//            submarkers.push(submarker);
    }
    if (typeof (heatmap) !== "undefined") {
        heatmap.setMap(null);
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmap_points,
        map: submap
    });
    // plot time chart for sub map
    plot_sub_time_chart(zone_start, time_zone, "cluster_timeChart");
    // plot word frequency for sub map
    plot_word_chart(keywords, "cluster_wordChart");
//    // plot hot word time chart
//    var key_point_ids;
//    key_point_ids = plot_hot_word_time_chart(time_start, time_end, point_ids, keywords, "hotword_timeChart");
    //console.log(key_point_ids);
    // plot dynamic map
    dynamicMapController = new DynamicMapController(time_start, time_end, center, point_ids);
    // text of the Tweets
    $('#topics').html("");
    textController = new TextController(point_ids);
}

// controller of text
var TextController = function (point_ids) {

    // unit test usage:
//    $('#month_chart').height(1);
//    $('#submap').height(1);
//    $('#cluster_timeChart').height(1);
//    $('#cluster_wordChart').height(1);
//    $('#twitter_text').height(1);
//    $('#twitter_text').css('max-height', 1);
//    $('#dynamic_map').height(1);

    // data preparation
    var sentences = [];
    for (var i = 0; i < point_ids.length; i++) {
        sentences.push(text[point_ids[i]][0]);
    }
    var len = sentences.length;

    // display text information
    this.displayText = function () {
        var li = '';
        for (var i = 0; i < len; i++) {
            li += ('<li>' + sentences[i] + '</li>');
        }
        var ul = '<ul>' + li + '</ul>';
        $('#twitter_text').html(ul);
    };

    // LDA
    this.toTopic = function () {
        var documents = new Array();
        var f = {};
        var vocab = new Array();
        var docCount = 0;
        for (var i = 0; i < sentences.length; i++) {
            if (sentences[i] === "")
                continue;
            var words = sentences[i].split(/[\s,\"]+/);
            if (!words)
                continue;
            var wordIndices = new Array();
            for (var wc = 0; wc < words.length; wc++) {
                var w = words[wc].toLowerCase().replace(/[^a-z\'A-Z0-9 ]+/g, '');
                //TODO: Add stemming
                if (w === "" || w.length === 1 || stopwords[w] || w.indexOf("http") === 0)
                    continue;
                if (f[w]) {
                    f[w] = f[w] + 1;
                }
                else if (w) {
                    f[w] = 1;
                    vocab.push(w);
                }
                ;
                wordIndices.push(vocab.indexOf(w));
            }
            if (wordIndices && wordIndices.length > 0) {
                documents[docCount++] = wordIndices;
            }
        }

        var V = vocab.length;
        var M = documents.length;
        var K = parseInt($("#numberOfTopics").val());  // number of topics, init: 2
        var alpha = 0.1;  // per-document distributions over topics
        var beta = 0.01;  // per-topic distributions over words

        lda.configure(documents, V, 10000, 2000, 100, 10);
        lda.gibbs(K, alpha, beta);

        // construction of every sentense
        // n *  topic numbers: ratio of every sentence in every topic 
        theta = lda.getTheta();
        // construction of every words
        // n * words numbers: ratio of every words in every topic
        phi = lda.getPhi();

        //topics
        var topTerms = 15;
        topicText = new Array();
        topicColor = [
            '#FF0000', '#0000FF', '#00FF00', '#B93B8F',
            '#FFA500', '#808000', '#A52A2A'];
        for (var k = 0; k < phi.length; k++) {
            var tuples = new Array();
            for (var w = 0; w < phi[k].length; w++) {
                tuples.push("" + phi[k][w].toPrecision(3) + "_" + vocab[w]);
            }
            tuples.sort().reverse();
            if (topTerms > vocab.length)
                topTerms = vocab.length;
            topicText[k] = {oldOrder: k, ratioSum: 0, dataPoints: []};
            for (var t = 0; t < topTerms; t++) {
                var topicTerm = tuples[t].split("_")[1];
                var ratio = parseFloat((tuples[t].split("_")[0] * 100).toFixed(1));
                if (ratio < 0.0001)
                    continue;
                console.log("topic " + k + ": " + topicTerm + " = " + ratio + "%");
                topicText[k].ratioSum += ratio;
                topicText[k].dataPoints.push({word: topicTerm, ratio: ratio});
            }
        }

        topicText = sortByKey(topicText, 'ratioSum');
        topicDict = {};  // {old : new}, find the new position of topics
        for (var newOrder = 0; newOrder < topicText.length; newOrder++) {
            var oldOrder = topicText[newOrder].oldOrder;
            topicDict[oldOrder] = newOrder;
        }
        // plot topics and sentences
        this.plot();

    };

    // plot words of topic
    this.plot = function () {

        // init topics DOM
        var topicHtmlText = "";
        for (var i = 0; i < topicText.length; i++) {
            var topicID = i + 1;
            topicHtmlText +=
                    '<section class="col-lg-4">' +
                    '<div class="box box-success">' +
                    '<div class="box-header with-border">' +
                    '<h3 class="box-title">Topic ' + topicID + '</h3>' +
                    '</div>' +
                    '<div class="box-body">' +
                    '<div id="topic-' + topicID + '" class="topic_chart">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</section>';

        }
        // append to DOM
        $('#topics').html(topicHtmlText);
        // plot topics
        for (var i = 0; i < topicText.length; i++) {
            plot_topic(topicText[i], topicColor[i], "topic-" + (i + 1));
        }


        // init centences DOM
        var sentenceHtmlHead =
                '<section class="col-lg-12">' +
                '<div class="box box-success">' +
                '<div class="box-header with-border">' +
                '<h3 class="box-title">Sentence Construction</h3>' +
                '</div>' +
                '<div class="box-body">' +
                '<div id="sentences" class="sentences">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</section>';
        $("#topics").append(sentenceHtmlHead);
        var sentenceHtmlText = "";
        //highlight sentences	
        for (var num = 0; num < theta.length; num++) {
            sentenceHtmlText += '<div class="lines">';
            sentenceHtmlText += '<div style="display:table-cell;width:100px;padding-right:5px">';
            for (var topicID = 0; topicID < theta[num].length; topicID++) {
                var newOrder = topicDict[topicID];
                sentenceHtmlText += ('<div class="cellOfLine bgcolor' + topicID +
                        '" style="width:' +
                        parseInt("" + (theta[num][newOrder] * 100)) + 'px" title="' +
                        parseInt("" + (theta[num][newOrder] * 100)) + '%"></div>');
            }
            sentenceHtmlText += '</div>' + sentences[num] + '</div>';
        }
        $("#sentences").append(sentenceHtmlText);

    };

    // init
    this.displayText();
//    this.toTopic();
};



//    function plot_dynamic_map(time_start, time_end, center, key_point_ids) {
//        // reset center
//        dynamicmap.setCenter(center);
//        if (dynamicmap.getZoom() < 15){
//            dynamicmap.setZoom(15);
//        }
//        key_point_ids; // variable from the result of hot word time chart, temporary try
//         
//        // could reuse this part of code
//        var zone_result = time_zone_seperate(time_start, time_end);
//        var zone_start = zone_result.zone_start;
//        var time_zone = zone_result.time_zone;
//        //console.log(zone_start);
//        
//        var time_stamp = [];
//        for(var i=0; i<key_point_ids.length; i++) {
//            var label = parseInt((epoch[key_point_ids[i]] - zone_start) / 1800);
//            time_stamp.push(label);
//        }
//        
//        temporal_map_paras = {
//            zone_start: zone_start, 
//            periods: time_zone.length, 
//            point_ids: key_point_ids
//        };
//        
//        // generate dynamic map
//        dynamic_markers = [];    
//    }


/* Dynamic Map Related */
var DynamicMapController = function (time_start, time_end, center, point_ids) {
    var time_start = time_start;
    var time_end = time_end;
    var center = center;
    var point_ids = point_ids;

    // plot dynamic map
    this.run = function () {

        // reset center
        dynamicmap.setCenter(center);
        if (dynamicmap.getZoom() < 15) {
            dynamicmap.setZoom(15);
        }

        // generate all marker
        dynamic_markers = [];
        for (var i = 0; i < point_ids.length; i++) {
            var pos = {lat: point_ll[point_ids[i]][0], lng: point_ll[point_ids[i]][1]};

            var dynamic_marker = new google.maps.Marker({
                position: pos,
                map: dynamicmap,
                icon: "img/twitter.png"
            });
            dynamic_marker.setVisible(false);
            dynamic_markers.push(dynamic_marker);
        }

        point_ids; // variable from the result of hot word time chart, temporary try

        // could reuse this part of code
        var interval = parseInt($('#interval_selector').val()); // user' selection of interval
        var num_zone = time_zone_seperate_random(time_start, time_end, interval);
        var zone_start = time_start.getTime() / 1000;

        dynamic_map_plt_paras = {
            zone_start: zone_start,
            interval: interval,
            periods: num_zone,
            point_ids: point_ids
        };

        // plot markers
        plotMarkersWithTimeout(0);
//        // plot heatmap
//        plotHeatmapWithTimeout(0);
    };
};


///* OOP Try */
//var plotMarkersWithTimeout = function () {
//    this.zone_start = dynamic_map_plt_paras.zone_start;
//    this.gap_second = dynamic_map_plt_paras.gap * 60; // gap in second
//    this.periods = dynamic_map_plt_paras.periods;
//    this.point_ids = dynamic_map_plt_paras.point_ids;
//    this.start = function (i) {
//        if (i < this.periods) {
//            window.setTimeout(function () {
//                // what is this right now?
//                // change indicator of time stamp
//                var time_stamp_start = new Date((zone_start + i * gap_second) * 1000);
//                var time_stamp_end = new Date((zone_start + (i + 1) * gap_second) * 1000);
//
//                //                //console.log(time_stamp_start);
//
//                var start_minute = time_stamp_start.getMinutes();
//                var start_hour = time_stamp_start.getHours();
//                var end_minute = time_stamp_end.getMinutes();
//                var end_hour = time_stamp_end.getHours();
//
//                if (String(start_minute).length === 1) {
//                    start_minute = "0" + start_minute;
//                }
//                if (String(end_minute).length === 1) {
//                    end_minute = "0" + end_minute;
//                }
//
//                $("#time_stamp").html(
//                        start_hour + " : " + start_minute + " - " +
//                        end_hour + " : " + end_minute
//                        );
//
//                var time_start_epoch = time_stamp_start.getTime() / 1000;
//                var time_end_epoch = time_stamp_end.getTime() / 1000;
//
//                // set point visible according to periods
//                for (var j = 0; j < point_ids.length; j++) {
//                    if (epoch[point_ids[j]] >= time_start_epoch && epoch[point_ids[j]] <= time_end_epoch) {
//                        dynamic_markers[j].setVisible(true);
//                    } else {
//                        dynamic_markers[j].setVisible(false);
//                    }
//                }
//
//                i++;
//                start(i);
//
//            }, 2000);
//        }
//    };
//};
///* End of OOP Try */

// Plot Marker, Function Only 
function plotMarkersWithTimeout(i) {
    var zone_start = dynamic_map_plt_paras.zone_start;
    var interval = dynamic_map_plt_paras.interval; // gap in minute
    var interval_second = interval * 60; // gap in second
    var periods = dynamic_map_plt_paras.periods;
    var point_ids = dynamic_map_plt_paras.point_ids;

    if (i < periods) {
        window.setTimeout(function () {

            // change indicator of time stamp
            var time_stamp_start = new Date((zone_start + i * interval_second) * 1000);
            var time_stamp_end = new Date((zone_start + (i + 1) * interval_second) * 1000);

//                //console.log(time_stamp_start);

            var start_minute = time_stamp_start.getMinutes();
            var start_hour = time_stamp_start.getHours();
            var end_minute = time_stamp_end.getMinutes();
            var end_hour = time_stamp_end.getHours();

            if (String(start_minute).length === 1) {
                start_minute = "0" + start_minute;
            }
            if (String(end_minute).length === 1) {
                end_minute = "0" + end_minute;
            }

            $("#time_stamp").html(
                    start_hour + " : " + start_minute + " - " +
                    end_hour + " : " + end_minute
                    );

            var time_start_epoch = time_stamp_start.getTime() / 1000;
            var time_end_epoch = time_stamp_end.getTime() / 1000;

            // set point visible according to periods
            for (var j = 0; j < point_ids.length; j++) {
                if (epoch[point_ids[j]] >= time_start_epoch && epoch[point_ids[j]] <= time_end_epoch) {
                    dynamic_markers[j].setVisible(true);
                } else {
                    dynamic_markers[j].setVisible(false);
                }
            }

            i++;
            plotMarkersWithTimeout(i);

        }, 2000);
    }
}
// End of Funcitno Only

//// plot Heat Map
//function plotHeatmapWithTimeout(i) {
//    var zone_start = temporal_map_paras.zone_start;
//    var periods = temporal_map_paras.periods;
//    var point_ids = temporal_map_paras.point_ids;
//
//    function start(i) {
//        if (i < periods) {
//            window.setTimeout(function () {
//
//                // clear old heat map
//                if (typeof (dynamic_heatmap) !== "undefined") {
//                    dynamic_heatmap.setMap(null);
//                }
//
//                // change indicator of time stamp
//                var time_stamp_start = new Date((zone_start + periods * 1800) * 1000);
//                var time_stamp_end = new Date((zone_start + (periods + 1) * 1800) * 1000);
//
//                $("time_stamp").html(
//                        time_stamp_start.getHours() + " : " + time_stamp_start.getMinutes() + " - " +
//                        time_stamp_end.getHours() + " : " + time_stamp_end.getMinutes() + " - "
//                        );
//
//                var time_start_epoch = time_stamp_start.getTime() / 1000;
//                var time_end_epoch = time_stamp_end.getTime() / 1000;
//
//                // create heatmap
//                var heatmap_points = [];
//                for (var j = 0; j < point_ids.length; j++) {
//                    if (epoch[point_ids[j]][0] >= time_start_epoch && epoch[point_ids[j]][0] <= time_end_epoch) {
//                        heatmap_points.push(new google.maps.LatLng(point_ll[point_ids[j]][1], point_ll[point_ids[j]][0]));
//                    }
//                }
//
//                dynamic_heatmap = new google.maps.visualization.HeatmapLayer({
//                    data: heatmap_points,
//                    map: dynamicmap
//                });
//
//                i++;
//                start(i);
//
//            }, 2000);
//        }
//    }
//}
/* End of Dynamic Map Related */

/* Prepare for the time zone array */
// time stamp range interval = 30-minutes / 1800s
function time_zone_seperate(start, end) { // start, end are epoch time
    var a = start.getTime() / 1000;
    var b = end.getTime() / 1000;
    var zone_num = parseInt((b - a) / 1800 + 2);

    // new an array
    var time_zone;
    if (zone_num < 1) {
        zone_num = 1;
    }
    time_zone = Array.apply(null, Array(zone_num)).map(Number.prototype.valueOf, 0);
    // check which minute zone it is (0~30, 30~59)
    var zone;
    switch (parseInt(start.getMinutes() / 30)) {
        case 0:
            zone = 0;
            break;
        case 1:
            zone = 1;
            break;
        case 2:
            zone = 2;
            break;
        case 3:
            zone = 3;
            break;
    }
    // start.getYear will return a number larger than 100, should be recalculated
    var year = start.getYear() - 100 + 2000;
    var zone_start = new Date(year, start.getMonth(), start.getDate(), start.getHours(), zone * 30);
    zone_start = zone_start.getTime() / 1000;

    // return the start of the zone, num of the zone, and relative array
    return {zone_start: zone_start, time_zone: time_zone};
}

function time_zone_seperate_random(start, end, gap) { // start, end are date; gap is minute
    // clean up the end of number
    start.setSeconds(0);
    start.setMilliseconds(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    var num_zones = Math.ceil(((end.getTime() - start.getTime()) / 1000 / 60 + 1) / gap); // num of zones in between
    return num_zones;
}

// clear sub map  
function clear_submap() {
    while (submarkers.length !== 0) {
        submarkers.pop().setMap(null);
    }
}


// Get relation between User and Overall Number
function getUT() {
    // label and relative number
    var period = [];
    var num = [];
    var users = [];
    // individual label 
    var label = date[0];
    var counter = 0;
    var user = [];
    for (var i = 0; i < date.length; i++) {
        if (date[i] === label) {
            user.push(user_id[i]);
            counter++;
        } else {
            // store
            period.push(label);
            num.push(counter);
            users.push(user.filter(unique).length);
            // update
            label = date[i];
            counter = 1;
            user = [];
        }
    }
    // last one class
    period.push(label);
    num.push(counter);
    users.push(user.filter(unique).length);
    // plot time chart
    plot_time_chart(period, num, users, "month_chart");
}


// check box event listerner
function visible_check(event) {
    // get range through attribute
    var range = this.getAttribute("range");
    var max = parseInt(range.split(",")[0]);
    var min = parseInt(range.split(",")[1]);
    if (this.checked) {
        for (var j = 0; j < markers.length; j++) {
            if (markers[j].num <= max && markers[j].num >= min) {
                markers[j].setVisible(true);
            }
        }
    } else {
        for (var j = 0; j < markers.length; j++) {
            if (markers[j].num <= max && markers[j].num >= min) {
                markers[j].setVisible(false);
            }
        }
    }
}

/* BOOTSTRAP SLIDER */
function slider_change() {
    $('#date_picker').slider().on('slideStop', function (e) {
        var range = $('#date_picker').data('slider').getValue();
        var min = range[0], max = range[1];
        for (var i = 0; i < markers.length; i++) {
            if ((markers[i].time_start.getDate() >= min && markers[i].time_start.getDate() <= max) ||
                    (markers[i].time_end.getDate() >= min && markers[i].time_end.getDate() <= max)) {
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }
    });
}

// remove @someone in Tweet
function removeAt(text) {
    return text.replace(/\@\w+/g, '');
}

// find the url in the text
function urlify(t) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return t.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank"' + '">' + url + '</a>';
    });
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

// unique an array
function unique(value, index, self) {
    return self.indexOf(value) === index;
}