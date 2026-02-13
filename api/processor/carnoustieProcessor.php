<?php

require_once "Processor.php";

class CarnoustieProcessor extends Processor
{
    public function processTeeTimeForDay($json, $date)
    {
        $data = json_decode($json, true);

        if (
            !isset($data["data"]["diaries"]) ||
            empty($data["data"]["diaries"])
        ) {
            return [
                "teeTimesAvailable" => "No",
                "date" => $this->_format_date($date),
            ];
        }

        $x = 0;
        $start = "";

        foreach ($data["data"]["diaries"] as $teeTime) {
            if (!isset($teeTime["bookings"]) || empty($teeTime["bookings"])) {
                $x++;

                if (!$start) {
                    $startArgs = explode("T", $teeTime["slot_date_time"]);
                    $tmp = explode(":", $startArgs[1]);
                    $start = $tmp[0] . ":" . $tmp[1];
                }
            }
        }

        return [
            "date" => $this->_format_date($date),
            "teeTimesAvailable" => "Yes",
            "timesAvailable" => $x,
            "firstTime" => $start,
            "cheapestPrice" => "TBC",
        ];
    }
}
