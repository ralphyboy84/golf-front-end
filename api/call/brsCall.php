<?php

require_once "Call.php";

class BRSCall extends Call
{
    const ORIGIN = "https://visitors.brsgolf.com";

    private function _doCorsCall($url, $club)
    {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Origin: " . self::ORIGIN,
                "Referer: " . self::ORIGIN . "/$club",
            ],
            CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        ]);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_REFERER, self::ORIGIN . "/$club");

        $html = curl_exec($ch);

        preg_match_all("/Set-Cookie:\s*([^;]+)/i", $html, $matches);
        $cookie = implode("\n\n", $matches[1]);

        if (preg_match("/XSRF-TOKEN=([^\s]+)/", $cookie, $xsrfmatches)) {
            $xsrfToken = $xsrfmatches[1];
        }

        if ($xsrfToken) {
            preg_match_all("/Set-Cookie:\s*([^;]+)/i", $html, $matches);
            $cookies = implode("; ", $matches[1]);

            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
                CURLOPT_HTTPHEADER => [
                    "Cookie: " . $cookies,
                    "X-XSRF-TOKEN: " . $xsrfToken,
                    "x-requested-with: XMLHttpRequest",
                    "Accept: application/json",
                    "Origin: " . self::ORIGIN,
                    "Referer: " . self::ORIGIN . "/$club",
                ],
            ]);
            curl_setopt($ch, CURLOPT_HEADER, true);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_REFERER, self::ORIGIN . "/$club");

            $result = curl_exec($ch);

            if (preg_match('/\r?\n\r?\n(.*)$/s', $result, $m)) {
                return trim($m[1]);
            } else {
                die("No JSON found");
            }
        }
    }

    public function getTeeTimesForDay($date, $club, $courseId)
    {
        if ($courseId == "0") {
            $courseId = 1;
        }

        return $this->_doCorsCall(
            "https://visitors.brsgolf.com/api/casualBooking/teesheet?date=$date&course_id=$courseId",
            $club,
        );
    }

    public function getAllOpensForCourse($club)
    {
        return $this->_doCorsCall(
            "https://visitors.brsgolf.com/api/openCompetitions/list",
            $club,
        );
    }

    public function checkOpenAvailability($club, $openId)
    {
        return $this->_doCorsCall(
            "https://visitors.brsgolf.com/api/openCompetitions/teesheet/$openId",
            $club,
        );
    }
}
