<?php

require_once "call/intelligentCall.php";
require_once "processor/intelligentProcessor.php";

$IntelligentCall = new IntelligentCall();
$IntelligentProcessor = new IntelligentProcessor();

if ($golfCourses[$_GET["club"]]["openBooking"]) {
    $slotsAvailable = "No";

    $opens = $IntelligentCall->getAllOpensForCourse(
        $golfCourses[$_GET["club"]]["baseUrl"],
        $golfCourses[$_GET["club"]]["openBookingLink"],
    );
    $openOnDay = $IntelligentProcessor->checkForOpenOnDay(
        $opens,
        $_GET["date"],
    );

    if (
        isset($openOnDay["competitionId"]) &&
        $openOnDay["bookingOpen"] == "Yes"
    ) {
        $openField = $IntelligentCall->checkOpenAvailability(
            $golfCourses[$_GET["club"]]["baseUrl"],
            $_GET["club"],
            $openOnDay["competitionId"],
        );
        $openCompetitionInfo = $IntelligentProcessor->processOpenAvailability(
            $openField,
            $openOnDay["competitionId"],
            $golfCourses[$_GET["club"]]["baseUrl"],
        );
    }

    if (isset($openOnDay["competitionId"])) {
        $database = new database();

        $opens = new opens();
        $opens->updateOpenInformation(
            $database->getDatabaseConnection(),
            $_GET["club"],
            $openOnDay["competitionId"],
            $_GET["courseId"],
            $_GET["date"],
            $openOnDay["name"],
            $slotsAvailable,
        );
    }
}
