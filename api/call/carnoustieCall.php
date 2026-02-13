<?php

require_once "Call.php";

class CarnoustieCall extends Call
{
    public function getTeeTimesForDay($date, $courseId)
    {
        $url = "https://booking.carnoustie.com/api/v1/courses/$courseId/diary?start_date={$date}&slot_type=1&filter_today=1";

        $headers = ["x-api-key: b9eae61d-71a7-4b47-98bf-50b3823695b1"];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_USERAGENT,
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        );

        return curl_exec($ch);
    }
}
