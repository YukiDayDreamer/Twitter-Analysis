<?php
  include "connection.php";
  $year = $_POST["year"];
  
  $table = $_SESSION['table'];
  
  $sql = "SELECT user_id, COUNT(user_id) AS num FROM `$table` where year = '$year'"
          . "GROUP BY user_id ORDER BY COUNT(user_id) DESC LIMIT 15";
  $user_result = mysql_query($sql) or die (mysql_error());
  $rows = array();
  while($item = mysql_fetch_assoc($user_result)){
    $rows[] = ['user_id'=>(double)$item['user_id'],'num'=>(double)$item['num']];
  }
  print json_encode($rows);
