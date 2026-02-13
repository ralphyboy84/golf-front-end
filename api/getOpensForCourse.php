<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "courses.php";

$opensOfType = [];
$totalOpenInfo = [];

if ($golfCourses[$_GET["club"]]["bookingSystem"] == "clubv1") {
    require_once "../call/clubV1Call.php";
    require_once "../processor/clubV1Processor.php";

    $ClubV1Call = new ClubV1Call();
    $ClubV1Processor = new ClubV1Processor();

    $opens = $ClubV1Call->getAllOpensForCourse($_GET["courseId"]);

    if ($opens) {
        foreach ($opens as $open) {
            $slotsAvailable = "No";

            $openField = $ClubV1Call->checkOpenAvailability(
                $open["token"],
                $open["competition_id"],
            );
            $openCompetitionInfo = $ClubV1Processor->processOpenAvailability(
                $openField,
                $open["competition_id"],
                $open["token"],
            );

            $slotsAvailable = $openCompetitionInfo["slotsAvailable"];

            require_once "../database/database.php";
            require_once "../opens/opens.php";

            $database = new database();

            $opens = new opens();
            $opens->updateOpenInformation(
                $database->getDatabaseConnection(),
                $_GET["club"],
                $open["competition_id"],
                $_GET["courseId"],
                $open["date_formatted"],
                $open["name"],
                $slotsAvailable,
            );
        }
    }
} elseif ($golfCourses[$_GET["club"]]["bookingSystem"] == "brs") {
    require_once "../call/brsCall.php";
    require_once "../processor/brsProcessor.php";

    $BRSCall = new BRSCall();
    $BRSProcessor = new BRSProcessor();

    $opens = $BRSCall->getAllOpensForCourse($_GET["club"]);
    $opens = json_decode($opens, 1);

    if ($opens["data"]) {
        foreach ($opens["data"] as $open) {
            $slotsAvailable = "No";

            $openField = $BRSCall->checkOpenAvailability(
                $_GET["club"],
                $open["competition_id"],
            );
            $openCompetitionInfo = $BRSProcessor->processOpenAvailability(
                $openField,
                $golfCourses[$_GET["club"]]["bookingLink"],
            );

            $slotsAvailable = $openCompetitionInfo["slotsAvailable"];

            require_once "../database/database.php";
            require_once "../opens/opens.php";

            $database = new database();

            $opens = new opens();
            $opens->updateOpenInformation(
                $database->getDatabaseConnection(),
                $_GET["club"],
                $open["competition_id"],
                0,
                $open["date"],
                $open["name"],
                $slotsAvailable,
            );
        }
    }
}
