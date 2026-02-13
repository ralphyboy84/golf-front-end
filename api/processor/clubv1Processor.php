<?php

require_once "Processor.php";

class ClubV1Processor extends Processor
{
    public function processTeeTimeForDay($html, $date, $club)
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $xpath = new DOMXPath($dom);
        $node = $xpath->query('//*[@class="tees"]')->item(0);

        $innerHTML = "";

        if ($node) {
            foreach ($node->childNodes as $child) {
                $innerHTML .= $dom->saveHTML($child);
            }
        }

        if ($innerHTML) {
            $tmp = json_encode(simplexml_load_string("<div>$innerHTML</div>"));
            $tmp = json_decode($tmp, true);

            $teeTimes = 0;
            $firstTeeSet = "";

            if (isset($tmp["div"]) && is_array($tmp["div"])) {
                foreach ($tmp["div"] as $xx) {
                    if (
                        isset($xx["@attributes"]["class"]) &&
                        $xx["@attributes"]["class"] == "tee available"
                    ) {
                        $teeTimes++;

                        if (!$firstTeeSet) {
                            $time = $xx["@attributes"]["data-min-val"];

                            if (
                                strlen($xx["@attributes"]["data-min-val"]) == 1
                            ) {
                                $time =
                                    "0" . $xx["@attributes"]["data-min-val"];
                            }

                            $firstTeeSet =
                                $xx["@attributes"]["data-hour-val"] .
                                ":" .
                                $time;
                        }

                        $greenFees[] = $this->_format_green_fees($xx);
                    }
                }

                $greenFees = array_values(
                    array_filter($greenFees, fn($v) => (float) $v !== 0.0),
                );
                $uniqueFees = array_unique($greenFees);
                sort($uniqueFees);

                return [
                    "date" => $this->_format_date($date),
                    "teeTimesAvailable" => "Yes",
                    "timesAvailable" => $teeTimes,
                    "firstTime" => $firstTeeSet,
                    "cheapestPrice" => $uniqueFees[0],
                ];
            }
        }

        return [
            "date" => $this->_format_date($date),
            "teeTimesAvailable" => "No",
        ];
    }

    public function checkForOpenOnDay($opens, $date, $courseId)
    {
        $competition_id = "";
        $openExists = "";
        $greenFee = "";
        $token = "";
        $bookingOpen = "";
        $openBookingUrl = "";
        $name = "";

        if ($opens) {
            foreach ($opens as $open) {
                if ($open["date"] == $this->_format_date($date)) {
                    if (isset($open["competition_id"])) {
                        $competition_id = $open["competition_id"];
                    }

                    if (isset($open["visitor_green_fee"])) {
                        $greenFee = $open["visitor_green_fee"];
                    }

                    if (isset($open["name"])) {
                        $name = $open["name"];
                    }

                    if (isset($open["token"])) {
                        $token = $open["token"];
                    }

                    if (isset($open["bookingOpen"])) {
                        $bookingOpen = $open["bookingOpen"];

                        if ($bookingOpen == "No") {
                            $openBookingUrl = "https://hub.howdidido.com/directory/OpenCompetitions?id=$courseId";
                        }
                    }

                    $openExists = true;
                }
            }
        }

        if ($openExists) {
            return $this->returnCheckForOpenOnDayParams(
                $competition_id,
                $greenFee,
                "TBC",
                $bookingOpen,
                $name,
                $token,
                $openBookingUrl,
            );
        }

        return [];
    }

    public function processOpenAvailability($entryList, $openId, $token)
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML(
            $entryList,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        $xpath = new DOMXPath($dom);
        $node = $xpath->query('//*[@class="booking"]')->item(0);

        $innerHTML = "";

        if ($node) {
            foreach ($node->childNodes as $child) {
                $innerHTML .= $dom->saveHTML($child);
            }
        }

        $tmp = json_encode(simplexml_load_string("$innerHTML"));
        $tmp = json_decode($tmp, true);

        $available = "No";

        if (isset($tmp["div"])) {
            foreach ($tmp["div"] as $teeTime) {
                if ($teeTime["div"][0] == "Time") {
                    continue;
                }

                if (
                    isset($teeTime["div"][1]["div"]["span"]) &&
                    trim($teeTime["div"][1]["div"]["span"]) == "Available"
                ) {
                    $available = "Yes";
                }

                if (
                    isset($teeTime["div"][1]["div"][0]) &&
                    isset($teeTime["div"][1]["div"]) &&
                    is_array($teeTime["div"][1]["div"])
                ) {
                    foreach ($teeTime["div"][1]["div"] as $slot) {
                        if (
                            is_array($slot) &&
                            isset($slot["span"]) &&
                            trim($slot["span"]) == "Available"
                        ) {
                            $available = "Yes";
                        }
                    }
                }
            }
        }

        return [
            "slotsAvailable" => $available,
            "openBookingUrl" => "https://howdidido-whs.clubv1.com/hdidbooking/open?token=$token&cid=$openId&rd=1",
        ];
    }

    public function getOpenOfType($opens, $type)
    {
        $returnArray = [];
        $typeArray = [
            "MastersTexasScramble" => [
                "Masters",
                "Masters Texas Scramble",
                "Golf in Scotland Texas Scramble",
            ],
        ];

        foreach ($opens as $open) {
            if (
                $this->_string_contains_array_value(
                    $open["name"],
                    $typeArray[$type],
                )
            ) {
                $returnArray[] = $open;
            }
        }

        return $returnArray;
    }

    protected function _format_green_fees($xx)
    {
        if (isset($xx["div"][1]["div"][0]["div"]["div"][0]["div"][1])) {
            return str_replace(
                "£",
                "",
                $xx["div"][1]["div"][0]["div"]["div"][0]["div"][1],
            );
        } elseif (isset($xx["div"][1]["div"][0]["div"]["div"]["div"][1])) {
            return str_replace(
                "£",
                "",
                $xx["div"][1]["div"][0]["div"]["div"]["div"][1],
            );
        }

        return "UNK";
    }
}
