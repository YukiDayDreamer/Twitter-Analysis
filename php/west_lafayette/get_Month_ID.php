<?php
  include "connection.php";
  
  $table = $_SESSION['table'];
  
  $year = $_POST["year"];
  $sql = "SELECT month, COUNT(month) AS num FROM `$table` where year = '$year'"
          . "GROUP BY month ORDER BY COUNT(month) DESC";
  $user_result = mysql_query($sql)or die (mysql_error());
  $rows = array();
  while($item = mysql_fetch_assoc($user_result)){
    $rows[] = ['month'=>$item['month'],'num'=>(double)$item['num']];
  }
  print json_encode($rows);
