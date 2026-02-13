<?php

require_once "processor/brsProcessor.php";

use PHPUnit\Framework\TestCase;

class checkForOpenOnDayTest extends TestCase
{
    protected $processor;

    protected function setUp(): void
    {
        $this->processor = new BRSProcessor();
    }

    public function testReturnsOpenDetailsWhenMatchExists()
    {
        $opens = json_encode([
            "data" => [
                [
                    "date" => "2026-01-18",
                    "competition_id" => 123,
                    "visitor_green_fee" => 75.5,
                    "available_date" => "2026-01-01",
                ],
                [
                    "date" => "2026-01-19",
                    "competition_id" => 456,
                    "visitor_green_fee" => 80.0,
                    "available_date" => "2026-01-02",
                ],
            ],
        ]);

        $date = "2026-01-18";

        $result = $this->processor->checkForOpenOnDay($opens, $date);

        $this->assertIsArray($result);
        $this->assertEquals(123, $result["competitionId"]);
        $this->assertEquals(75.5, $result["openGreenFee"]);
        $this->assertEquals("01/01/2026", $result["bookingsOpenDate"]);
    }

    public function testReturnsEmptyArrayWhenNoMatch()
    {
        $opens = json_encode([
            "data" => [
                [
                    "date" => "2026-01-19",
                    "competition_id" => 456,
                    "visitor_green_fee" => 80.0,
                    "available_date" => "2026-01-02",
                ],
            ],
        ]);

        $date = "2026-01-18";

        $result = $this->processor->checkForOpenOnDay($opens, $date);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testReturnsEmptyArrayWithEmptyData()
    {
        $opens = json_encode([
            "data" => [],
        ]);

        $date = "2026-01-18";

        $result = $this->processor->checkForOpenOnDay($opens, $date);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testReturnsEmptyArrayWithInvalidJson()
    {
        $opens = "invalid json";

        $date = "2026-01-18";

        $result = $this->processor->checkForOpenOnDay($opens, $date);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testReturnsLastMatchIfMultipleSameDatesExist()
    {
        $opens = json_encode([
            "data" => [
                [
                    "date" => "2026-01-18",
                    "competition_id" => 123,
                    "visitor_green_fee" => 75.5,
                    "available_date" => "2026-01-01",
                ],
                [
                    "date" => "2026-01-18",
                    "competition_id" => 789,
                    "visitor_green_fee" => 85.0,
                    "available_date" => "2026-01-03",
                ],
            ],
        ]);

        $date = "2026-01-18";

        $result = $this->processor->checkForOpenOnDay($opens, $date);

        // The method logic will overwrite $openFlag for each match,
        // so the last one is returned
        $this->assertEquals(789, $result["competitionId"]);
        $this->assertEquals(85.0, $result["openGreenFee"]);
        $this->assertEquals("03/01/2026", $result["bookingsOpenDate"]);
    }
}
