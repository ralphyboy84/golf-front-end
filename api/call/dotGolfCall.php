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

    // public function getAllOpensForCourse($club)
    // {
    //     return $this->_doCorsCall(
    //         "https://visitors.brsgolf.com/api/openCompetitions/list",
    //         $club,
    //     );
    // }

    // public function checkOpenAvailability($club, $openId)
    // {
    //     return $this->_doCorsCall(
    //         "https://visitors.brsgolf.com/api/openCompetitions/teesheet/$openId",
    //         $club,
    //     );
    // }
}
