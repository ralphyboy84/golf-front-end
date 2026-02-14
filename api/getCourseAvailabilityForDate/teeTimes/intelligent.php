<?php

require_once "call/intelligentCall.php";
require_once "processor/intelligentProcessor.php";

$IntelligentCall = new IntelligentCall();
$IntelligentProcessor = new IntelligentProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $teeTimes = $IntelligentCall->getTeeTimesForDay(
        $golfCourses[$_GET["club"]]["baseUrl"],
        $_GET["date"],
        $golfCourses[$_GET["club"]]["courseId"],
    );

    $teeTimeInfo = $IntelligentProcessor->processTeeTimeForDay(
        $teeTimes,
        $golfCourses[$_GET["club"]],
        $_GET["date"],
    );
}
