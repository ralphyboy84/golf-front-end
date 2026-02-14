<?php

require_once "call/clubV1Call.php";
require_once "processor/clubv1Processor.php";

$ClubV1Call = new ClubV1Call();
$ClubV1Processor = new ClubV1Processor();

if ($golfCourses[$_GET["club"]]["openBooking"]) {
    $slotsAvailable = "No";

    $opens = $ClubV1Call->getAllOpensForCourse(
        $golfCourses[$_GET["club"]]["clubv1opencourseid"],
    );
    $openOnDay = $ClubV1Processor->checkForOpenOnDay(
        $opens,
        $_GET["date"],
        $golfCourses[$_GET["club"]]["clubv1opencourseid"],
    );

    if (
        isset($openOnDay["bookingOpen"]) &&
        $openOnDay["bookingOpen"] == "Yes"
    ) {
        $openField = false;
        $openField = $ClubV1Call->checkOpenAvailability(
            $openOnDay["token"],
            $openOnDay["competitionId"],
        );
        $openCompetitionInfo = $ClubV1Processor->processOpenAvailability(
            $openField,
            $openOnDay["competitionId"],
            $openOnDay["token"],
        );

        $slotsAvailable = $openCompetitionInfo["slotsAvailable"];
    }

    if (isset($openOnDay["bookingOpen"])) {
        $database = new database();

        $opens = new opens();
        $opens->updateOpenInformation(
            $database->getDatabaseConnection(),
            $_GET["club"],
            $openOnDay["competitionId"],
            $golfCourses[$_GET["club"]]["clubv1opencourseid"],
            $_GET["date"],
            $openOnDay["name"],
            $slotsAvailable,
        );
    }
}
