<?php

require_once "Call.php";

class ClubV1Call extends Call
{
    private function _doCurlCall($url)
    {
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERAGENT => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        ]);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_URL, $url);
        $server_output = curl_exec($ch);
        return preg_replace("/^HTTP\/2\s+200\s.*?\R\R/s", "", $server_output);
    }

    public function getTeeTimesForDay($date, $club, $courseId)
    {
        return $this->_doCurlCall(
            "https://$club.hub.clubv1.com/Visitors/TeeSheet?date=$date&courseId=$courseId",
        );
    }

    public function getAllOpensForCourse($clubId)
    {
        $opens = $this->_doCurlCall(
            "https://hub.howdidido.com/directory/OpenCompetitions?id=$clubId",
        );

        $opens = str_replace("<br />", "", $opens);
        $opens = str_replace('style="height: 60px"', "", $opens);
        $opens = str_replace("Booking closes", "", $opens);
        $opens = str_replace("View Competition", "<div></div>", $opens);
        $opens = str_replace(
            "<i class='pull-right fa fa-calendar' title='view'></i>",
            "",
            $opens,
        );

        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($opens, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $xpath = new DOMXPath($dom);
        $node = $xpath->query('//*[@id="main-content"]')->item(0);

        if ($node) {
            $innerHTML = "";

            foreach ($node->childNodes as $child) {
                $innerHTML .= $dom->saveHTML($child);
            }
        }

        $tmp = json_encode(simplexml_load_string("$innerHTML"));
        $tmp = json_decode($tmp, true);

        $openFlag = false;
        $greenFee = false;
        $availableDate = "TBC";
        $token = false;

        $openCompetitions = [];

        if (
            isset($tmp["div"]["div"]["div"]["h3"]) &&
            trim($tmp["div"]["div"]["div"]["h3"]) ==
                "Currently there are no competitions for you to book into"
        ) {
            return $openCompetitions;
        }

        if (isset($tmp["div"]["div"]["div"])) {
            foreach ($tmp["div"]["div"]["div"] as $open) {
                $token = "";
                $memberGreenFee = "";
                $visitorGreenFee = "";
                $competitionId = "";
                $bookingOpen = "Yes";
                $date = "";
                $name = "";

                if (isset($open["div"]["div"]["div"])) {
                    if (
                        isset($open["div"]["div"]["div"][2]) &&
                        !is_array($open["div"]["div"]["div"][2])
                    ) {
                        $bookingOpen = "No";
                    }

                    if (
                        isset(
                            $open["div"]["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        )
                    ) {
                        $token = $this->_format_token(
                            $open["div"]["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        );
                    }

                    if (isset($open["div"]["div"]["div"][1]["span"][7])) {
                        $memberGreenFee = str_replace(
                            "£",
                            "",
                            $open["div"]["div"]["div"][1]["span"][7],
                        );
                    }

                    if (isset($open["div"]["div"]["div"][1]["span"][9])) {
                        $visitorGreenFee = str_replace(
                            "£",
                            "",
                            $open["div"]["div"]["div"][1]["span"][9],
                        );
                    }

                    if (
                        isset(
                            $open["div"]["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        )
                    ) {
                        $competitionId = $this->_format_course_id(
                            $open["div"]["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        );
                    }

                    $date = $open["div"]["div"]["div"][1]["span"][1];
                    $name = $open["div"]["div"]["div"][0]["a"];
                } elseif (isset($open["div"]["div"])) {
                    if (
                        isset($open["div"]["div"][2]) &&
                        !is_array($open["div"]["div"][2])
                    ) {
                        $bookingOpen = "No";
                    }

                    if (
                        isset(
                            $open["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        )
                    ) {
                        $token = $this->_format_token(
                            $open["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        );
                    }

                    if (isset($open["div"]["div"][1]["span"][7])) {
                        $memberGreenFee = str_replace(
                            "£",
                            "",
                            $open["div"]["div"][1]["span"][7],
                        );
                    }

                    if (isset($open["div"]["div"][1]["span"][9])) {
                        $visitorGreenFee = str_replace(
                            "£",
                            "",
                            $open["div"]["div"][1]["span"][9],
                        );
                    }

                    if (
                        isset(
                            $open["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        )
                    ) {
                        $competitionId = $this->_format_course_id(
                            $open["div"]["div"][2]["span"][1]["a"][
                                "@attributes"
                            ]["href"],
                        );
                    }

                    $date = $open["div"]["div"][1]["span"][1];
                    $name = $open["div"]["div"][0]["a"];
                }

                if ($date || $name) {
                    $openCompetitions[] = [
                        "competition_id" => $competitionId,
                        "member_green_fee" => $memberGreenFee,
                        "visitor_green_fee" => $visitorGreenFee,
                        "token" => $token,
                        "date" => $date,
                        "date_formatted" => $this->_format_date($date),
                        "name" => $name,
                        "bookingOpen" => $bookingOpen,
                    ];
                }
            }
        }

        return $openCompetitions;
    }

    public function checkOpenAvailability($token, $openId)
    {
        return $this->_doCurlCall(
            "https://howdidido-whs.clubv1.com/hdidbooking/open?token=$token&cid=$openId&rd=1",
        );
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

    private function _format_date($date)
    {
        $dateTime = DateTime::createFromFormat("d/m/Y", $date);

        if ($dateTime === false) {
            return null; // invalid date format
        }

        return $dateTime->format("Y-m-d");
    }
}
