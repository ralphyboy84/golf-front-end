<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

require_once "courses.php";

if (isset($golfCourses)) {
    $golfCourses = array_map(function ($course) {
        return mb_convert_encoding($course, "UTF-8", "auto");
    }, $golfCourses);

    if (isset($_SESSION["username"])) {
        $courseIdSql = "";

        if (isset($_GET["courseId"])) {
            $courseIdSql = " AND courseid = '{$_GET["courseId"]}' ";
        }

        $sql = "
        SELECT *
        FROM usercourses
        WHERE userid = '{$_SESSION["username"]}'
        $courseIdSql 
        ";

        $result = $mysqli->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if (
                    isset($golfCourses[$row["courseid"]]) &&
                    !empty($golfCourses[$row["courseid"]])
                ) {
                    $golfCourses[$row["courseid"]]["played"] = 1;
                }
            }
        }
    }

    if (
        isset($_GET["played"]) &&
        !empty($_GET["played"]) &&
        $_GET["played"] == "Yes"
    ) {
        $golfCourses = array_filter($golfCourses, function ($course) {
            // We check if the 'played' key exists AND if it is truthy
            return isset($course["played"]) && $course["played"];
        });
    } elseif (
        isset($_GET["played"]) &&
        !empty($_GET["played"]) &&
        $_GET["played"] == "No"
    ) {
        $golfCourses = array_filter($golfCourses, function ($course) {
            // We check if the 'played' key exists AND if it is truthy
            return !isset($course["played"]) || !$course["played"];
        });
    }

    echo json_encode($golfCourses, JSON_UNESCAPED_UNICODE);
} else {
    echo "{}";
}
