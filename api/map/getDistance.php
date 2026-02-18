<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "../courses.php";

if ($_GET["from"] == "undefined" || $_GET["from"] == "") {
    echo json_encode([]);
    return;
}

$args = explode(",", $_GET["from"]);

$toArgs = explode(",", $_GET["to"]);

$locations = [];

foreach ($toArgs as $course) {
    $explode = explode("_", $course);

    $course = $explode[0];

    if (
        isset($golfCourses[$course]["location"]) &&
        !empty($golfCourses[$course]["location"])
    ) {
        $locations[] =
            $golfCourses[$course]["location"]["lat"] .
            "_" .
            $golfCourses[$course]["location"]["lon"];
    }
}

if ($locations) {
    $locationString = implode(",", array_unique($locations));
} else {
    echo json_encode([]);
    return;
}

$url = "https://api.traveltimeapp.com/v4/time-filter?type=driving&arrival_time=2027-01-20T20:00:00Z&search_lat={$args[0]}&search_lng={$args[1]}&locations={$locationString}&app_id=65f59572&api_key=48fae2082ab3ed993535eac4ff353a4d";

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

// Optional: decode JSON response
$responseData = json_decode($response, true);

$newArray = [];

if (count($responseData["results"][0]["locations"]) == 1) {
    $explode = explode(",", $_GET["to"]);

    foreach ($explode as $courseId) {
        $newArray[$courseId] = gmdate(
            "H:i:s",
            $responseData["results"][0]["locations"][0]["properties"][0][
                "travel_time"
            ],
        );
    }
} elseif (count($responseData["results"][0]["locations"]) > 1) {
    $dests = explode(",", $_GET["to"]);

    // foreach ($dests as $dest) {
    //     $exp = explode("_", $dest);
    //     $tmpDests[] = $exp[0];
    // }

    // $dests = array_unique($tmpDests);

    $x = 0;

    foreach ($responseData["results"][0]["locations"] as $result) {
        $returnResult[$result["id"]] = gmdate(
            "H:i:s",
            $result["properties"][0]["travel_time"],
        );

        $x++;
    }

    foreach ($golfCourses as $key => $club) {
        if (in_array($key, $dests)) {
            $latlon = $club["location"]["lat"] . "," . $club["location"]["lon"];

            foreach ($returnResult as $id => $result) {
                if ($id == $latlon) {
                    $newArray[$key] = $result;
                }
            }
        }
    }
}

echo json_encode($newArray);
