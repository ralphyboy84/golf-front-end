<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

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

$sql = "
SELECT *
FROM users
WHERE username = '{$_POST["username"]}'
";

$result = $mysqli->query($sql);

if ($result->num_rows == 0) {
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $sql = "
    INSERT INTO users (`username`, `password`)
    VALUES
    ('{$_POST["username"]}', '$password')
    ";

    $mysqli->query($sql);

    $args["success"] = "user created";
    session_start();
    $_SESSION["username"] = $_POST["username"];
} else {
    $args["error"] = "user already exists";
}

echo json_encode($args);
