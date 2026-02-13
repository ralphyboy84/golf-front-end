<?php

require_once "../call/gleneaglesCall.php";
require_once "../processor/gleneaglesProcessor.php";

$gleneaglesCall = new gleneaglesCall();
$gleneaglesProcessor = new gleneaglesProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $teeTimes = $gleneaglesCall->getTeeTimesForDay(
        $_GET["date"],
        $golfCourses[$_GET["club"]]["courseId"],
    );

    $teeTimeInfo = $gleneaglesProcessor->processTeeTimeForDay(
        $teeTimes,
        $golfCourses[$_GET["club"]],
        $_GET["date"],
    );
}
