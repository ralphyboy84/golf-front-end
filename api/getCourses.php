<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "courses.php";

if (isset($golfCourses)) {
    echo json_encode($golfCourses);
} else {
    echo "{}";
}
