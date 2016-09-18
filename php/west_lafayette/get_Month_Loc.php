<?php
  include "connection.php";
  
  $table = $_SESSION['table'];
  
  $year = $_POST["year"];
  $month = $_POST["month"];
  $sql = "SELECT latitude AS lat,longitude AS lng FROM `$table` WHERE "
          . "year = '$year' and month = '$month'";
  $loc_result = mysql_query($sql) or die (mysql_error());
  $rows = array();
  while($item = mysql_fetch_assoc($loc_result)){
    $rows[] = ['lat'=>(double)$item['lat'],'lng'=>(double)$item['lng']];
  }
  print json_encode($rows);