<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

	$sql = "
		SELECT 
		FROM_COMMUNITY AS COMMUNITY, 
		FROM_STATION_NAME AS STATION_NAME, 
		STR_TO_DATE(starttime,  '%m/%d/%Y') AS STARTDATE,
		COUNT(BIKEID) AS TOTAL_BIKES
		FROM trips_data
		GROUP BY COMMUNITY,STATION_NAME,STARTDATE	
	";
	
    $query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    echo json_encode($data);     
    mysql_close($server);
?>