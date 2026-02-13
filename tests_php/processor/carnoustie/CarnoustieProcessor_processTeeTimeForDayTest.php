<?php

require_once "processor/carnoustieProcessor.php";

use PHPUnit\Framework\TestCase;

class CarnoustieProcessor_processTeeTimeForDayTest extends TestCase
{
    private function getProcessorMock()
    {
        return $this->getMockBuilder(CarnoustieProcessor::class)
            ->onlyMethods(["_format_date"])
            ->getMock();
    }

    /** @test */
    public function it_returns_no_when_no_diaries_exist()
    {
        $processor = $this->getProcessorMock();
        $processor->method("_format_date")->willReturn("2026-01-23");

        $json = json_encode([
            "data" => [
                "diaries" => [],
            ],
        ]);

        $result = $processor->processTeeTimeForDay($json, "2026-01-23");

        $this->assertEquals(
            [
                "teeTimesAvailable" => "No",
                "date" => "2026-01-23",
            ],
            $result,
        );
    }

    /** @test */
    public function it_returns_yes_with_zero_times_when_all_diaries_are_booked()
    {
        $processor = $this->getProcessorMock();
        $processor->method("_format_date")->willReturn("2026-01-23");

        $json = json_encode([
            "data" => [
                "diaries" => [
                    [
                        "bookings" => ["someBooking"],
                        "slot_date_time" => "2026-01-23T08:00:00",
                    ],
                    [
                        "bookings" => ["someBooking"],
                        "slot_date_time" => "2026-01-23T08:10:00",
                    ],
                ],
            ],
        ]);

        $result = $processor->processTeeTimeForDay($json, "2026-01-23");

        $this->assertEquals(
            [
                "date" => "2026-01-23",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 0,
                "firstTime" => "",
                "cheapestPrice" => "TBC",
            ],
            $result,
        );
    }

    /** @test */
    public function it_counts_available_tee_times_and_sets_first_time()
    {
        $processor = $this->getProcessorMock();
        $processor->method("_format_date")->willReturn("2026-01-23");

        $json = json_encode([
            "data" => [
                "diaries" => [
                    [
                        "slot_date_time" => "2026-01-23T08:00:00",
                        "bookings" => [],
                    ],
                    [
                        "slot_date_time" => "2026-01-23T08:10:00",
                        "bookings" => ["someBooking"],
                    ],
                    [
                        "slot_date_time" => "2026-01-23T08:20:00",
                        "bookings" => [],
                    ],
                ],
            ],
        ]);

        $result = $processor->processTeeTimeForDay($json, "2026-01-23");

        $this->assertEquals(
            [
                "date" => "2026-01-23",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 2,
                "firstTime" => "08:00",
                "cheapestPrice" => "TBC",
            ],
            $result,
        );
    }

    /** @test */
    public function it_handles_missing_bookings_key_as_available()
    {
        $processor = $this->getProcessorMock();
        $processor->method("_format_date")->willReturn("2026-01-23");

        $json = json_encode([
            "data" => [
                "diaries" => [
                    ["slot_date_time" => "2026-01-23T08:00:00"], // no bookings key
                    [
                        "slot_date_time" => "2026-01-23T08:10:00",
                        "bookings" => [],
                    ],
                ],
            ],
        ]);

        $result = $processor->processTeeTimeForDay($json, "2026-01-23");

        $this->assertEquals(
            [
                "date" => "2026-01-23",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 2,
                "firstTime" => "08:00",
                "cheapestPrice" => "TBC",
            ],
            $result,
        );
    }
}
