<?php

require_once "Processor.php";

class TrumpAberdeenProcessor extends Processor
{
    public function processTeeTimeForDay($data, $club, $date)
    {
        if (isset($data[0]["teetimes"]) && !empty($data[0]["teetimes"])) {
            $count = 0;
            $firstTime = "";
            $price = "";
            $greenFees = [];

            foreach ($data[0]["teetimes"] as $teetime) {
                $count++;

                if (!$firstTime) {
                    $firstTime = substr($teetime["teetime"], 11, 5);
                }

                $greenFees[] = substr(
                    $teetime["rates"][0]["greenFeeWalking"],
                    0,
                    3,
                );
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
