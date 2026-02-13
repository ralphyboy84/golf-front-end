<?php

require_once "../call/carnoustieCall.php";
require_once "../processor/carnoustieProcessor.php";

$CarnoustieCall = new CarnoustieCall();
$CarnoustieProcessor = new CarnoustieProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $teeTimes = $CarnoustieCall->getTeeTimesForDay(
        $_GET["date"],
        $_GET["courseId"],
    );

    $teeTimeInfo = $CarnoustieProcessor->processTeeTimeForDay(
        $teeTimes,
        $_GET["date"],
    );
}
