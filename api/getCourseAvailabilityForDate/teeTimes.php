<?php

require_once "database/database.php";
require_once "opens/opens.php";

$MOCK = false;

$sql = "
SELECT *
FROM mock
";

$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if ($row["mockon"] == 1) {
            $MOCK = 1;
        }
    }
}

$openFlag = 1;
$bookingFlag = 1;

if ($_GET["opens"] == "opens") {
    $openFlag = 1;
    $bookingFlag = 0;
} elseif ($_GET["opens"] == "noopens") {
    $bookingFlag = 1;
    $openFlag = 0;
}

if (
    isset($golfCourses[$_GET["club"]]["bookingSystem"]) &&
    !empty($golfCourses[$_GET["club"]]["bookingSystem"]) &&
    $bookingFlag
) {
    if (!$MOCK) {
        require_once "getCourseAvailabilityForDate/teeTimes/{$golfCourses[$_GET["club"]]["bookingSystem"]}.php";
    } else {
        $teeTimeInfo = [];

        $file = "../mockCalls/{$golfCourses[$_GET["club"]]["bookingSystem"]}/{$_GET["club"]}/{$_GET["date"]}.json";

        if (file_exists($file)) {
            $teeTimeInfo = file_get_contents($file);
            $teeTimeInfo = json_decode($teeTimeInfo, 1);
        }
    }
}

if (
    isset($golfCourses[$_GET["club"]]["openBookingSystem"]) &&
    !empty($golfCourses[$_GET["club"]]["openBookingSystem"]) &&
    !$MOCK &&
    $openFlag
) {
    require_once "getCourseAvailabilityForDate/opens/{$golfCourses[$_GET["club"]]["openBookingSystem"]}.php";
}
