<?php

require_once "Call.php";

class GleneaglesCall extends Call
{
    public function getTeeTimesForDay($date, $courseId)
    {
        $args = explode("-", $date);

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
            "https://pursuits.gleneagles.com/reservations/template/21459/availability/?day={$args[2]}&month={$args[1]}&year={$args[0]}&templateId=$courseId&time=Anytime",
        );

        $response = curl_exec($ch);
        return preg_replace('~\A.*?\r?\n\r?\n~s', "", $response);
    }

    protected function format_date($date)
    {
        $parts = explode("-", $date);
        return $parts[1] . "/" . $parts[2] . "/" . $parts[0];
    }
}
