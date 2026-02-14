<?php

require_once "call/dotGolfCall.php";
require_once "processor/dotGolfProcessor.php";

$DotGolfCall = new DotGolfCall();
$DotGolfProcessor = new DotGolfProcessor();

if ($golfCourses[$_GET["club"]]["onlineBooking"]) {
    $response = $DotGolfCall->getTeeTimesForDay(
        $_GET["date"],
        $golfCourses[$_GET["club"]]["bookingLink"],
        $golfCourses[$_GET["club"]]["clubId"],
        $_GET["courseId"],
    );

    $teeTimeInfo = $DotGolfProcessor->processTeeTimeForDay(
        $response,
        $_GET["date"],
    );
}

// if ($golfCourses[$_GET["club"]]["openBooking"]) {
//     $opens = $DotGolfCall->getAllOpensForCourse($_GET["courseId"]);
//     $openOnDay = $DotGolfProcessor->checkForOpenOnDay($opens, $_GET["date"]);

//     if (isset($openOnDay["competitionId"])) {
//         $openField = false;
//         $openField = $DotGolfCall->checkOpenAvailability(
//             $openOnDay["token"],
//             $openOnDay["competitionId"],
//         );
//         $openCompetitionInfo = $DotGolfProcessor->processOpenAvailability(
//             $openField,
//             $openOnDay["competitionId"],
//             $openOnDay["token"],
//         );
//     }
// }
