<?php
  include "connection.php";
  $year = $_POST["year"];
  $id = $_POST["user_id"];
  
  $table = $_SESSION['table'];
  
  $sql = "SELECT latitude AS lat,longitude AS lng FROM `$table` WHERE year = '$year' and user_id = '$id'";
  $loc_result = mysql_query($sql) or die (mysql_error());
  $rows = array();
  while($item = mysql_fetch_assoc($loc_result)){
    $rows[] = ['lat'=>(double)$item['lat'],'lng'=>(double)$item['lng']];
  }
  print json_encode($rows);
