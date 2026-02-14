<?php

require_once "call/clubV1Call.php";
require_once "processor/clubv1Processor.php";

$ClubV1Call = new ClubV1Call();
$ClubV1Processor = new ClubV1Processor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $response = $ClubV1Call->getTeeTimesForDay(
        $_GET["date"],
        $golfCourses[$_GET["club"]]["clubv1hub"],
        $golfCourses[$_GET["club"]]["courseId"],
    );

    $teeTimeInfo = $ClubV1Processor->processTeeTimeForDay(
        $response,
        $_GET["date"],
        $_GET["club"],
    );
}
