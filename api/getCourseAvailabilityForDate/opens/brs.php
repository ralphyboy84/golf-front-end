<?php

require_once "../call/brsCall.php";
require_once "../processor/brsProcessor.php";

$BRSCall = new BRSCall();
$BRSProcessor = new BRSProcessor();

if ($golfCourses[$_GET["club"]]["openBooking"]) {
    $courseId = $golfCourses[$_GET["club"]]["brsCourseId"];

    $slotsAvailable = "No";

    $opens = $BRSCall->getAllOpensForCourse($_GET["club"]);
    $openOnDay = $BRSProcessor->checkForOpenOnDay($opens, $_GET["date"]);

    if (
        isset($openOnDay["competitionId"]) &&
        $openOnDay["bookingOpen"] == "Yes"
    ) {
        $openField = $BRSCall->checkOpenAvailability(
            $_GET["club"],
            $openOnDay["competitionId"],
        );
        $openCompetitionInfo = $BRSProcessor->processOpenAvailability(
            $openField,
            $golfCourses[$_GET["club"]]["openBookingLink"],
        );

        $slotsAvailable = $openCompetitionInfo["slotsAvailable"];
    }

    if (isset($openOnDay["competitionId"])) {
        $database = new database();

        $opens = new opens();
        $opens->updateOpenInformation(
            $database->getDatabaseConnection(),
            $_GET["club"],
            $openOnDay["competitionId"],
            $courseId,
            $_GET["date"],
            $openOnDay["name"],
            $slotsAvailable,
        );
    }
}
