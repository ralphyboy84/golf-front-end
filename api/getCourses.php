<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "courses.php";

if (isset($golfCourses)) {
    $golfCourses = array_map(function ($course) {
        return mb_convert_encoding($course, "UTF-8", "auto");
    }, $golfCourses);

    echo json_encode($golfCourses, JSON_UNESCAPED_UNICODE);
} else {
    echo "{}";
}
