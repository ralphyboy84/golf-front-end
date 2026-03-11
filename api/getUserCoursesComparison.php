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

$sql = "
SELECT usercourses.courseid, name,
    IF (
        EXISTS(
        SELECT 1
        FROM usercourses as x
        WHERE x.courseid = usercourses.courseid
        AND userid = '{$_SESSION["username"]}'
        ),
        1,
        0
    ) as 'played'
FROM usercourses, clubs
WHERE userid = '{$_GET["username"]}'
AND clubs.id = usercourses.courseid
";

$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    $x = 0;

    while ($row = $result->fetch_assoc()) {
        $userCourses[$x] = $row;
        $x++;
    }
} else {
    $userCourses = [];
}

echo json_encode($userCourses);
