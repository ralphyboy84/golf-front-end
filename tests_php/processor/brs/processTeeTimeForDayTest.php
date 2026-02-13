<?php

require_once "processor/brsProcessor.php";

use PHPUnit\Framework\TestCase;

class processTeeTimeForDayTest extends TestCase
{
    private function getServiceMock()
    {
        return $this->getMockBuilder(BRSProcessor::class)
            ->onlyMethods(["_format_date", "_get_green_fee"])
            ->getMock();
    }

    /** @test */
    public function it_returns_no_when_api_returns_message()
    {
        $service = $this->getServiceMock();

        $service->method("_format_date")->willReturn("2025-12-19");

        $json = json_encode([
            "message" => "No tee times available",
        ]);

        $result = $service->processTeeTimeForDay(
            null,
            $json,
            null,
            "2025-12-19",
        );

        $this->assertEquals(
            [
                "teeTimesAvailable" => "No",
                "date" => "2025-12-19",
            ],
            $result,
        );
    }

    /** @test */
    public function it_returns_tee_time_data_when_times_exist()
    {
        $service = $this->getServiceMock();

        $service->method("_format_date")->willReturn("2025-12-19");

        $service
            ->method("_get_green_fee")
            ->willReturnOnConsecutiveCalls(100, 80, 120);

        $json = json_encode([
            "data" => [
                "tee_times" => [
                    [
                        "time" => "08:00",
                        "green_fees" => ["fee" => 100],
                    ],
                    [
                        "time" => "08:10",
                        "green_fees" => ["fee" => 80],
                    ],
                    [
                        "time" => "08:20",
                        "green_fees" => ["fee" => 120],
                    ],
                ],
            ],
        ]);

        $result = $service->processTeeTimeForDay(
            null,
            $json,
            null,
            "2025-12-19",
        );

        $this->assertEquals(
            [
                "date" => "2025-12-19",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 3,
                "firstTime" => "08:00",
                "cheapestPrice" => 80,
            ],
            $result,
        );
    }

    /** @test */
    public function it_returns_no_when_no_tee_times_exist()
    {
        $service = $this->getServiceMock();

        $service->method("_format_date")->willReturn("2025-12-19");

        $json = json_encode([
            "data" => [
                "tee_times" => [],
            ],
        ]);

        $result = $service->processTeeTimeForDay(
            null,
            $json,
            null,
            "2025-12-19",
        );

        $this->assertEquals(
            [
                "date" => "2025-12-19",
                "teeTimesAvailable" => "No",
            ],
            $result,
        );
    }
}
