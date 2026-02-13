<?php

require_once "api/processor/clubv1Processor.php";

use PHPUnit\Framework\TestCase;

class clubv1_processTeeTimeForDayTest extends TestCase
{
    private function makeServiceMock()
    {
        return $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_format_date", "_format_green_fees"])
            ->getMock();
    }

    public function testReturnsNoWhenNoTeesNode()
    {
        $html = "<div><p>No tee times</p></div>";
        $date = "2026-01-24";

        $service = $this->makeServiceMock();
        $service->method("_format_date")->willReturn("2026-01-24");

        $result = $service->processTeeTimeForDay($html, $date, "MyClub");

        $this->assertSame(
            [
                "date" => "2026-01-24",
                "teeTimesAvailable" => "No",
            ],
            $result,
        );
    }

    public function testReturnsNoWhenTeesNodeIsEmpty()
    {
        $html = '<div class="tees"></div>';
        $date = "2026-01-24";

        $service = $this->makeServiceMock();
        $service->method("_format_date")->willReturn("2026-01-24");

        $result = $service->processTeeTimeForDay($html, $date, "MyClub");

        $this->assertSame(
            [
                "date" => "2026-01-24",
                "teeTimesAvailable" => "No",
            ],
            $result,
        );
    }

    public function testReturnsCorrectDataForSingleTeeTime()
    {
        $html = <<<HTML
        <div class="tees">
            <div class="tee available" data-hour-val="08" data-min-val="5"></div>
        </div>
        HTML;
        $date = "2026-01-24";

        $service = $this->makeServiceMock();
        $service->method("_format_date")->willReturn("2026-01-24");
        $service->method("_format_green_fees")->willReturn(50);

        $result = $service->processTeeTimeForDay($html, $date, "MyClub");

        $this->assertSame(
            [
                "date" => "2026-01-24",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 1,
                "firstTime" => "08:05",
                "cheapestPrice" => 50,
            ],
            $result,
        );
    }

    public function testReturnsCorrectDataForMultipleTeeTimesWithDifferentFees()
    {
        $html = <<<HTML
        <div class="tees">
            <div class="tee available" data-hour-val="08" data-min-val="0"></div>
            <div class="tee available" data-hour-val="09" data-min-val="30"></div>
            <div class="tee available" data-hour-val="10" data-min-val="0"></div>
        </div>
        HTML;
        $date = "2026-01-24";

        $service = $this->makeServiceMock();
        $service->method("_format_date")->willReturn("2026-01-24");

        $service
            ->method("_format_green_fees")
            ->willReturnOnConsecutiveCalls(60, 50, 55);

        $result = $service->processTeeTimeForDay($html, $date, "MyClub");

        $this->assertSame(
            [
                "date" => "2026-01-24",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 3,
                "firstTime" => "08:00",
                "cheapestPrice" => 50, // sorted array_unique result
            ],
            $result,
        );
    }

    public function testPadsSingleDigitMinutes()
    {
        $html = <<<HTML
        <div class="tees">
            <div class="tee available" data-hour-val="07" data-min-val="5"></div>
        </div>
        HTML;
        $date = "2026-01-24";

        $service = $this->makeServiceMock();
        $service->method("_format_date")->willReturn("2026-01-24");
        $service->method("_format_green_fees")->willReturn(45);

        $result = $service->processTeeTimeForDay($html, $date, "MyClub");

        $this->assertSame("07:05", $result["firstTime"]);
    }

    public function testHandlesDuplicateFeesCorrectly()
    {
        $html = <<<HTML
        <div class="tees">
            <div class="tee available" data-hour-val="08" data-min-val="0"></div>
            <div class="tee available" data-hour-val="09" data-min-val="0"></div>
        </div>
        HTML;
        $date = "2026-01-24";

        $service = $this->makeServiceMock();
        $service->method("_format_date")->willReturn("2026-01-24");

        // Both green fees are the same
        $service->method("_format_green_fees")->willReturn(50);

        $result = $service->processTeeTimeForDay($html, $date, "MyClub");

        $this->assertSame(
            [
                "date" => "2026-01-24",
                "teeTimesAvailable" => "Yes",
                "timesAvailable" => 2,
                "firstTime" => "08:00",
                "cheapestPrice" => 50,
            ],
            $result,
        );
    }
}
