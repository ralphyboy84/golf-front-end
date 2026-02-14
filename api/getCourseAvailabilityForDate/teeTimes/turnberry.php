<?php

require_once "call/turnberyCall.php";
require_once "processor/turnberryProcessor.php";

$turnberyCall = new turnberyCall();
$turnberryProcessor = new turnberryProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $teeTimes = $turnberyCall->getTeeTimesForDay(
        $_GET["date"],
        $golfCourses[$_GET["club"]]["courseId"],
    );

    $teeTimeInfo = $turnberryProcessor->processTeeTimeForDay(
        $teeTimes,
        $golfCourses[$_GET["club"]],
        $_GET["date"],
    );
}
