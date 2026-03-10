<?php

require_once "call/dotGolfCall.php";
require_once "processor/dotGolfProcessor.php";

$DotGolfCall = new DotGolfCall();
$DotGolfProcessor = new DotGolfProcessor();

if ($golfCourses[$_GET["club"]]["openBooking"]) {
    $clubId = $golfCourses[$_GET["club"]]["clubid"];

    $slotsAvailable = "No";

    $opens = $DotGolfCall->getAllOpensForCourse($clubId);
    $openOnDay = $DotGolfProcessor->checkForOpenOnDay($opens, $_GET["date"]);

    // if (
    //     isset($openOnDay["competitionId"]) &&
    //     $openOnDay["bookingOpen"] == "Yes"
    // ) {
    //     $openField = $BRSCall->checkOpenAvailability(
    //         $_GET["club"],
    //         $openOnDay["competitionId"],
    //     );
    //     $openCompetitionInfo = $BRSProcessor->processOpenAvailability(
    //         $openField,
    //         $golfCourses[$_GET["club"]]["openBookingLink"],
    //     );

    //     $slotsAvailable = $openCompetitionInfo["slotsAvailable"];
    // }

    // if (isset($openOnDay["competitionId"])) {
    //     $database = new database();

    //     $opens = new opens();
    //     $opens->updateOpenInformation(
    //         $database->getDatabaseConnection(),
    //         $_GET["club"],
    //         $openOnDay["competitionId"],
    //         $courseId,
    //         $_GET["date"],
    //         $openOnDay["name"],
    //         $slotsAvailable,
    //     );
    // }
}
