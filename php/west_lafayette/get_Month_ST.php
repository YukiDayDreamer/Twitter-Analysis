<?php

header("Content-type: text/html;charset=utf-8"); //utf-8
include "connection.php";

$table = $_SESSION['table'];

$year = $_POST["year"];
$month = $_POST["month"];
// Order by epoch time
$sql = "SELECT id, epoch, user_id, hour, date, weekday, text,"
        . "latitude AS lat,longitude AS lng,  x, y"
        . " FROM `$table` WHERE year = '$year' and month = '$month' ORDER BY epoch ASC";
$loc_result = mysql_query($sql) or die(mysql_error());
$rows = array();
while ($item = mysql_fetch_assoc($loc_result)) {
    $rows[] = ['id' => (double) $item['id'], 'epoch' => (double) $item['epoch'], 'user_id' => $item['user_id'],
        'hour' => (int) $item['hour'], 'date' => (int) $item['date'], 'weekday' => $item['weekday'],
        'lat' => (double) $item['lat'], 'lng' => (double) $item['lng'],
        'x' => (double) $item['x'], 'y' => (double) $item['y'],
        'text' => $item['text']
    ];
}
print json_encode($rows);
