<?php

class Opens
{
    public function updateOpenInformation(
        $dbh,
        $club,
        $competitionId,
        $courseId,
        $date,
        $openName,
        $slotsAvailable,
        $token = false,
    ) {
        $sql = "
        SELECT *
        FROM opens
        WHERE clubid = '{$club}'
        AND courseid = '{$courseId}'
        AND date = '{$date}'
        ";

        $result = $dbh->query($sql);

        if ($result->num_rows == 0) {
            $openName = str_replace("'", "", $openName);

            $sql = "
            INSERT INTO opens(clubid, courseid, openid, name, date, availability, slots, token)
            VALUES
            ('{$club}', '{$courseId}', '{$competitionId}', '{$openName}', '{$date}', '{$slotsAvailable}', '1', '$token')
            ";

            $dbh->query($sql);
        } else {
            $tokenSql = "";

            if ($token) {
                $tokenSql = " token = '{$token}', ";
            }

            $updatedDate = date("Y-m-d H:i:s");

            $sql = "
            UPDATE opens
            SET availability = '{$slotsAvailable}',
            openid = '{$competitionId}',
            slots = '2',
            $tokenSql
            lastupdate = '$updatedDate'
            WHERE clubid = '{$club}'
            AND courseid = '{$courseId}'
            AND date = '{$date}'
            ";

            $dbh->query($sql);
        }
    }

    public function getAllOpens(
        $dbh,
        $regions = false,
        $top100 = false,
        $courses = false,
        $keywords = false,
        $distance = false,
        $latlon = false,
    ) {
        $regionSql = "";
        $top100Sql = "";
        $coursesSql = "";
        $keywordSql = "";

        $sqlParams = [];
        $selectParams = [];

        if ($regions) {
            $regionArgs = explode(",", $regions);

            foreach ($regionArgs as $region) {
                $tmp[] = "'$region'";
            }

            $regionSql = " AND clubs.region IN (" . implode(", ", $tmp) . ") ";
            unset($tmp);
        }

        if ($courses) {
            $clubArgs = explode(",", $courses);

            foreach ($clubArgs as $region) {
                $tmp[] = "'$region'";
            }

            $coursesSql = " AND clubs.id IN (" . implode(", ", $tmp) . ") ";
        }

        if ($keywords) {
            $keyArgs = explode(",", $keywords);

            foreach ($keyArgs as $keyword) {
                $tmp[] = " opens.name LIKE '%$keyword%'";
            }

            $keywordSql = " AND " . implode(" AND ", $tmp);
            unset($tmp);
        }

        if ($top100 && $top100 == "Yes") {
            $top100Sql = " AND clubs.top100 = 1 ";
        } elseif ($top100 && $top100 == "No") {
            $top100Sql = " AND clubs.top100 = 0";
        }

        if ($distance && $latlon) {
            $latLonArgs = explode(",", $latlon);
            $lat = $latLonArgs[0];
            $lon = $latLonArgs[1];

            $sqlParams[] = "
                location IS NOT NULL
                AND ST_Distance_Sphere(
                    location,
                    ST_GeomFromText('POINT($lon $lat)')
                ) <= $distance
                AND onlineBooking = 'Yes'
                ";

            $selectParams[] = "
                ST_Distance_Sphere(
                    location,
                    ST_GeomFromText('POINT($lon $lat)')
                ) as 'distance'
                ";
        }

        $selectSql = "";
        $additionalSql = "";

        if ($selectParams) {
            $selectSql = ", " . implode(", ", $selectParams);
        }

        if ($sqlParams) {
            $additionalSql = " AND " . implode(" AND ", $sqlParams);
        }

        $sql = "
        SELECT *, 
        opens.name as 'compName'
        $selectSql
        FROM opens, clubs
        WHERE opens.clubid = clubs.id
        $regionSql 
        $top100Sql
        $coursesSql
        $keywordSql
        $additionalSql 
        ";

        $result = $dbh->query($sql);

        $tmp = [];
        $count = 0;

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $backgroundColor = "orange";

                if ($row["availability"] == "Yes") {
                    $backgroundColor = "green";
                }

                $openBookingLink = "";

                if ($row["openBookingSystem"] == "intelligent") {
                    $openBookingLink = "{$row["baseUrl"]}/competition2.php?tab=details&compid={$row["openid"]}";
                } elseif ($row["openBookingSystem"] == "brs") {
                    $openBookingLink =
                        str_replace(
                            "course/1",
                            "open-competitions",
                            $row["openBookingLink"],
                        ) . "/{$row["openid"]}/teesheet";
                } elseif ($row["openBookingSystem"] == "clubv1") {
                    $openBookingLink = "https://howdidido-whs.clubv1.com/hdidbooking/open?token={$row["token"]}&cid={$row["openid"]}&rd=1";
                }

                $tmp[$count] = [
                    "date" => $row["date"],
                    "title" => $row["name"] . " - " . $row["compName"],
                    "availability" => $row["availability"],
                    "backgroundColor" => $backgroundColor,
                    "url" => $openBookingLink,
                ];

                $count++;
            }
        }

        return $tmp;
    }
}
