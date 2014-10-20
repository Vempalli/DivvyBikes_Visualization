<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	$status = set_time_limit(0);
	ignore_user_abort(1);

	$no_of_bins = 10;
	$intervals_query = 		
		"SELECT MAX( YEAR(CURRENT_DATE)- birthday ), MIN( YEAR(CURRENT_DATE)- birthday ), (
		(MAX( YEAR(CURRENT_DATE)- birthday )) - 
		(MIN(YEAR(CURRENT_DATE) - birthday )) )/$no_of_bins AS INTRVL FROM trips_data WHERE gender != 'null' and birthday != 'null' and usertype = 'subscriber'";
    $query = mysql_query($intervals_query);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
	$intervals_data = array();
	$intervals_data = mysql_fetch_assoc($query);
	$intervals = floor($intervals_data['INTRVL']);	

	$sql = "";
	for($multiplier = 1; $multiplier < $no_of_bins + 1; $multiplier++){
		$lower = $intervals * $multiplier;
		$higher = $intervals * ($multiplier + 1) - 1;
		$sql .= ("SELECT COMMUNITY, STATION_NAME, AGE_INTERVAL, SUM(POPULATION) AS TOTAL, GENDER FROM(
				SELECT td.FROM_COMMUNITY AS COMMUNITY,td.FROM_STATION_NAME AS STATION_NAME," . ($lower) .
				" AS AGE_INTERVAL, COUNT(*) POPULATION, GENDER, (YEAR(CURRENT_DATE) - BIRTHDAY) AS AGE FROM trips_data td, stations_data sd
					WHERE USERTYPE = 'Subscriber' AND GENDER != 'null' AND BIRTHDAY != 'null' 
					AND td.FROM_COMMUNITY = sd.COMMUNITY AND td.FROM_STATION_NAME = sd.STATIONNAME
					GROUP BY td.FROM_COMMUNITY, td.FROM_STATION_NAME, GENDER,AGE HAVING " . ($lower) . " < AGE AND AGE < " .($higher) . 
					")  AS TBL GROUP BY COMMUNITY, STATION_NAME UNION ");
	}

    function str_replace_last( $search , $replace , $str ) {
        if( ( $pos = strrpos( $str , $search ) ) !== false ) {
            $search_length  = strlen( $search );
            $str    = substr_replace( $str , $replace , $pos , $search_length );
        }
        return $str;
    }

	$str = $sql;
	$search = 'UNION';
	$replace = '';
	$sql = str_replace_last( $search , $replace , $str );

	print ($sql);
	
	/*$query = mysql_query($sql);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $sql_data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $sql_data[] = mysql_fetch_assoc($query);
    }
	
    echo json_encode($sql_data);     
    mysql_close($server);*/
?>