<?php
  // this path points to our configuration file. you should not version control this file
  include('database_config.php');

  // get JSON and decode to PHP array
  $data_array = json_decode(file_get_contents('php://input'), true);

  echo($data_array);
  // connect to database
  $dbconn = pg_connect( "host=$host port=$port dbname=$dbname user=$user password=$password" )
      or die ("Could not connect to database\n");

  // insert array to runs table
  $res = pg_insert($dbconn, $runs_table, $data_array)
    or die ("Could not update run with data\n");

pg_close($dbconn);
?>
