<?php

require_once "Processor.php";

class IntelligentProcessor extends Processor
{
    public function processTeeTimeForDay($data, $info, $date)
    {
        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML(
            '<?xml encoding="UTF-8">' . $data,
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        $xpath = new DOMXPath($dom);
        $slots = $xpath->query(
            "//div[contains(concat(' ', normalize-space(@class), ' '), ' teetimes-slot ')]",
        );

        if ($slots->length === 0) {
            return [
                "date" => $this->_format_date($date),
                "teeTimesAvailable" => "No",
            ];
        }

        $count = 0;
        $firstTime = "";
        $price = "";

        foreach ($slots as $slot) {
            // Example: get the whole HTML of the slot
            $dom->saveHTML($slot);

            $timeNode = $xpath
                ->query(".//span[contains(@class,'slot-time')]", $slot)
                ->item(0);

            $time = $timeNode?->textContent ?? null;

            if (!$firstTime && $time) {
                $firstTime = $time;
            }

            $priceNode = $xpath
                ->query(".//span[contains(@class,'slot-price')]", $slot)
                ->item(0);

            if ($priceNode) {
                foreach ($priceNode->childNodes as $child) {
                    if ($child->nodeType === XML_TEXT_NODE) {
                        $price = str_replace("£", "", trim($child->nodeValue));
                        break; // Only first text node
                    }
                }
            }

            $count++;
        }

        return [
            "date" => $this->_format_date($date),
            "teeTimesAvailable" => "Yes",
            "timesAvailable" => $count,
            "firstTime" => $firstTime,
            "cheapestPrice" => $price,
        ];
    }

    public function checkForOpenOnDay($opens, $date)
    {
        $openFlag = false;
        $greenFee = false;
        $availableDate = false;
        $name = "";

        if (isset($opens)) {
            foreach ($opens as $open) {
                if ($open["date"] == $date) {
                    $openFlag = $open["competition_id"];
                    $greenFee = $open["visitor_green_fee"];
                    $availableDate = $open["available_date"];
                    $name = $open["name"];
                }
            }
        }

        if ($openFlag) {
            return $this->returnCheckForOpenOnDayParams(
                $this->_format_date($date),
                $openFlag,
                $greenFee,
                $availableDate,
                "Yes",
                $name,
            );
        }

        return [];
    }

    public function processOpenAvailability($response, $openId, $baseUrl)
    {
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON: " . json_last_error_msg());
        }

        $data = json_decode($response, true);

        libxml_use_internal_errors(true);

        $dom = new DOMDocument();
        $dom->loadHTML(
            $data["html"],
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD,
        );

        $xpath = new DOMXPath($dom);

        // XPath: find all tr elements that have a label with class 'slotCheckbox'
        $labels = $xpath->query(
            '//label[contains(concat(" ", normalize-space(@class), " "), " slotCheckbox ")]',
        );

        $count = 0;

        if ($labels->length === 0) {
            $available = "No";
        }

        foreach ($labels as $label) {
            // Optional: get the HTML of the label
            $htmlLabel = $dom->saveHTML($label);

            // Optional: get the checkbox input name
            $checkbox = $label->getElementsByTagName("input")->item(0);
            $name = $checkbox ? $checkbox->getAttribute("name") : "N/A";

            // Optional: get the price text
            $span = $label->getElementsByTagName("span")->item(0);
            $price = $span ? trim($span->textContent) : "N/A";

            $count++;
            $available = "Yes";
        }

        return [
            "slotsAvailable" => $available,
            "numberOfSlotsAvailable" => $count,
            "openBookingUrl" => "$baseUrl/competition2.php?tab=details&compid=$openId",
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

    private function _get_green_fee($fees)
    {
        return $fees[0]["green_fee1_ball"];
    }
}
