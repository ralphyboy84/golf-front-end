<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

$explode = explode("_", $_GET["club"]);

$_GET["club"] = $explode[0];

require_once "courses.php";

$teeTimeInfo = [];
$openOnDay = [];
$openCompetitionInfo = [];
$additionalArray = [];

if ($_SERVER["HTTP_HOST"] == "localhost") {
    $timeSpan = 100;
} else {
    $timeSpan = 24;
}

$sql = "
SELECT *
FROM booking_info
WHERE course_id = '{$_GET["club"]}'
AND date = '{$_GET["date"]}'
AND last_updated_date > NOW() - INTERVAL $timeSpan HOUR
";

$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $array = $row["booking_info"];
    }

    echo $array;
    return;
}

$courseName = get_course_name($_GET["club"], $golfCourses);

if (
    (isset($golfCourses[$_GET["club"]]["bookingSystem"]) &&
        !empty($golfCourses[$_GET["club"]]["bookingSystem"])) ||
    (isset($golfCourses[$_GET["club"]]["openBookingSystem"]) &&
        !empty($golfCourses[$_GET["club"]]["openBookingSystem"]))
) {
    require_once "getCourseAvailabilityForDate/teeTimes.php";
    $bookingUrl = get_booking_url($golfCourses[$_GET["club"]], $_GET["date"]);

    $additionalArray = [
        "bookingUrl" => $bookingUrl,
        "courseName" => $courseName,
        "image" => $golfCourses[$_GET["club"]]["image"],
    ];
} else {
    $day = strtolower(date("D", strtotime($_GET["date"])));

    $df = explode("-", $_GET["date"]);

    if (
        isset($golfCourses[$_GET["club"]]["availabilityDays"]) &&
        in_array($day, $golfCourses[$_GET["club"]]["availabilityDays"])
    ) {
        $additionalArray = [
            "courseName" => $courseName,
            "onlineBooking" => "No",
            "visitorsAvailable" => "Yes",
            "date" => $df[2] . "/" . $df[1] . "/" . $df[0],
            "bookingUrl" => $golfCourses[$_GET["club"]]["bookingLink"],
            "image" => $golfCourses[$_GET["club"]]["image"],
        ];
    } else {
        $additionalArray = [
            "courseName" => $courseName,
            "onlineBooking" => "No",
            "visitorsAvailable" => "No",
            "date" => $df[2] . "/" . $df[1] . "/" . $df[0],
            "bookingUrl" => $golfCourses[$_GET["club"]]["bookingLink"],
            "image" => $golfCourses[$_GET["club"]]["image"],
        ];
    }
}

$array = array_merge(
    $teeTimeInfo,
    $openOnDay,
    $openCompetitionInfo,
    $additionalArray,
);

$json = json_encode($array);

// first we want to delete any historical booking dates as they are now longer relevant
$sql = "
DELETE FROM booking_info 
WHERE date < NOW()
";

$result = $mysqli->query($sql);

// no we want to delete the booking date for this course/date
$sql = "
DELETE FROM booking_info 
WHERE course_id = '{$_GET["club"]}'
AND date = '{$_GET["date"]}'
";

$result = $mysqli->query($sql);

// now insert the new date
$sql = "
INSERT INTO booking_info (`course_id`, `date`, `booking_info`)
VALUES
('{$_GET["club"]}', '{$_GET["date"]}', '$json')
";

$result = $mysqli->query($sql);

echo $json;
