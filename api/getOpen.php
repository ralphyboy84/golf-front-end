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
    $opensOfType = $ClubV1Processor->getOpenOfType($opens, $_GET["openType"]);

    if ($opensOfType) {
        foreach ($opensOfType as $open) {
            $openField = $ClubV1Call->checkOpenAvailability(
                $open["token"],
                $open["competition_id"],
            );

            $openCompetitionInfo = $ClubV1Processor->processOpenAvailability(
                $openField,
                $open["competition_id"],
                $open["token"],
            );

            $totalOpenInfo[] = array_merge($open, $openCompetitionInfo);
            unset($openCompetitionInfo);
        }
    }
} elseif ($golfCourses[$_GET["club"]]["bookingSystem"] == "brs") {
    require_once "../call/brsCall.php";
    require_once "../processor/brsProcessor.php";

    $BRSCall = new BRSCall();
    $BRSProcessor = new BRSProcessor();

    $opens = $BRSCall->getAllOpensForCourse($_GET["club"]);
    $opensOfType = $BRSProcessor->getOpenOfType($opens, $_GET["openType"]);

    if ($opensOfType) {
        foreach ($opensOfType as $open) {
            $openField = $BRSCall->checkOpenAvailability(
                $_GET["club"],
                $open["competition_id"],
            );

            $openCompetitionInfo = $BRSProcessor->processOpenAvailability(
                $openField,
                $golfCourses[$_GET["club"]]["bookingLink"],
            );

            $totalOpenInfo[] = array_merge($open, $openCompetitionInfo);
            unset($openCompetitionInfo);
        }
    }
}

if (!$totalOpenInfo) {
    $totalOpenInfo = [0 => ["not found" => "not found"]];
}

echo json_encode($totalOpenInfo);
