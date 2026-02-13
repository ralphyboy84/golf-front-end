<?php

require_once "Processor.php";

class GleneaglesProcessor extends Processor
{
    public function processTeeTimeForDay($data, $club, $date)
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML($data, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

        $xpath = new DOMXPath($dom);
        $node = $xpath->query('//*[@class="availabilities"]')->item(0);

        $innerHTML = "";

        if ($node) {
            foreach ($node->childNodes as $child) {
                $innerHTML .= $dom->saveHTML($child);
            }
        }

        if ($innerHTML) {
            $tmp = json_encode(simplexml_load_string("<div>$innerHTML</div>"));
            $tmp = json_decode($tmp, true);
        }

        if (isset($tmp["div"])) {
            $count = 0;
            $firstTime = "";
            $price = "";
            $greenFees = [];

            foreach ($tmp["div"] as $row) {
                if (isset($row["button"])) {
                    $count++;

                    if (!$firstTime) {
                        $firstTime = $row["button"]["@attributes"]["data-from"];
                    }

                    $greenFees[] = $row["button"]["@attributes"]["data-price"];
                }
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
