<?php
    $username = "akumar34"; 
    $password = "password1";   
    $host = "bicyclerace6.mysql.uic.edu";
    $database="bicyclerace6";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$no_of_bins = 10;
	$intervals_query = "SELECT MAX(tripduration)/$no_of_bins AS INTRVL FROM trips_data";
    $query = mysql_query($intervals_query);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
	$intervals_data = array();
	$intervals_data = mysql_fetch_assoc($query);
	$intervals = floor($intervals_data['INTRVL']);	

	$dist_by_dist_query = "";
	for($multiplier = 1; $multiplier < $no_of_bins + 1; $multiplier++){
		$lower = $intervals * $multiplier;
		$higher = $intervals * ($multiplier + 1) - 1;
		$dist_by_dist_query .= ("SELECT FROM_COMMUNITY AS COMMUNITY, " . ($lower) .
			" AS TRIP_DURATION, COUNT(*) AS TOTAL_TRIPS FROM trips_data td WHERE " . ($lower) . " < tripduration AND tripduration < " . ($higher) . 
			" GROUP BY FROM_COMMUNITY UNION ");
	}

    function str_replace_last( $search , $replace , $str ) {
        if( ( $pos = strrpos( $str , $search ) ) !== false ) {
            $search_length  = strlen( $search );
            $str    = substr_replace( $str , $replace , $pos , $search_length );
        }
        return $str;
    }

	$str = $dist_by_dist_query;
	$search = 'UNION';
	$replace = '';
	$dist_by_dist_query = str_replace_last( $search , $replace , $str );
	
	$query = mysql_query($dist_by_dist_query);
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $dist_by_dist_data = array();
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $dist_by_dist_data[] = mysql_fetch_assoc($query);
    }
	
    echo json_encode($dist_by_dist_data);     
    mysql_close($server);
?>