<?php

require_once "api/processor/clubv1Processor.php";

use PHPUnit\Framework\TestCase;

class clubv1_checkForOpenOnDayTest extends TestCase
{
    private function makeServiceMock()
    {
        return $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_format_date", "returnCheckForOpenOnDayParams"])
            ->getMock();
    }

    public function testReturnsEmptyArrayWhenOpensIsEmpty()
    {
        $service = $this->makeServiceMock();

        $result = $service->checkForOpenOnDay([], "2026-01-01", 10);

        $this->assertSame([], $result);
    }

    public function testReturnsEmptyArrayWhenNoMatchingDate()
    {
        $service = $this->makeServiceMock();

        $service->method("_format_date")->willReturn("2026-01-01");

        $opens = [["date" => "2026-01-02"]];

        $result = $service->checkForOpenOnDay($opens, "2026-01-01", 10);

        $this->assertSame([], $result);
    }

    public function testReturnsExpectedDataWhenOpenExists()
    {
        $service = $this->makeServiceMock();

        $service->method("_format_date")->willReturn("2026-01-01");

        $service
            ->expects($this->once())
            ->method("returnCheckForOpenOnDayParams")
            ->with(
                "comp123",
                "£50",
                "TBC",
                "Yes",
                "January Open",
                "token123",
                "",
            )
            ->willReturn(["result" => "ok"]);

        $opens = [
            [
                "date" => "2026-01-01",
                "competition_id" => "comp123",
                "visitor_green_fee" => "£50",
                "name" => "January Open",
                "token" => "token123",
                "bookingOpen" => "Yes",
            ],
        ];

        $result = $service->checkForOpenOnDay($opens, "2026-01-01", 99);

        $this->assertSame(["result" => "ok"], $result);
    }

    public function testSetsFallbackBookingUrlWhenBookingIsClosed()
    {
        $service = $this->makeServiceMock();

        $service->method("_format_date")->willReturn("2026-01-01");

        $service
            ->expects($this->once())
            ->method("returnCheckForOpenOnDayParams")
            ->with(
                "comp456",
                "",
                "TBC",
                "No",
                "Closed Open",
                "tok456",
                "https://hub.howdidido.com/directory/OpenCompetitions?id=77",
            )
            ->willReturn(["closed" => true]);

        $opens = [
            [
                "date" => "2026-01-01",
                "competition_id" => "comp456",
                "name" => "Closed Open",
                "token" => "tok456",
                "bookingOpen" => "No",
            ],
        ];

        $result = $service->checkForOpenOnDay($opens, "2026-01-01", 77);

        $this->assertSame(["closed" => true], $result);
    }

    public function testLastMatchingOpenWins()
    {
        $service = $this->makeServiceMock();

        $service->method("_format_date")->willReturn("2026-01-01");

        $service
            ->expects($this->once())
            ->method("returnCheckForOpenOnDayParams")
            ->with("comp2", "", "TBC", "", "Second Open", "", "")
            ->willReturn(["winner" => "second"]);

        $opens = [
            [
                "date" => "2026-01-01",
                "competition_id" => "comp1",
                "name" => "First Open",
            ],
            [
                "date" => "2026-01-01",
                "competition_id" => "comp2",
                "name" => "Second Open",
            ],
        ];

        $result = $service->checkForOpenOnDay($opens, "2026-01-01", 1);

        $this->assertSame(["winner" => "second"], $result);
    }
}
