<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

require_once "database/database.php";
require_once "opens/opens.php";

$database = new database();

$regions = "";
$courses = "";
$top100 = "";
$keyword = "";
$distance = "";
$latlon = "";

if (isset($_GET["regions"]) && !empty($_GET["regions"])) {
    $regions = $_GET["regions"];
}

if (isset($_GET["top100"]) && !empty($_GET["top100"])) {
    $top100 = $_GET["top100"];
}

if (isset($_GET["courses"]) && !empty($_GET["courses"])) {
    $courses = $_GET["courses"];
}

if (isset($_GET["keyword"]) && !empty($_GET["keyword"])) {
    $keyword = $_GET["keyword"];
}

if (isset($_GET["distance"]) && !empty($_GET["distance"])) {
    $distance = $_GET["distance"];
}

if (isset($_GET["latlon"]) && !empty($_GET["latlon"])) {
    $latlon = $_GET["latlon"];
}

$opens = new opens();
$allOpens = $opens->getAllOpens(
    $database->getDatabaseConnection(),
    $regions,
    $top100,
    $courses,
    $keyword,
    $distance,
    $latlon,
);

echo json_encode($allOpens, JSON_INVALID_UTF8_SUBSTITUTE);
