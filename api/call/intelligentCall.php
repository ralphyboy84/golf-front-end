<?php

require_once "Call.php";

class IntelligentCall extends Call
{
    private function _doCurlCall($url)
    {
        // $post_data = [
        //     "date" => "17-01-2026",
        //     "group" => 1,
        //     "requestType" => "ajax",
        // ];

        // $ch = curl_init();
        // curl_setopt_array($ch, [
        //     CURLOPT_RETURNTRANSFER => true,
        //     CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        // ]);
        // curl_setopt($ch, CURLOPT_HEADER, true);
        // curl_setopt($ch, CURLOPT_URL, $url);
        // curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
        // $server_output = curl_exec($ch);
        // return preg_replace("/^HTTP\/2\s+200\s.*?\R\R/s", "", $server_output);
    }

    public function getTeeTimesForDay($baseUrl, $date, $courseId)
    {
        $ch = curl_init("$baseUrl/visitorbooking/");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_COOKIEJAR => __DIR__ . "/cookies.txt",
            CURLOPT_COOKIEFILE => __DIR__ . "/cookies.txt",
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => "Mozilla/5.0",
        ]);
        curl_exec($ch);
        curl_close($ch);

        // Step 2: POST availability
        $ch = curl_init("$baseUrl/visitorbooking/");
        $post = [
            "date" => $date,
        ];

        if ($courseId) {
            $post["course"] = $courseId;
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($post),
            CURLOPT_COOKIEJAR => __DIR__ . "/cookies.txt",
            CURLOPT_COOKIEFILE => __DIR__ . "/cookies.txt",
            CURLOPT_HTTPHEADER => [
                "X-Requested-With: XMLHttpRequest",
                "Referer: $baseUrl/visitorbooking/",
                "Accept: application/json",
            ],
            CURLOPT_USERAGENT => "Mozilla/5.0",
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    public function getAllOpensForCourse($baseUrl, $bookingPage)
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        ]);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_URL, "$baseUrl/$bookingPage.php");
        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        curl_close($ch);

        // Split response
        $headers = substr($response, 0, $headerSize);
        $response = substr($response, $headerSize);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON: " . json_last_error_msg());
        }

        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML(
            '<?xml encoding="UTF-8">' . $response,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        $xpath = new DOMXPath($dom);

        // Query all tr elements inside the table
        $trs = $xpath->query(
            '//table[contains(@class, "comps-list-table")]//tr',
        );

        if ($trs->length === 0) {
            return [];
        }

        // Loop through the rows
        foreach ($trs as $tr) {
            // Get the comp id from the hidden input
            $compId = $xpath
                ->query('.//input[@name="compid"]', $tr)
                ->item(0)
                ->getAttribute("value");

            // Get the competition name
            $compName = $xpath
                ->query('.//td[contains(@class, "comp-name-td")]//a', $tr)
                ->item(0)->textContent;

            if (!$compName) {
                // Get the competition name
                $compName = $xpath
                    ->query('.//td[contains(@class, "comp-name-td")]//a', $tr)
                    ->item(1)->textContent;
            }

            // Get the date
            $compDate = $xpath
                ->query('.//div[contains(@class, "comp-date")]', $tr)
                ->item(0)->textContent;

            // Get the fee
            $compFeeNode = $xpath
                ->query('.//span[contains(@class, "comp-fee-price")]', $tr)
                ->item(0);
            $compFee = $compFeeNode ? $compFeeNode->textContent : "N/A";

            $compSignUpNode = $xpath
                ->query(
                    './/div[contains(@class, "comp-signup-time-info")]',
                    $tr,
                )
                ->item(0);

            $date = "";

            $compSignUpDate = $compSignUpNode
                ? $compSignUpNode->textContent
                : "";

            if (
                $compSignUpDate &&
                str_contains($compSignUpDate, "Signup Opens") &&
                preg_match(
                    "/\b(\d{1,2}\/\d{1,2}\/\d{4})\b/",
                    $compSignUpDate,
                    $matches,
                )
            ) {
                $date = $matches[1];
            }

            // Use strtotime to parse the date
            $timestamp = strtotime($compDate);

            // Format it to YYYY-MM-DD
            $formattedDate = date("Y-m-d", $timestamp);

            $openCompetitions[] = [
                "competition_id" => $compId,
                "member_green_fee" => $compFee,
                "visitor_green_fee" => $compFee,
                "date" => $formattedDate,
                "name" => $compName,
                "available_date" => $date,
            ];
        }

        return $openCompetitions;
    }

    public function checkOpenAvailability($baseUrl, $club, $openId)
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        ]);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt(
            $ch,
            CURLOPT_URL,
            "$baseUrl/online_signup_ajax_api.php?compid=$openId&stage=teetime&go=signup&requestType=ajax",
        );
        $response = curl_exec($ch);
        $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        curl_close($ch);

        // Split response
        $headers = substr($response, 0, $headerSize);
        return substr($response, $headerSize);
    }

    private function _format_course_id($url)
    {
        preg_match("/[?&]cid=(\d+)/", $url, $matches);
        return $matches[1];
    }

    private function _format_token($url)
    {
        preg_match("/[?&]token=([^&]+)/", $url, $matches);
        return $matches[1];
    }
}
