<?php
  include('config.php');

  // get JSON and decode to PHP array
  $data_array = json_decode(file_get_contents('php://input'), true);

  // connect to database
  $dbconn = pg_connect( "host=$host port=$port dbname=$dbname user=$user password=$password" )
      or die ("Could not connect to database\n");

  // update the runs table with the json data from the study
  $res = pg_query_params($dbconn, "SELECT exbuilder.runs WHERE experiment = $1;",
    array($data_array['json_data'], $data_array['randomid']))
    or die ("Could not update run with data\n");

pg_close($dbconn);
?>