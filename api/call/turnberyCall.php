<?php

require_once "Call.php";

class TurnberyCall extends Call
{
    public function getTeeTimesForDay($date, $courseId)
    {
        $date = $this->format_date($date);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
            CURLOPT_COOKIEJAR => __DIR__ . "/cookies.txt",
            CURLOPT_COOKIEFILE => __DIR__ . "/cookies.txt",
            CURLOPT_HTTPHEADER => [
                "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language: en-GB,en;q=0.9",
                "Connection: keep-alive",
            ],
        ]);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt(
            $ch,
            CURLOPT_URL,
            "https://turnberry.booktrump.com/teetimes/fetch/teetimeavailability/?courseId=$courseId&date=$date&propertyId=49&noOfGolfers=2",
        );
        $server_output = curl_exec($ch);
        $test = preg_replace("/^HTTP\/2\s+200\s.*?\R\R/s", "", $server_output);
        return json_decode($test, true);
    }

    protected function format_date($date)
    {
        $parts = explode("-", $date);
        return $parts[1] . "/" . $parts[2] . "/" . $parts[0];
    }
}
