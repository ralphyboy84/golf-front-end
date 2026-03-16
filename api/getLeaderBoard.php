<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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
SELECT COUNT(*) as 'Total'
FROM clubs
";

$result = $mysqli->query($sql);
$row = $result->fetch_assoc();
$totalClubs = $row["Total"];

$sql = "
SELECT COUNT(*) as 'Total', userid
FROM usercourses
GROUP BY userid
ORDER BY Total DESC
";

$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    $x = 0;

    while ($row = $result->fetch_assoc()) {
        $info[$x] = $row;
        $info[$x]["totalCourses"] = $totalClubs;

        if (isset($_SESSION["username"])) {
            if ($row["userid"] == $_SESSION["username"]) {
                $info[$x]["you"] = 1;
            }
        }
        $x++;
    }

    echo json_encode($info);
}
