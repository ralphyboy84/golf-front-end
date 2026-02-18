<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "../courses.php";

$dateToCheck = strtotime($_GET["date"]);
$dateOk = false;

if (
    ($dateToCheck >= time() && $dateToCheck <= strtotime("+1 days")) ||
    $_GET["date"] == date("Y-m-d")
) {
    $dateOk = true;
}

$weatherTypes = [
    1 => ["label" => "Sunny day", "icon" => "bi-brightness-high"],
    3 => ["label" => "Partly cloudy", "icon" => "bi-cloud-sun"],
    5 => ["label" => "Mist", "icon" => "bi-cloud-fog"],
    6 => ["label" => "Fog", "icon" => "bi-cloud-fog"],
    7 => ["label" => "Cloudy", "icon" => "bi-cloud"],
    8 => ["label" => "Overcast", "icon" => "bi-cloud"],
    10 => ["label" => "Light rain shower", "icon" => "bi-cloud-drizzle"],
    11 => ["label" => "Drizzle", "icon" => "bi-cloud-drizzle"],
    12 => ["label" => "Light rain", "icon" => "bi-cloud-drizzle"],
    14 => ["label" => "Heavy rain shower", "icon" => "bi-cloud-rain"],
    15 => ["label" => "Heavy rain", "icon" => "bi-cloud-rain"],
    17 => ["label" => "Sleet shower", "icon" => "bi-cloud-sleet"],
    18 => ["label" => "Sleet", "icon" => "bi-cloud-sleet"],
    20 => ["label" => "Hail shower", "icon" => "bi-cloud-hail"],
    21 => ["label" => "Hail", "icon" => "bi-cloud-hail"],
    23 => ["label" => "Light snow shower", "icon" => "bi-cloud-snow"],
    24 => ["label" => "Light snow", "icon" => "bi-cloud-snow"],
    26 => ["label" => "Heavy snow shower", "icon" => "bi-cloud-snow"],
    27 => ["label" => "Heavy snow", "icon" => "bi-cloud-snow"],
    29 => ["label" => "Thunder shower", "icon" => "bi-lightning"],
    30 => ["label" => "Thunder", "icon" => "bi-lightning"],
];

$jsonReturn = [];

$courses = explode(",", $_GET["to"]);

