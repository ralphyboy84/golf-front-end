<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

session_start();

if (isset($_SESSION["username"]) && !empty($_SESSION["username"])) {
    $args["username"] = $_SESSION["username"];
} else {
    $args["error"] = 1;
}

echo json_encode($args);
