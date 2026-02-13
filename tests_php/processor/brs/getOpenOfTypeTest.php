<?php

require_once "api/processor/brsProcessor.php";

use PHPUnit\Framework\TestCase;

class getOpenOfTypeTest extends TestCase
{
    protected $processor;

    protected function setUp(): void
    {
        $this->processor = new BRSProcessor();
    }

    public function testReturnsMatchingOpens()
    {
        $opens = json_encode([
            "data" => [
                ["name" => "Masters Texas Scramble 2026", "id" => 1],
                ["name" => "Some Other Open", "id" => 2],
                ["name" => "US Masters Texas Scramble Championship", "id" => 3],
            ],
        ]);

        $result = $this->processor->getOpenOfType(
            $opens,
            "MastersTexasScramble",
        );

        $this->assertCount(2, $result); // 2 matches
        $this->assertEquals(1, $result[0]["id"]);
        $this->assertEquals(3, $result[1]["id"]);
    }

    public function testReturnsEmptyArrayWhenNoMatch()
    {
        $opens = json_encode([
            "data" => [
                ["name" => "Random Open 2026", "id" => 1],
                ["name" => "Another Open", "id" => 2],
            ],
        ]);

        $result = $this->processor->getOpenOfType(
            $opens,
            "MastersTexasScramble",
        );

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testReturnsEmptyArrayWithEmptyData()
    {
        $opens = json_encode([
            "data" => [],
        ]);

        $result = $this->processor->getOpenOfType(
            $opens,
            "MastersTexasScramble",
        );

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testReturnsEmptyArrayWithInvalidJson()
    {
        $opens = "invalid json";

        $result = $this->processor->getOpenOfType(
            $opens,
            "MastersTexasScramble",
        );

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testWorksWithMultipleTypeAliases()
    {
        $opens = json_encode([
            "data" => [
                ["name" => "Masters", "id" => 1],
                ["name" => "Golf in Scotland Texas Scramble", "id" => 2],
                ["name" => "US Masters Texas Scramble", "id" => 3],
                ["name" => "Some Open", "id" => 4],
            ],
        ]);

        $result = $this->processor->getOpenOfType(
            $opens,
            "MastersTexasScramble",
        );

        $this->assertCount(3, $result);
        $this->assertEquals([1, 2, 3], array_column($result, "id"));
    }

    public function testReturnsMatchingOpensUsingMock()
    {
        $opens = json_encode([
            "data" => [
                ["name" => "Masters Texas Scramble 2026", "id" => 1],
                ["name" => "Some Other Open", "id" => 2],
                ["name" => "US Masters Texas Scramble Championship", "id" => 3],
            ],
        ]);

        $processor = $this->getMockBuilder(BRSProcessor::class)
            ->onlyMethods(["_string_contains_array_value"]) // method to mock
            ->getMock();

        // Configure the mock:
        // First call → true (match)
        // Second call → false (no match)
        // Third call → true (match)
        $processor
            ->method("_string_contains_array_value")
            ->willReturnOnConsecutiveCalls(true, false, true);

        $result = $this->processor->getOpenOfType(
            $opens,
            "MastersTexasScramble",
        );

        $this->assertCount(2, $result);
        $this->assertEquals(1, $result[0]["id"]);
        $this->assertEquals(3, $result[1]["id"]);
    }
}
