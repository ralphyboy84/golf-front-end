<?php

header("Access-Control-Allow-Origin: *");
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

$opens = [];

if ($_GET["clubid"]) {
    $sql = "
    SELECT opens.clubid, opens.courseid, openid, opens.name, date, openBookingSystem, openBookingLink, opens.token, clubs.brsDomain
    FROM opens, clubs
    WHERE opens.clubid = '{$_GET["clubid"]}'
    AND opens.clubid = clubs.id
    ORDER BY date ASC
    ";

    $result = $mysqli->query($sql);

    if ($result->num_rows > 0) {
        $x = 0;
        while ($row = $result->fetch_assoc()) {
            $opens[$x] = $row;
            $x++;
        }
    }

    $opens = array_map(function ($open) {
        return mb_convert_encoding($open, "UTF-8", "auto");
    }, $opens);
}

echo json_encode($opens, JSON_UNESCAPED_UNICODE);
