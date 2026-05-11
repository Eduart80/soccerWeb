<?php
  $host_name = 'db5020421124.hosting-data.io';
  $database = 'dbs15654492';
  $user_name = 'dbu804911';
  $password = '<Enter your password here.>';

  $link = new mysqli($host_name, $user_name, $password, $database);

  if ($link->connect_error) {
    die('<p>Failed to connect to MySQL: '. $link->connect_error .'</p>');
  } else {
    echo '<p>Connection to MySQL server successfully established.</p>';
  }
?>