<?php

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

$sqlParams = [];
$selectParams = [];
$orderByParams = [];

if (isset($_GET["location"]) && !empty($_GET["location"])) {
    $sqlParams[] = " lat != '0.000000' ";
}

if (isset($_GET["onlineBooking"]) && !empty($_GET["onlineBooking"])) {
    $sqlParams[] = " onlineBooking = '" . $_GET["onlineBooking"] . "' ";
}

if (
    isset($_GET["courseQualityOption"]) &&
    !empty($_GET["courseQualityOption"])
) {
    $args = explode(",", $_GET["courseQualityOption"]);

    foreach ($args as $category) {
        $newArgs[] = "'$category'";
    }

    $sqlParams[] = " category IN (" . implode(",", $newArgs) . ") ";
}

if (
    isset($_GET["courseTypeOption"]) &&
    !empty($_GET["courseTypeOption"]) &&
    $_GET["courseTypeOption"] != "na"
) {
    $sqlParams[] = " coursetype = '{$_GET["courseTypeOption"]}' ";
}

if (
    isset($_GET["lat"]) &&
    !empty($_GET["lat"]) &&
    isset($_GET["travelDistanceOption"]) &&
    !empty($_GET["travelDistanceOption"])
) {
    $lat = $_GET["lat"];
    $lon = $_GET["lon"];
    $travelDistanceOption = $_GET["travelDistanceOption"];

    if ($_SERVER["HTTP_HOST"] == "localhost") {
        $selectParams[] = "
        ST_Distance_Sphere(
            location,
            ST_SRID(POINT($lon, $lat), 4326)
        ) as 'distance'
        ";

        $sqlParams[] = "
        location IS NOT NULL
        AND ST_Distance_Sphere(
            location,
            ST_SRID(POINT($lon, $lat), 4326)
        ) <= $travelDistanceOption
        AND onlineBooking = 'Yes'
        ";
    } else {
        $sqlParams[] = "
        location IS NOT NULL
        AND ST_Distance_Sphere(
            location,
            ST_GeomFromText('POINT($lon $lat)')
        ) <= $travelDistanceOption
        AND onlineBooking = 'Yes'
        ";

        $selectParams[] = "
        ST_Distance_Sphere(
            location,
            ST_GeomFromText('POINT($lon $lat)')
        ) as 'distance'
        ";
    }

    $orderByParams[] = "distance";
}

$selectSql = "";
$additionalSql = "";
$orderBySql = "";

if ($selectParams) {
    $selectSql = ", " . implode(", ", $selectParams);
}

if ($sqlParams) {
    $additionalSql = " WHERE " . implode(" AND ", $sqlParams);
}

if ($orderByParams) {
    $orderBySql = implode(", ", $orderByParams) . ", ";
}

$sql = "
SELECT *
$selectSql
FROM clubs
$additionalSql 
ORDER BY $orderBySql name ASC
";

$result = $mysqli->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $golfCourses[$row["id"]] = [
            "name" => $row["name"],
            "bookingLink" => $row["bookingLink"],
            "openBookingLink" => $row["openBookingLink"],
            "onlineBooking" => $row["onlineBooking"],
            "openBooking" => $row["openBooking"],
            "bookingSystem" => $row["bookingSystem"],
            "openBookingSystem" => $row["openBookingSystem"],
            "availabilityDays" => format_availability_days(
                $row["availabilityDays"],
            ),
            "region" => $row["region"],
            "working" => $row["working"],
            "location" => [
                "lat" => $row["lat"],
                "lon" => $row["lon"],
            ],
            "courseId" => $row["courseId"],
            "clubId" => $row["clubId"],
            "reason" => $row["reason"],
            "baseUrl" => $row["baseUrl"],
            "clubv1hub" => $row["clubv1hub"],
            "clubv1opencourseid" => $row["clubv1opencourseid"],
            "brsDomain" => $row["brsDomain"],
            "brsCourseId" => $row["brsCourseId"],
            "image" => $row["image"],
        ];

        unset($coursesArray);
    }
}

function format_availability_days($days)
{
    $days = explode(",", $days);

    if ($days && !empty($days[0])) {
        return $days;
    }

    return;
}

function get_course_name($course, $golfCourses, $courseId = false)
{
    if (
        isset($golfCourses[$course]["courses"]) &&
        !empty($golfCourses[$course]["courses"])
    ) {
        foreach ($golfCourses[$course]["courses"] as $name => $data) {
            if ($data["courseId"] == $courseId) {
                $courseName = $name;
                break;
            }
        }

        return $golfCourses[$course]["name"] . " " . $courseName;
    }

    return $golfCourses[$course]["name"];
}

function get_booking_url($courseInfo, $date, $courseId)
{
    if ($courseInfo["bookingSystem"] == "clubv1") {
        return $courseInfo["bookingLink"] . "?date={$date}&courseId=$courseId";
    }

    if ($courseInfo["bookingSystem"] != "dotgolf") {
        return $courseInfo["bookingLink"] . "?date=" . $date;
    }

    return $courseInfo["bookingLink"] .
        "?date=$date&ClubId={$courseInfo["clubId"]}&CourseId=$courseId";
}

function get_courses_for_area($region, $courseList)
{
    $regionArray = explode(",", $region);

    $newArray = [];

    if ($regionArray) {
        foreach ($regionArray as $region) {
            foreach ($courseList as $courseName => $courseInfo) {
                if (
                    isset($courseInfo["region"]) &&
                    $courseInfo["region"] == $region
                ) {
                    $newArray[$courseName] = $courseInfo;
                }
            }
        }
    }

    return $newArray;
}

function get_courses_from_array($coursesToFind, $courseList)
{
    foreach ($courseList as $courseName => $courseInfo) {
        if (in_array($courseName, $coursesToFind)) {
            $newArray[$courseName] = $courseInfo;
        }
    }

    return $newArray;
}

if (
    isset($_GET["region"]) &&
    !empty($_GET["region"]) &&
    $_GET["region"] != "undefined"
) {
    $golfCourses = get_courses_for_area($_GET["region"], $golfCourses);
}
