<?php

require_once "api/processor/clubv1Processor.php";

use PHPUnit\Framework\TestCase;

class clubv1_processTeeTimeForDayTest extends TestCase
{
    private $processor;

    protected function setUp(): void
    {
        // Create a partial mock for the class that contains processTeeTimeForDay
        // We mock _format_date and _format_green_fees since they are internal helpers
        $this->processor = $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_format_date", "_format_green_fees"])
            ->getMock();
    }

    public function testNoTeeTimes()
    {
        $html = '<div class="tees"></div>';
        $date = "2026-02-14";
        $club = "SomeClub";

        // Mock _format_date
        $this->processor->method("_format_date")->willReturn("2026-02-14");

        $result = $this->processor->processTeeTimeForDay($html, $date, $club);

        $this->assertEquals(
            [
                "date" => "2026-02-14",
                "teeTimesAvailable" => "No",
            ],
            $result,
        );
    }

    public function testSingleTeeTime()
    {
        $html = '
            <div class="tees">
                <div class="tee available" data-hour-val="10" data-min-val="5" data-green-fee="50"></div>
                <div class="tee available" data-hour-val="10" data-min-val="15" data-green-fee="50"></div>
            </div>
        ';
        $date = "2026-02-14";
        $club = "SomeClub";

        $this->processor->method("_format_date")->willReturn("2026-02-14");
        $this->processor->method("_format_green_fees")->willReturn(50);

        $result = $this->processor->processTeeTimeForDay($html, $date, $club);

        $this->assertEquals("Yes", $result["teeTimesAvailable"]);
        $this->assertEquals(2, $result["timesAvailable"]);
        $this->assertEquals("10:05", $result["firstTime"]);
        $this->assertEquals(50, $result["cheapestPrice"]);
    }

    public function testMultipleTeeTimesWithDifferentFees()
    {
        $html = '
            <div class="tees">
                <div class="tee available" data-hour-val="9" data-min-val="0" data-green-fee="30"></div>
                <div class="tee available" data-hour-val="10" data-min-val="15" data-green-fee="20"></div>
                <div class="tee available" data-hour-val="11" data-min-val="45" data-green-fee="30"></div>
            </div>
        ';
        $date = "2026-02-14";
        $club = "SomeClub";

        $this->processor->method("_format_date")->willReturn("2026-02-14");

        $this->processor
            ->method("_format_green_fees")
            ->willReturnOnConsecutiveCalls(30, 70, 10);

        $result = $this->processor->processTeeTimeForDay($html, $date, $club);

        $this->assertEquals("Yes", $result["teeTimesAvailable"]);
        $this->assertEquals(3, $result["timesAvailable"]);
        $this->assertEquals("9:00", $result["firstTime"]);
        $this->assertEquals(10, $result["cheapestPrice"]); // lowest unique fee
    }
}
