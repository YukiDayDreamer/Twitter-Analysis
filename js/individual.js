/* Initial map 
 * Generate function for dispaly density
 * */
var map, heatmap, dummymap;
var markers = [];
var id_flag; // Use to detect whether is single user or month
var loc; // The location dataset that is used right now
var infowindows = []; // information windows

function initMap() {
    // Change the style of map into gray level
    var light_grey_style = [{"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]}, {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]}, {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]}, {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]}, {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]}, {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]}, {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]}, {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {lat: 40.445, lng: -86.935},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
//                    styles: light_grey_style,
//        disableDefaultUI: true,
//                    zoomControl: true,
//                    zoomControlOptions: {
//                        position: google.maps.ControlPosition.LEFT_CENTER
//                    },
//                    scaleControl: true
    });

    //        // geojson of purdue campus
    //        map.data.loadGeoJson('raw_data/wl_pu_buildings.json');
    //        map.data.setStyle({
    //            fillColor: 'blue',
    //            fillOpacity: 0.5,
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
}

function initDummy() {
    dummymap = new esri.Map("dummymap", {
        basemap: "topo",
        center: [map.center.lng(), map.center.lat()],
        zoom: 13
    });

    google.maps.event.addListener(map, "center_changed", function () {
        var lat = map.center.lat();
        var lng = map.center.lng();
        var point = new esri.geometry.Point(lng, lat);
        dummymap.centerAt(point);
    });

    google.maps.event.addListener(map, "zoom_changed", function () {
        var zoom = map.getZoom();
        dummymap.setLevel(zoom);
    });


    var scalebar = new esri.dijit.Scalebar({
        map: dummymap,
        scalebarUnit: "metric"
    }, dojo.byId("scalebar"));

    var scalebar = document.getElementById('scalebar');
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(scalebar);

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

// Get Month ID
function getMonthID() {
    id_flag = this.id;
    var month = this.id;
    $.post(month_loc_url, {year: year, month: month}, function (data) {
        month_loc = eval(data);
    });
    document.getElementById("month-dropdown").innerHTML = month;
    document.getElementById("user-dropdown").innerHTML = "User";
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
var points = []; // Points by lon, lat
var length;
var all_day = [];
var all_week = [];

// Fetch user data according user id
function fetchUser() {
    ST_url = "php/Purdue/get_User_ST.php";
    user_id = this.id;
    id = [];
    minute = [];
    hour = [];
    weekday = [];
    points = [];
    text = [];
    length = 0;
    // Ajax request
    $.post(ST_url, {year: year, user_id: user_id}, function (data) {
        // JSON data decode
        var user_details = eval(data);
        // Array length
        length = user_details.length;
        // Translation
        for (var i = 0; i < length; i++) {
            // Get Data from JSON files
            id.push(user_details[i].id);
            date = new Date(user_details[i].epoch * 1000);
            minute.push(date.getMinutes());
            hour.push(user_details[i].hour);
            weekday.push(user_details[i].weekday);
            points.push([user_details[i].lat, user_details[i].lng]);
            text.push([user_details[i].text]);
        }
        ;
        getST_byHour();
    });
}

// Fetch month data
function fetchMonth() {
    ST_url = "php/Purdue/get_Month_ST.php";
    month = this.id;
    id = [];
    minute = [];
    hour = [];
    weekday = [];
    points = [];
    text = [];
    length = 0;
    // Ajax request
    $.post(ST_url, {year: year, month: month}, function (data) {
        // JSON data decode
        var month_details = eval(data);
        // Array length
        length = month_details.length;
        // Translation
        for (var i = 0; i < length; i++) {
            // Get Data from JSON files
            id.push(month_details[i].id);
            date = new Date(month_details[i].epoch * 1000);
            minute.push(date.getMinutes());
            hour.push(month_details[i].hour);
            weekday.push(month_details[i].weekday);
            points.push([month_details[i].lat, month_details[i].lng]);
            text.push([month_details[i].text]);
        }
        ;
        getST_byHour();
    });
}

// Get user st clustes by hour
function getST_byHour() {
    // Clustering
    all_day = {};
    // Cluster based on hour
    for (var hour_stamp = 0; hour_stamp < 24; hour_stamp++) {
        var dataset = {}; //  id - data object
        var time_span = {}; // id - minute object
        var text_data = {}; // id - text data
        var text_raw = ""; // raw txt
        var cluster_data = []; // data prepared for doing clustering
        var sub_id = []; // id
        // Sperate hourly data
        for (var i = 0; i < length; i++) {
            if (hour[i] === hour_stamp) {
                dataset[id[i]] = points[i];
                time_span[id[i]] = minute[i];
                text_data[id[i]] = text[i][0];
                text_raw += text[i][0] + " ";
                cluster_data.push(points[i]);
                sub_id.push(id[i]);
            }
        }
        // keywords of hour only first 20
        var hour_wf = wf.freq(text_raw, true, true);
        var hour_keywords = sortJson(hour_wf);
        if (hour_keywords.length > 20) {
            hour_keywords = hour_keywords.slice(0, 20);
        }
        // Clustering
        var hourly_length = cluster_data.length;
        var cls = dbscan(cluster_data, eps = 100, MinPts = 4); // use dbscan lib
//                    noise = dbscan.noise;
        // Build up cluster structure
        var hour_clusters = {};
        for (var cluster_id = 0; cluster_id < cls.length; cluster_id++) {
            var hour_cluster = {}; // Charateristics of cluster
            var hour_cluster_raw = []; // Raw point data
            var text_cluster = ""; // Text data of cluster
            var cluster_keywords = []; // keywords of cluster
            var center = {lat: 0, lng: 0}; // center
            var radius = 0; // Radius of cluster
            var time_start = 60; // Start time stamp of cluster
            var time_end = 0; // End time stamp of cluster

            // Calculate center and time span
            for (var item = 0; item < cls[cluster_id].length; item++) {
                true_id = sub_id[cls[cluster_id][item]];
                text_cluster += text_data[true_id] + " ";
                center.lat += dataset[true_id][0];
                center.lng += dataset[true_id][1];
                hour_cluster_raw.push(dataset[true_id]);
                time_start = Math.min(time_start, time_span[true_id]);
                time_end = Math.max(time_end, time_span[true_id]);
            }
            ;
            // keywords of cluster only first 5
            var cluster_wf = wf.freq(text_cluster, true, true); // 
            var cluster_keywords = sortJson(cluster_wf);
            if (cluster_keywords.length > 5) {
                cluster_keywords = cluster_keywords.slice(0, 5);
            }
            // Coordinates traslation
            center.lat = center.lat / cls[cluster_id].length;
            center.lng = center.lng / cls[cluster_id].length;

            // Calculate radius
            for (var i = 0; i < hour_cluster_raw.length; i++) {
                var d = dist(hour_cluster_raw[i], [center.lat, center.lng]);
                radius = Math.max(radius, d);
            }

            hour_cluster.center = center; // Center
            hour_cluster.radius = radius; // Radius
            hour_cluster.number = hour_cluster_raw.length; // Numbers
            hour_cluster.ratio = (hour_cluster_raw.length / hourly_length) * (time_end - time_start) / 60; // Ratio
            hour_cluster.time_start = time_start;
            hour_cluster.time_end = time_end;
            hour_cluster.keywords = cluster_keywords;

            hour_clusters[cluster_id] = hour_cluster; // JSON object order by cluster id
            hour_clusters.keywords = hour_keywords; // Keywords of the hour
        }
        ;
        all_day[hour_stamp] = hour_clusters; // JSON object order by hour stamp   
    }
    ;

    // Clear All
    clearAll();
    // Draw Stat Chart
    addChart();
    // Draw legends
    drawLegend();

    // Initialization of Hour stamp
    ccObject = document.getElementById("time_stamp");
    if (ccObject) {
        ccObject.innerHTML = "Midnight";
        time_counter = 0;
        drawST(time_counter);
    } else {
        alert("Object Not Found");
    }

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
function addChart() {
    chart_data = [];
    for (var i = 0; i < colors.length; i++) {
        chart_data.push(
                {
                    type: "stackedBar100",
                    showInLegend: true,
                    color: "#" + colors[i],
                    name: frequency_name[i],
                    dataPoints: []
                }
        );
    }

    for (var hour = 0; hour < 24; hour++) {

        // Initialization frequency array
        var ratio;
        var freq = new Array(5);
        for (var l = 0; l < freq.length; l++) {
            freq[l] = 0;
        }

        // Cluster number( without the keywords at the end)
        var cls_num = Object.keys(all_day[hour]).length - 1;
        for (var cls = 0; cls < cls_num; cls++) {
            ratio = all_day[hour][cls].ratio;
            if (ratio >= 0.5) {
                freq[0] += ratio;
            } else if (ratio > 0.35) {
                freq[1] += ratio;
            } else if (ratio > 0.2) {
                freq[2] += ratio;
            } else if (ratio > 0.05) {
                freq[3] += ratio;
            }
        }

        // freq[4] is unknown ratio
        freq[4] = 1 - (freq[0] + freq[1] + freq[2] + freq[3]);

        for (var k = 0; k < freq.length; k++) {
            chart_data[k].dataPoints.push(
                    {y: parseFloat((freq[k] * 100).toFixed(2)), label: hour}
            );
        }

    }

    // Plot chart
    chart = new CanvasJS.Chart("chartContainer",
            {
                title: {
                    text: "Tweeting Frequency",
                    fontSize: 22
                },
                axisY: {
                    title: "Percentage",
                    titleFontSize: 20,
                    labelFontSize: 15,
                    labelAngle: -45,
                },
                axisX: {
                    title: "Hour",
                    titleFontSize: 20,
                    labelFontSize: 15,
                    interval: 1
                },
                legend: {
                    fontSize: 18
                },
                animationEnabled: true,
                toolTip: {
                    shared: true,
                    content: "{name}: <strong>{y}%</strong>"
                },
                data: chart_data
            });

    chart.render();
}
// Test Case for chart UI

// Draw Legend
function drawLegend() {
    var legend = document.getElementById('legend');
    if (!legend) {  // it might be cleared by google maps's clear
        var legend = document.createElement('div');
        legend.id = 'legend';
    }
    if (!legend.firstChild) {
        var legend_title = document.createElement('h4');
        legend_title.setAttribute('id', 'legend_title');
        var legend_title_node = document.createTextNode('Probability');
        legend_title.appendChild(legend_title_node);
        legend.appendChild(legend_title);


        // Color Gradient and icon
        icon_names = [' >= 50%', '35 ~ 49%', '20 ~ 34%', '5 ~ 19%'];

        for (var i = 0; i < icon_names.length; i++) {
            var icon = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + colors[i];
            var name = icon_names[i];
            var div = document.createElement('div');
            div.innerHTML = '<img src="' + icon + '"> ' + name;
            legend.appendChild(div);
        }

        // push it the center right
        var legend = document.getElementById('legend');
        legend.style.opacity = 1;
        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(legend);


    }
}

// Draw circles and markers
var circles_para = [];
var circles = [];
var circlesBuffer = [];

document.onkeydown = jumpPage;

function jumpPage() {
    if (event.keyCode === 37)//左 
        display_prev();
    if (event.keyCode === 38)//上
        display_prev();
    if (event.keyCode === 39)//右 
        display_next();
    if (event.keyCode === 40)//下 
        display_next();
}

function display_prev() {
    time_counter -= 1;
    if (time_counter < 0) {
        time_counter += 24;
    }
    drawST(time_counter);
}

function display_next() {
    time_counter += 1;
    if (time_counter >= 24) {
        time_counter -= 24;
    }
    drawST(time_counter);
}

// Main Draw Function
function drawST(hour_24) {
    // Clear existed stuff
    clearST();

    var cc_start = hour_24;
    var cc_end = hour_24 + 1;
    // change 24 to 0
    if (cc_end === 24) {
        cc_end = 0;
    }
    // add 0 to hour of signle digit
    if (cc_start < 10) {
        cc_start = "0" + cc_start;
    }
    if (cc_end < 10) {
        cc_end = "0" + cc_end;
    }

    ccObject.innerHTML = cc_start + ":00 - " + cc_end + ":00";

//                if (hour_24 === 0) {
//                    ccObject.innerHTML = "Midnight";
//                } else if (hour_24 === 12) {
//                    ccObject.innerHTML = "Noon";
//                } else if (hour_24 < 12) {
//                    ccObject.innerHTML = hour_24 + " AM";
//                } else {
//                    ccObject.innerHTML = (hour_24 - 12) + " PM";
//                }

    var hour_circles = all_day[hour_24];
    var keys = Object.keys(hour_circles);
    if (keys.length <= 0) {
        //popup up funny hints when no classes
        ccObject.innerHTML = "No obvious pattern during " + ccObject.innerHTML;
    } else {
        document.getElementById("hint").innerHTML = "";
        for (var i = 0; i < keys.length - 1; i++) {
            circle_id = hour_circles[keys[i]];
            circles_para.push([circle_id.center, circle_id.radius,
                circle_id.number, circle_id.ratio, circle_id.keywords]);
        }
        drawCircles(circles_para);
    }

    $('#switch').css('display', 'block');  // enable switch
}

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

// Store infowindows for close all
function drawCircles(circles_para) {
    infowindows = [];

    for (var i = 0; i < circles_para.length; i++) {

        circle_center = circles_para[i][0];
        circle_radius = circles_para[i][1];
        circle_number = circles_para[i][2];
        circle_ratio = circles_para[i][3];
        circle_keywords = circles_para[i][4];

        if (circle_ratio >= 0.5) {
            PinColor = colors[0];
        } else if (circle_ratio > 0.35) {
            PinColor = colors[1];
        } else if (circle_ratio > 0.2) {
            PinColor = colors[2];
        } else if (circle_ratio > 0.05) {
            PinColor = colors[3];
        } else {
            continue;
        }

        pinImage = new google.maps.MarkerImage(
                "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|"
                + PinColor);

        circleOption = {
            strokeColor: "#" + PinColor,
            strokeOpacity: 0.95,
            strokeWeight: 2,
            fillColor: "#" + PinColor,
            fillOpacity: 0.35,
            map: map,
            center: circle_center,
            radius: circle_radius
        };

        keywords_text = "";
        for (var j = 0; j < circle_keywords.length; j++) {
            keywords_text += circle_keywords[j][0] + "  ";
        }

        ratio_text = (circle_ratio * 100).toFixed(2) + "%";
        radius_text = circle_radius.toFixed(2) + "m";
        infotext = '<div id="content">' +
                '<p><b>Number of Tweets:  </b>' + circle_number + '</p>' +
                '<p><b>Probability:  </b>' + ratio_text + '</p>' +
                '<p><b>Radius:  </b>' + radius_text + '</p>' +
                '<p><b>Keywords:  </b>' + keywords_text + '</p>' +
                '</div>';

        // info window
        var infowindow = new google.maps.InfoWindow({
            content: infotext
        });

        // marker with customized colors
        var marker_center = new google.maps.Marker({
            position: circle_center,
            map: map,
            icon: pinImage,
            infowindow: infowindow
        });

        // add click function event
        google.maps.event.addListener(marker_center, 'click', function () {
            for (var i = 0; i < infowindows.length; i++) {
                infowindows[i].close();
            }
            map.setCenter(this.getPosition());
            if (map.getZoom() < 13) {
                map.setZoom(13);
            }
            this.infowindow.open(map, this);
        });

        //circlesBuffer.push(new google.maps.Circle(circleBufferOption));
        circles.push(new google.maps.Circle(circleOption));
        markers.push(marker_center);
        infowindows.push(infowindow);

    }
}

// Calculate distance by two points
function dist(a, b) {
    var lat1 = a[0], lng1 = a[1], lat2 = b[0], lng2 = b[1];
    var toRadius = 0.017453292519943295;
    var R = 6371000; // radius in meter
    var dLat = (lat2 - lat1) * toRadius;
    var dLng = (lng2 - lng1) * toRadius;
    lat1 = lat1 * toRadius;
    lat2 = lat2 * toRadius;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

// Remove all the stuff
function clearAll() {

    // Remove Legend's children and its attribute
    var legend = document.getElementById('legend');
    while (legend.firstChild) {
        legend.removeChild(legend.firstChild);
    }
    // Remove Stat Chart
    var stat_chart = document.getElementById('chartContainer');
    while (stat_chart.firstChild) {
        stat_chart.removeChild(stat_chart.firstChild);
    }
    legend.style.opacity = 0;
    map.controls[google.maps.ControlPosition.RIGHT_CENTER].clear();

    // disable switch
    document.getElementById("time_stamp").innerHTML = "";
    $('#switch').css('display', 'none');

    // Remove possible Heatmap and s-t pattern(which contains clearMarkers)
    clearST();
}