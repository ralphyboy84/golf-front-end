<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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

$selectedVenues = ["carnoustie", "crudenbay", "northberwick"];

$sql = "
SELECT *
FROM clubs
WHERE id = '{$_GET["courseid"]}'
";

$result = $mysqli->query($sql);

$newResult = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $fromLat = $row["lat"];
        $fromLon = $row["lon"];
    }
}

foreach ($selectedVenues as $venue) {
    $sql = "
    SELECT *
    FROM clubs
    WHERE id = '$venue'
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $toLat = $row["lat"];
            $toLon = $row["lon"];
            $name = $row["name"];
        }
    }

    $sql = "
    SELECT *
    FROM mapping
    WHERE from_lat = '$fromLat'
    AND from_lon = '$fromLon'
    AND to_lat = '$toLat'
    AND to_lon = '$toLon'
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $newResult[$venue] = [
                "distance" => $row["distance"],
                "duration" => gmdate("H:i:s", $row["duration"]),
                "name" => $name,
            ];
        }
    }
}

echo json_encode($newResult);
