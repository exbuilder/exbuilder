<?php
  include('config.php');

  // get JSON and decode to PHP array
  //$data_array = json_decode(file_get_contents('php://input'), true);

  // connect to database
  $dbconn = pg_connect( "host=$database->host port=$database->port dbname=$database->dbname user=$database->user password=$database->password" )
      or die ("Could not connect to database\n");

  // update the runs table with the json data from the study
  $res = pg_query_params($dbconn, "SELECT condition, COUNT(condition) FROM exbuilder.runs WHERE experiment = $1 AND participant != '0' GROUP BY condition;",
    array($_GET['experiment']))
    or die ("Could not count runs\n");

  //var_dump($res);

  $resultArray = pg_fetch_all($res);
  echo json_encode($resultArray);


pg_close($dbconn);
?>