foreach ($courses as $course) {
    $explode = explode("_", $course);

    $course = $explode[0];

    if (isset($golfCourses[$course]["location"]) && $dateOk) {
        if ($_SERVER["HTTP_HOST"] == "localhost") {
            $response = file_get_contents("../mockCalls/weather.json");
        } else {
            $lat = $golfCourses[$course]["location"]["lat"];
            $long = $golfCourses[$course]["location"]["lon"];

            if ($lat == "0.000000") {
                continue;
            }

            $url = "https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/daily?latitude=$lat&longitude=$long";

            $ch = curl_init($url);

            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    "accept: application/json",
                    "apikey: eyJ4NXQjUzI1NiI6Ik5XVTVZakUxTkRjeVl6a3hZbUl4TkdSaFpqSmpOV1l6T1dGaE9XWXpNMk0yTWpRek5USm1OVEE0TXpOaU9EaG1NVFJqWVdNellXUm1ZalUyTTJJeVpBPT0iLCJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ==.eyJzdWIiOiJyYWxwaEByYWxwaHdhcmRsYXcuY28udWtAY2FyYm9uLnN1cGVyIiwiYXBwbGljYXRpb24iOnsib3duZXIiOiJyYWxwaEByYWxwaHdhcmRsYXcuY28udWsiLCJ0aWVyUXVvdGFUeXBlIjpudWxsLCJ0aWVyIjoiVW5saW1pdGVkIiwibmFtZSI6InNpdGVfc3BlY2lmaWMtOGMwZmFjZGEtM2ExOC00ZDgzLWEyOWUtMGI3MGI1OTQ2ODI0IiwiaWQiOjM2NDUyLCJ1dWlkIjoiMDMxOTMwMjAtMzJiZi00OGUyLWE2MmMtYmZkOGM0ZTkxYzdlIn0sImlzcyI6Imh0dHBzOlwvXC9hcGktbWFuYWdlci5hcGktbWFuYWdlbWVudC5tZXRvZmZpY2UuY2xvdWQ6NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsid2RoX3NpdGVfc3BlY2lmaWNfZnJlZSI6eyJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwiZ3JhcGhRTE1heENvbXBsZXhpdHkiOjAsImdyYXBoUUxNYXhEZXB0aCI6MCwic3RvcE9uUXVvdGFSZWFjaCI6dHJ1ZSwic3Bpa2VBcnJlc3RMaW1pdCI6MCwic3Bpa2VBcnJlc3RVbml0Ijoic2VjIn19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IlNpdGVTcGVjaWZpY0ZvcmVjYXN0IiwiY29udGV4dCI6Ilwvc2l0ZXNwZWNpZmljXC92MCIsInB1Ymxpc2hlciI6IkphZ3Vhcl9DSSIsInZlcnNpb24iOiJ2MCIsInN1YnNjcmlwdGlvblRpZXIiOiJ3ZGhfc2l0ZV9zcGVjaWZpY19mcmVlIn1dLCJ0b2tlbl90eXBlIjoiYXBpS2V5IiwiaWF0IjoxNzY5MDYwNjgyLCJqdGkiOiIyYjQ4YjdlZC0wZTFmLTQ2OWItOGQyYS00M2U3MWViNDAwZTEifQ==.C_cYYI8wWLgm1gBfZGrTCOPPZAnvYDS_wykXnBJ26GBHZKrO3KtBkRXlF0B_PmKYeYDgn3rKiPnZdkxbavtowPLHh_YWVcDLwA7Dt7Dqae1KgpyTREgJFQIs663F3oNevNuRwbjBPFTqXagbipHKSvANyqGcMSmxcN6l1MT6X8pnP6F_QR60V5yvbHpncJ3B-vE2HdEes1vB6NdGU4V66_L5HLJ2jz8fH0vg5FcJ3OgM4Y_t-sYnMyYwnmlftxM-eHI41ccwOybQBRXpv8VWeeGz9TC-hXGdPbCTYor9CdIgO8jT6X0G6inmvlGG90IChplG2MvZTrW2BreitI6rkQ==",
                ],
                CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            ]);

            $response = curl_exec($ch);

            if ($response === false) {
                $error = curl_error($ch);
                curl_close($ch);
                die("cURL error: " . $error);
            }

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
        }

        $response = json_decode($response, true);

        if (
            isset($response["features"][0]["properties"]["timeSeries"]) &&
            !empty($response["features"][0]["properties"]["timeSeries"])
        ) {
            foreach (
                $response["features"][0]["properties"]["timeSeries"]
                as $day
            ) {
                if ($day["time"] == $_GET["date"] . "T00:00Z") {
                    $jsonReturn[$course] = [
                        "chanceOfRain" => $day["dayProbabilityOfRain"] . "%",
                        "tmeperature" =>
                            round($day["dayMaxScreenTemperature"], 0) .
                            "&deg;C",
                        "forecast" => "Rain",
                        "wind" =>
                            metersPerSecondToMph($day["midday10MWindSpeed"]) .
                            "mph " .
                            degreesToCompass($day["midday10MWindDirection"]),
                        "generalForecast" =>
                            $weatherTypes[$day["daySignificantWeatherCode"]][
                                "label"
                            ],
                        "generalForecastIcon" =>
                            $weatherTypes[$day["daySignificantWeatherCode"]][
                                "icon"
                            ],
                    ];
                }
            }
        }
    }
}

echo json_encode($jsonReturn);

function metersPerSecondToMph($metersPerSecond)
{
    return round($metersPerSecond * 2.23694, 0);
}

function degreesToCompass($degrees)
{
    // Normalize degrees to 0-360
    $degrees = $degrees % 360;

    if ($degrees < 0) {
        $degrees += 360;
    }

    // 16-point compass directions
    $directions = [
        "N",
        "NNE",
        "NE",
        "ENE",
        "E",
        "ESE",
        "SE",
        "SSE",
        "S",
        "SSW",
        "SW",
        "WSW",
        "W",
        "WNW",
        "NW",
        "NNW",
    ];

    // Each segment is 360 / 16 = 22.5 degrees
    $index = (int) (($degrees + 11.25) / 22.5) % 16;

    return $directions[$index];
}
