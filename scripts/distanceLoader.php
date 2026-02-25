<?php

require_once "../api/courses.php";

$SERVERNAME = "database";
$USERNAME = "root";
$PASSWORD = "";
$DATABASE = "golf";

$dbh = new mysqli($SERVERNAME, $USERNAME, $PASSWORD, $DATABASE);

$prev = 0;

for ($x = $prev; $x <= 535; $x += 5) {
    $fromCourse = "Aberfeldy";

    $sql = "
    SELECT *
    FROM clubs
    WHERE id != '$fromCourse'
    LIMIT $x, 5
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $toCourse = $row["id"];
            echo $toCourse . "#######";

            $locationString =
                $golfCourses[$toCourse]["location"]["lat"] .
                "_" .
                $golfCourses[$toCourse]["location"]["lon"];

            $search_lat = $golfCourses[$fromCourse]["location"]["lat"];
            $search_lon = $golfCourses[$fromCourse]["location"]["lon"];

            $url = "https://api.traveltimeapp.com/v4/time-filter?type=driving&arrival_time=2026-02-20T22:00:00Z&search_lat={$search_lat}&search_lng={$search_lon}&locations={$locationString}&app_id=65f59572&api_key=48fae2082ab3ed993535eac4ff353a4d";

            $ch = curl_init($url);

            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
            ]);

            $response = curl_exec($ch);

            if ($response === false) {
                $error = curl_error($ch);
                curl_close($ch);
                die("cURL error: " . $error);
            }

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // sleep(1000);

            echo "<pre>";

            // Optional: decode JSON response
            $responseData = json_decode($response, true);
            print_r($responseData);

            $newArray = [];

            if (
                $responseData &&
                isset($responseData["results"][0]["locations"]) &&
                count($responseData["results"][0]["locations"]) == 1
            ) {
                $distance =
                    $responseData["results"][0]["locations"][0][
                        "properties"
                    ][0]["travel_time"];

                $sql = "
            INSERT INTO distance(fromcourse, tocourse, time)
            VALUES
            ('{$fromCourse}', '{$toCourse}', '{$distance}')
            ";

                echo $sql . "<br>";

                try {
                    $dbh->query($sql);
                } catch (mysqli_sql_exception $e) {
                    echo "$fromCourse to $toCourse error" .
                        $e->getMessage() .
                        "<br>";
                }
            }
        }
    }

    sleep(61);
    $prev = 5 + $prev;
}
