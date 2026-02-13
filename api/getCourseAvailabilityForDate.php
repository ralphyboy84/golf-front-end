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

if (
    (isset($golfCourses[$_GET["club"]]["bookingSystem"]) &&
        !empty($golfCourses[$_GET["club"]]["bookingSystem"])) ||
    (isset($golfCourses[$_GET["club"]]["openBookingSystem"]) &&
        !empty($golfCourses[$_GET["club"]]["openBookingSystem"]))
) {
    require_once "getCourseAvailabilityForDate/teeTimes.php";

    $additionalArray = [
        "bookingUrl" => get_booking_url(
            $golfCourses[$_GET["club"]],
            $_GET["date"],
            $_GET["courseId"],
        ),
        "courseName" => get_course_name(
            $_GET["club"],
            $golfCourses,
            $_GET["courseId"],
        ),
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
            "courseName" => get_course_name(
                $_GET["club"],
                $golfCourses,
                $_GET["courseId"],
            ),
            "onlineBooking" => "No",
            "visitorsAvailable" => "Yes",
            "date" => $df[2] . "/" . $df[1] . "/" . $df[0],
            "bookingUrl" => $golfCourses[$_GET["club"]]["bookingLink"],
        ];
    } else {
        $additionalArray = [
            "courseName" => get_course_name(
                $_GET["club"],
                $golfCourses,
                $_GET["courseId"],
            ),
            "onlineBooking" => "No",
            "visitorsAvailable" => "No",
            "date" => $df[2] . "/" . $df[1] . "/" . $df[0],
            "bookingUrl" => $golfCourses[$_GET["club"]]["bookingLink"],
        ];
    }
}

$array = array_merge(
    $teeTimeInfo,
    $openOnDay,
    $openCompetitionInfo,
    $additionalArray,
);

echo json_encode($array);
