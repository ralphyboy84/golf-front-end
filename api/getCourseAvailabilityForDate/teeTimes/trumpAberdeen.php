<?php

require_once "../call/trumpAberdeenCall.php";
require_once "../processor/trumpAberdeenProcessor.php";

$trumpAberdeenCall = new trumpAberdeenCall();
$trumpAberdeenProcessor = new trumpAberdeenProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $teeTimes = $trumpAberdeenCall->getTeeTimesForDay(
        $_GET["date"],
        $golfCourses[$_GET["club"]]["courseId"],
    );

    $teeTimeInfo = $trumpAberdeenProcessor->processTeeTimeForDay(
        $teeTimes,
        $golfCourses[$_GET["club"]],
        $_GET["date"],
    );
}
