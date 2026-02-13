<?php

require_once "processor/clubv1Processor.php";

use PHPUnit\Framework\TestCase;

class clubv1_getOpenOfTypeTest extends TestCase
{
    private function makeServiceMock(callable $matcherCallback)
    {
        return $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_string_contains_array_value"])
            ->getMock()
            ->method("_string_contains_array_value")
            ->willReturnCallback($matcherCallback)
            ->getMock();
    }

    /** @test */
    public function testReturnsMatchingOpensOnly()
    {
        $opens = [
            ["name" => "Masters Texas Scramble 2024"],
            ["name" => "Local Club Medal"],
            ["name" => "Golf in Scotland Texas Scramble"],
        ];

        $service = $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_string_contains_array_value"])
            ->getMock();

        $service
            ->method("_string_contains_array_value")
            ->willReturnCallback(function ($name, $typeArray) {
                foreach ($typeArray as $value) {
                    if (str_contains($name, $value)) {
                        return true;
                    }
                }
                return false;
            });

        $result = $service->getOpenOfType($opens, "MastersTexasScramble");

        $this->assertCount(2, $result);
        $this->assertSame("Masters Texas Scramble 2024", $result[0]["name"]);
        $this->assertSame(
            "Golf in Scotland Texas Scramble",
            $result[1]["name"],
        );
    }

    public function testReturnsEmptyArrayWhenNoMatches()
    {
        $opens = [["name" => "Club Championship"], ["name" => "Monthly Medal"]];

        $service = $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_string_contains_array_value"])
            ->getMock();

        $service->method("_string_contains_array_value")->willReturn(false);

        $result = $service->getOpenOfType($opens, "MastersTexasScramble");

        $this->assertSame([], $result);
    }

    /** @test */
    public function testReturnsAllMatchingOpens()
    {
        $opens = [["name" => "Masters"], ["name" => "Masters Texas Scramble"]];

        $service = $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_string_contains_array_value"])
            ->getMock();

        $service->method("_string_contains_array_value")->willReturn(true);

        $result = $service->getOpenOfType($opens, "MastersTexasScramble");

        $this->assertCount(2, $result);
    }

    /** @test */
    public function testDoesNotModifyInputArray()
    {
        $opens = [["name" => "Masters Texas Scramble"]];

        $original = $opens;

        $service = $this->getMockBuilder(ClubV1Processor::class)
            ->onlyMethods(["_string_contains_array_value"])
            ->getMock();

        $service->method("_string_contains_array_value")->willReturn(true);

        $service->getOpenOfType($opens, "MastersTexasScramble");

        $this->assertSame($original, $opens);
    }
}
