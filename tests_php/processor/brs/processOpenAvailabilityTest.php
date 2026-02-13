<?php

use PHPUnit\Framework\TestCase;

require_once "api/processor/brsProcessor.php";

class processOpenAvailabilityTest extends TestCase
{
    protected $processor;

    protected function setUp(): void
    {
        $this->processor = new BRSProcessor(); // Replace with the class name containing processOpenAvailability
    }

    public function testSlotsAvailableWhenAvailableSlotExists()
    {
        $entryList = json_encode([
            "data" => [
                "tee_times" => [
                    [
                        "slots" => [
                            ["status" => "Unavailable"],
                            ["status" => "Available"],
                        ],
                    ],
                ],
            ],
        ]);

        $bookingUrl = "https://example.com/book";

        $result = $this->processor->processOpenAvailability(
            $entryList,
            $bookingUrl,
        );

        $this->assertEquals("Yes", $result["slotsAvailable"]);
        $this->assertEquals($bookingUrl, $result["openBookingUrl"]);
    }

    public function testSlotsUnavailableWhenNoAvailableSlot()
    {
        $entryList = json_encode([
            "data" => [
                "tee_times" => [
                    [
                        "slots" => [
                            ["status" => "Unavailable"],
                            ["status" => "Unavailable"],
                        ],
                    ],
                ],
            ],
        ]);

        $bookingUrl = "https://example.com/book";

        $result = $this->processor->processOpenAvailability(
            $entryList,
            $bookingUrl,
        );

        $this->assertEquals("No", $result["slotsAvailable"]);
        $this->assertEquals($bookingUrl, $result["openBookingUrl"]);
    }

    public function testSlotsUnavailableWhenTeeTimesMissing()
    {
        $entryList = json_encode([
            "data" => [],
        ]);

        $bookingUrl = "https://example.com/book";

        $result = $this->processor->processOpenAvailability(
            $entryList,
            $bookingUrl,
        );

        $this->assertEquals("No", $result["slotsAvailable"]);
        $this->assertEquals($bookingUrl, $result["openBookingUrl"]);
    }

    public function testSlotsUnavailableWithInvalidJson()
    {
        $entryList = "invalid json";
        $bookingUrl = "https://example.com/book";

        $result = $this->processor->processOpenAvailability(
            $entryList,
            $bookingUrl,
        );

        $this->assertEquals("No", $result["slotsAvailable"]);
        $this->assertEquals($bookingUrl, $result["openBookingUrl"]);
    }

    public function testSlotsUnavailableWithEmptyJson()
    {
        $entryList = "{}";
        $bookingUrl = "https://example.com/book";

        $result = $this->processor->processOpenAvailability(
            $entryList,
            $bookingUrl,
        );

        $this->assertEquals("No", $result["slotsAvailable"]);
        $this->assertEquals($bookingUrl, $result["openBookingUrl"]);
    }
}
