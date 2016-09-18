<?php
  include "connection.php";
  
  $year = $_POST["year"];
  $user_id = $_POST["user_id"];
  
  $table = $_SESSION['table'];
  
  $sql = "SELECT id, epoch, hour, date, weekday, x, y, longitude AS lng, latitude AS lat, text"
          . " FROM `$table` WHERE year = '$year' and user_id = '$user_id' ORDER by epoch";
  $loc_result = mysql_query($sql) or die (mysql_error());
  $rows = array();
  while($item = mysql_fetch_assoc($loc_result)) {
    $rows[] = ['id'=>(double)$item['id'], 'epoch'=>(double)$item['epoch'], 
        'hour'=>(int)$item['hour'], 'date'=>(int)$item['date'], 'weekday'=>$item['weekday'],
        'x'=>(double)$item['x'], 'y'=>(double)$item['y'], 
        'lng'=>(double)$item['lng'], 'lat'=>(double)$item['lat'],
        'text'=>$item['text']];
  }
  print json_encode($rows);
  