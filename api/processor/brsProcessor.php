<?php

require_once "Processor.php";

class BRSProcessor extends Processor
{
    public function processTeeTimeForDay($club, $json, $info, $date)
    {
        $data = json_decode($json, true);

        if (isset($data["message"]) && !empty($data["message"])) {
            return [
                "teeTimesAvailable" => "No",
                "date" => $this->_format_date($date),
            ];
        }

        if ($data["data"]["tee_times"]) {
            $x = sizeof($data["data"]["tee_times"]);
            $start = $data["data"]["tee_times"][0]["time"];

            foreach ($data["data"]["tee_times"] as $teeTime) {
                $greenFees[] = $this->_get_green_fee($teeTime["green_fees"]);
            }

            $uniqueFees = array_unique(array_filter($greenFees));
            sort($uniqueFees);

            return [
                "date" => $this->_format_date($date),
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => $x,
                "firstTime" => $start,
                "cheapestPrice" => $uniqueFees[0],
            ];
        } else {
            return [
                "date" => $this->_format_date($date),
                "teeTimesAvailable" => "No",
            ];
        }
    }

    public function checkForOpenOnDay($opens, $date)
    {
        $data = json_decode($opens, true);

        $competitionId = false;
        $greenFee = false;
        $availableDate = false;
        $bookingOpen = "No";
        $name = "";

        if (isset($data["data"])) {
            foreach ($data["data"] as $open) {
                if ($open["date"] == $date) {
                    $competitionId = $open["competition_id"];
                    $greenFee = $open["visitor_green_fee"];
                    $availableDate = $open["available_date"];
                    $name = $open["name"];

                    if ($this->_check_past_date($availableDate)) {
                        $bookingOpen = "Yes";
                    }
                }
            }
        }

        if ($competitionId) {
            return $this->returnCheckForOpenOnDayParams(
                $this->_format_date($date),
                $competitionId,
                $greenFee,
                $this->_format_date($availableDate),
                $bookingOpen,
                $name,
            );
        }

        return [];
    }

    public function processOpenAvailability($entryList, $bookingUrl)
    {
        $data = json_decode($entryList, true);

        $available = "No";

        if (isset($data["data"]["tee_times"])) {
            foreach ($data["data"]["tee_times"] as $teeTime) {
                foreach ($teeTime["slots"] as $slot) {
                    if ($slot["status"] == "Available") {
                        $available = "Yes";
                    }
                }
            }
        }

        return [
            "slotsAvailable" => $available,
            "openBookingUrl" => $bookingUrl,
        ];
    }

    public function getOpenOfType($opens, $type)
    {
        $opens = json_decode($opens, true);

        $returnArray = [];
        $typeArray = [
            "MastersTexasScramble" => [
                "Masters",
                "Masters Texas Scramble",
                "Golf in Scotland Texas Scramble",
                "US Masters Texas Scramble",
            ],
        ];

        foreach ($opens["data"] as $open) {
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

    protected function _get_green_fee($fees)
    {
        return $fees[0]["green_fee1_ball"];
    }

    protected function _check_past_date($date)
    {
        $givenDate = new DateTime($date);
        $today = new DateTime("today");

        return $givenDate < $today;
    }
}
