<?php

require_once "../call/brsCall.php";
require_once "../processor/brsProcessor.php";

$BRSCall = new BRSCall();
$BRSProcessor = new BRSProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $courseId = $golfCourses[$_GET["club"]]["brsCourseId"];
    $brsDomain = $golfCourses[$_GET["club"]]["brsDomain"];

    $teeTimes = $BRSCall->getTeeTimesForDay(
        $_GET["date"],
        $brsDomain,
        $courseId,
    );

    $teeTimeInfo = $BRSProcessor->processTeeTimeForDay(
        $brsDomain,
        $teeTimes,
        $golfCourses[$_GET["club"]],
        $_GET["date"],
    );
}
