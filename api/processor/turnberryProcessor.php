<?php

require_once "Processor.php";

class TurnberryProcessor extends Processor
{
    public function processTeeTimeForDay($data, $club, $date)
    {
        if (
            isset($data["teetime_response"]) &&
            !empty($data["teetime_response"])
        ) {
            $count = 0;
            $firstTime = "";
            $price = "";
            $greenFees = [];

            foreach ($data["teetime_response"] as $teetime) {
                $count++;

                if (!$firstTime) {
                    $firstTime = $teetime["TWFourTime"];
                }

                $greenFees[] = $teetime["TeeTimeFee"];
            }

            if ($count > 0) {
                $uniqueFees = array_unique(array_filter($greenFees));
                sort($uniqueFees);

                return [
                    "date" => $this->_format_date($date),
                    "teeTimesAvailable" => "Yes",
                    "timesAvailable" => $count,
                    "firstTime" => $firstTime,
                    "cheapestPrice" => $uniqueFees[0],
                ];
            }
        }

        return [
            "date" => $this->_format_date($date),
            "teeTimesAvailable" => "No",
        ];
    }
}
