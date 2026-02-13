<?php

header("Content-Type: application/json; charset=utf-8");

require_once "courses.php";

$working = 0;
$onlineBooking = 0;
$openBooking = 0;
$totalCourses = 0;

foreach ($golfCourses as $course) {
    if (isset($course["working"]) && $course["working"] == "Yes") {
        $working++;
    }

    if ($course["onlineBooking"] == "Yes") {
        $onlineBooking++;
    }

    if ($course["openBooking"] == "Yes") {
        $openBooking++;
    }

    if (isset($course["courses"])) {
        foreach ($course["courses"] as $xx) {
            $totalCourses++;
        }
    } else {
        $totalCourses++;
    }
}

$array = [
    "working" => $working,
    "onlineBooking" => $onlineBooking,
    "openBooking" => $openBooking,
    "totalCourses" => $totalCourses,
];

echo json_encode($array);
