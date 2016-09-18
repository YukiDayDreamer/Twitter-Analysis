
// plot time chart for main map
function plot_time_chart(period, num, users, chart_id) {
    /* CanvasJS
     * -------
     * Here we will create a few charts using CanvasJS
     */

    var dataPoints_num = [];
    var dataPoints_users = [];

    for (var i = 0; i < period.length; i++) {
        dataPoints_num.push({x: period[i], y: num[i]});
        dataPoints_users.push({x: period[i], y: users[i]});
    }

    // custom color
    CanvasJS.addColorSet("light-blue", ["#59C3E2"]);

    var chart = new CanvasJS.Chart(chart_id,
            {
//          colorSet: "light-blue",

                title: {
                    text: ""
                },
                data: [
                    {
                        type: "line",
                        showInLegend: true,
                        legendText: "Tweets",
                        dataPoints: dataPoints_num
                    },
                    {
                        type: "line",
                        showInLegend: true,
                        legendText: "Individual Users",
                        dataPoints: dataPoints_users
                    }
                ],
                axisX: {
                    interval: 1,
                    title: "Date",
                    titleFontSize: 20,
                    labelFontSize: 12,
                    labelAngle: -60
                },
                axisY: {
                    title: "Number",
                    titleFontSize: 20,
                    labelFontSize: 12
                },
//          legend: {
//            horizontalAlign: "right", 
//            verticalAlign: "center", 
//            fontSize: 12
//          }
            });

    chart.render();
}

// plot time chart for sub map
function plot_sub_time_chart(zone_start, time_zone, chart_id) {
    /* CanvasJS
     * -------
     * Here we will create a few charts using CanvasJS
     */

    var dataPoints_num = [];
//        var dataPoints_users = [];

    for (var i = 0; i < time_zone.length; i++) {
        // put data point in the middle of half an hour, that is why add 900
        if (time_zone[i] > 0) {
            dataPoints_num.push({x: new Date((zone_start + 1800 * i + 900) * 1000), y: time_zone[i]});
//              dataPoints_users.push({x: period[i], y:users[i]});
        }
    }

    // custom color
    CanvasJS.addColorSet("pink", ["#ff695e"]);

    var chart = new CanvasJS.Chart(chart_id,
            {
                colorSet: "pink",
                title: {
                    text: ""
                },
                data: [
                    {
                        type: "column",
//            showInLegend: true,
//            legendText: "Number of Tweets",
                        dataPoints: dataPoints_num,
                    },
//          {        
//            type: "line",
//            showInLegend: true,
//            legendText: "Individual Users",
//            dataPoints: dataPoints_users
//          }
                ],
                axisX: {
                    minimum: new Date(zone_start * 1000),
                    maximum: new Date((zone_start + time_zone.length * 1800) * 1000),
                    interval: 30,
                    intervalType: "minute",
                    labelAngle: -60,
                    title: "Time",
                    titleFontSize: 20,
                    labelFontSize: 12
                },
                axisY: {
                    title: "Number of Tweets",
                    titleFontSize: 20,
                    labelFontSize: 12
                },
//          legend: {
//            horizontalAlign: "right", 
//            verticalAlign: "center", 
//            fontSize: 12
//          }
            });

    chart.render();
}


// plot word chart for sub map
function plot_word_chart(keywords, chart_id) {
    var dataPoints = [];

    // prepare datapoints
    for (var i = 0; i < 30; i++) {
        if (keywords[i][1] > 1) {
            dataPoints.push({
                x: i,
                y: keywords[i][1],
                label: keywords[i][0]
            });
        } else {
            break;
        }
    }

    var chart = new CanvasJS.Chart(chart_id,
            {
                title: {
                    text: ""
                },
                data: [
                    {
                        color: "#B0D0B0",
                        type: "column",
//            showInLegend: true,
//            legendText: "Number of Tweets",
                        dataPoints: dataPoints,
                    },
//          {        
//            type: "line",
//            showInLegend: true,
//            legendText: "Individual Users",
//            dataPoints: dataPoints_users
//          }
                ],
                axisX: {
                    title: "Top Words",
                    titleFontSize: 20,
                    labelFontSize: 12,
                    labelAngle: -60,
                    interval: 1,
                },
                axisY: {
                    title: "Number",
                    titleFontSize: 20,
                    labelFontSize: 12
                },
//          legend: {
//            horizontalAlign: "right", 
//            verticalAlign: "center", 
//            fontSize: 12
//          }
            });

    chart.render();
}


// plot time chart for only hot words
function plot_hot_word_time_chart(time_start, time_end, point_ids, keywords, chart_id) {
    // keywords, words only, no freq
    keywords_set = [];

    for (var i = 0; i < 30; i++) {
        if (keywords[i][1] > 1) {
            keywords_set.push(keywords[i][0]);
        } else {
            break;
        }
    }
//    // customized keyword set
//    keywords_set = ['duke','mercer'];

    //console.log(point_ids);

    // prepare datapoints, only keep id with any keywords
    var key_point_ids = [];
    for (var i = 0; i < point_ids.length; i++) {
        for (var j = 0; j < keywords_set.length; j++) {
            if (text[point_ids[i]][0].toLowerCase().includes(keywords_set[j])) {
                key_point_ids.push(point_ids[i]);
                break;
            }
        }
    }

    // get time zone
    var zone_result = time_zone_seperate(time_start, time_end);
    var zone_start = zone_result.zone_start;
    var time_zone = zone_result.time_zone;
    //console.log(zone_start);
    //console.log(time_zone);
    for (var i = 0; i < key_point_ids.length; i++) {
        var time_zone_label = parseInt((epoch[key_point_ids[i]] - zone_start) / 1800);
        //console.log(time_zone_label);
        time_zone[time_zone_label] += 1;
    }

    //console.log(time_zone);
    plot_sub_time_chart(zone_start, time_zone, chart_id);

    return key_point_ids;

}


// plot word chart for sub map
function plot_topic(data, color, chart_id) {
    var words = data.dataPoints;
    var dataPoints = [];

    // prepare datapoints
    for (var i = 0; i < words.length; i++) {
        dataPoints.push({
//                x: topicText[i].word,
            y: words[i].ratio,
            label: words[i].word
        });
    }

    var chart = new CanvasJS.Chart(chart_id,
            {
                title: {
                    text: ""
                },
                data: [
                    {
                        color: color,
                        type: "column",
//            showInLegend: true,
//            legendText: "Number of Tweets",
                        dataPoints: dataPoints,
                    },
//          {        
//            type: "line",
//            showInLegend: true,
//            legendText: "Individual Users",
//            dataPoints: dataPoints_users
//          }
                ],
                axisX: {
                    title: "Top Words",
                    titleFontSize: 16,
                    labelFontSize: 14,
                    labelAngle: -60,
                    interval: 1,
                },
                axisY: {
                    title: "Percentage(%)",
                    titleFontSize: 20,
                    labelFontSize: 14,
                    interval: 1,
                },
//          legend: {
//            horizontalAlign: "right", 
//            verticalAlign: "center", 
//            fontSize: 12
//          }
            });

    chart.render();
}


