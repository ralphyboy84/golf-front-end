<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

session_start();

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

if ($_SESSION["username"]) {
    $sql = "
    DELETE
    FROM usercourses
    WHERE userid = '{$_SESSION["username"]}'
    AND courseid = '{$_POST["courseid"]}'
    ";

    $result = $mysqli->query($sql);
    $args["success"] = "link created";
} else {
    $args["error"] = "no session";
}

echo json_encode($args);
