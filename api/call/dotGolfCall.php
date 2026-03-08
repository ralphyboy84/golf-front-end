<?php

require_once "Call.php";

class DotGolfCall extends Call
{
    public function getTeeTimesForDay($date, $baseUrl, $clubId, $courseId)
    {
        if ($courseId === "0") {
            $courseId = "";
        }

        $ch = curl_init(
            "$baseUrl?ClubId=$clubId&CourseId=$courseId&Date=$date",
        );

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_USERAGENT,
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        );

        return curl_exec($ch);
    }

    public function getAllOpensForCourse($clubId)
    {
        $ch = curl_init();

        $params = [
            "pageNumber" => 1,
            "pageSize" => 500,
            "clubIds" => $clubId,
            "sorting" => [
                [
                    "orderBy" => "CompetitionDate",
                    "order" => "ASC",
                ],
            ],
            "dateFrom" => "Sun Mar 08 2026",
            "dateTo" => "Thu Dec 31 2026",
            "regionIds" => "",
            "provinceIds" => "",
            "competitionFixtureTypeIds" => "",
            "competitionScoreFormatIds" => "",
            "isNineHoles" => "",
            "genders" => "",
            "userLatitude" => 56.613289,
            "userLongitude" => -3.46239,
            "radius" => "",
            "applyContentModeration" => "false",
            "fixtureAgeGroup" => "",
            "fixtureStatus" => "Unpublished",
        ];

        curl_setopt_array($ch, [
            CURLOPT_URL => "https://www.scottishgolf.org/api/competitions/GetFixtures",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($params), // form encoded
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/x-www-form-urlencoded",
            ],
        ]);

        curl_close($ch);
        $response = curl_exec($ch);
        return json_decode($response, true);
    }

    // public function checkOpenAvailability($club, $openId)
    // {
    //     return $this->_doCorsCall(
    //         "https://visitors.brsgolf.com/api/openCompetitions/teesheet/$openId",
    //         $club,
    //     );
    // }
}
