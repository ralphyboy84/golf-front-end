<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "courses.php";

// Collect all regions
$regions = [];

foreach ($golfCourses as $course) {
    if (isset($course["region"]) && !empty($course["region"])) {
        $regions[] = $course["region"];
    }
}

// Get unique regions
$uniqueRegions = array_unique($regions);

// Optional: reindex the array
$uniqueRegions = array_values($uniqueRegions);
sort($uniqueRegions);

// Output
echo json_encode($uniqueRegions);
