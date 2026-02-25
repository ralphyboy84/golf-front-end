<?php

require_once "../api/courses.php";

if ($_SERVER["HTTP_HOST"] == "localhost") {
    //dev settings
    $SERVERNAME = "database";
    $USERNAME = "root";
    $PASSWORD = "";
    $DATABASE = "golf";
} else {
    $SERVERNAME = "localhost";
    $USERNAME = "ralphwar";
    $PASSWORD = "Rdubz1984";
    $DATABASE = "ralphwar_golf";
}

$mysqli = new mysqli($SERVERNAME, $USERNAME, $PASSWORD, $DATABASE);

if ($_GET["load"] == "clubv1") {
    $sql = "
    SELECT *
    FROM clubs
    WHERE openBookingSystem = 'clubv1'
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            require_once "../api/call/clubV1Call.php";
            require_once "../api/processor/clubV1Processor.php";

            $ClubV1Call = new ClubV1Call();
            $ClubV1Processor = new ClubV1Processor();

            $opens = $ClubV1Call->getAllOpensForCourse(
                $row["clubv1opencourseid"],
            );

            if ($opens) {
                foreach ($opens as $open) {
                    if (
                        isset($open["competition_id"]) &&
                        !empty($open["competition_id"])
                    ) {
                        echo $row["id"] . $open["name"] . "<br>";
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

                        $slotsAvailable =
                            $openCompetitionInfo["slotsAvailable"];

                        require_once "../api/database/database.php";
                        require_once "../api/opens/opens.php";

                        $database = new database();

                        $opens = new opens();
                        $opens->updateOpenInformation(
                            $database->getDatabaseConnection(),
                            $row["id"],
                            $open["competition_id"],
                            $row["clubv1opencourseid"],
                            $open["date_formatted"],
                            $open["name"],
                            $slotsAvailable,
                            $open["token"],
                        );
                    }
                }
            }
        }
    }
}

if ($_GET["load"] == "brs") {
    $sql = "
    SELECT *
    FROM clubs
    WHERE openBookingSystem = 'brs'
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            require_once "../api/call/brsCall.php";
            require_once "../api/processor/brsProcessor.php";

            $BRSCall = new BRSCall();
            $BRSProcessor = new BRSProcessor();

            $opens = $BRSCall->getAllOpensForCourse($row["id"]);
            $opens = json_decode($opens, 1);

            if ($opens["data"]) {
                foreach ($opens["data"] as $open) {
                    echo $row["id"] . $open["name"] . "<br>";
                    $slotsAvailable = "No";

                    $openField = $BRSCall->checkOpenAvailability(
                        $row["id"],
                        $open["competition_id"],
                    );
                    $openCompetitionInfo = $BRSProcessor->processOpenAvailability(
                        $openField,
                        $golfCourses[$row["id"]]["bookingLink"],
                    );

                    $slotsAvailable = $openCompetitionInfo["slotsAvailable"];

                    require_once "../api/database/database.php";
                    require_once "../api/opens/opens.php";

                    $database = new database();

                    $opens = new opens();
                    $opens->updateOpenInformation(
                        $database->getDatabaseConnection(),
                        $row["id"],
                        $open["competition_id"],
                        $row["brsCourseId"],
                        $open["date"],
                        $open["name"],
                        $slotsAvailable,
                    );
                }
            }
        }
    }
}

if ($_GET["load"] == "intelligent") {
    $sql = "
    SELECT *
    FROM clubs
    WHERE openBookingSystem = 'intelligent'
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            require_once "../api/call/intelligentCall.php";
            require_once "../api/processor/intelligentProcessor.php";

            $intelligentCall = new intelligentCall();
            $intelligentProcessor = new IntelligentProcessor();

            $opens = $intelligentCall->getAllOpensForCourse(
                $golfCourses[$row["id"]]["baseUrl"],
                $golfCourses[$row["id"]]["openBookingLink"],
            );

            if ($opens) {
                foreach ($opens as $open) {
                    if (
                        isset($open["competition_id"]) &&
                        !empty($open["competition_id"])
                    ) {
                        echo $row["id"] . $open["name"] . "<br>";
                        $slotsAvailable = "No";

                        $openField = $intelligentCall->checkOpenAvailability(
                            $golfCourses[$row["id"]]["baseUrl"],
                            $row["id"],
                            $open["competition_id"],
                        );
                        $openCompetitionInfo = $intelligentProcessor->processOpenAvailability(
                            $openField,
                            $row["id"],
                            $open["competition_id"],
                        );

                        $slotsAvailable =
                            $openCompetitionInfo["slotsAvailable"];

                        require_once "../api/database/database.php";
                        require_once "../api/opens/opens.php";

                        $database = new database();

                        $opens = new opens();
                        $opens->updateOpenInformation(
                            $database->getDatabaseConnection(),
                            $row["id"],
                            $open["competition_id"],
                            $row["courseId"],
                            $open["date"],
                            $open["name"],
                            $slotsAvailable,
                        );
                    }
                }
            }
        }
    }
}
