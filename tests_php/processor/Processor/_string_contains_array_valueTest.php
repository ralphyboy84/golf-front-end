<?php

require_once "api/processor/Processor.php";

use PHPUnit\Framework\TestCase;

class _string_contains_array_valueTest extends TestCase
{
    protected $processor;
    protected $method;

    protected function setUp(): void
    {
        // Create an anonymous class extending Processor because Processor is abstract
        $this->processor = new class extends Processor {};

        // Use reflection to access the protected method
        $reflection = new ReflectionClass($this->processor);
        $this->method = $reflection->getMethod("_string_contains_array_value");
        $this->method->setAccessible(true);
    }

    public function testReturnsTrueWhenStringContainsArrayValue()
    {
        $string = "US Masters Texas Scramble 2026";
        $array = [
            "Masters",
            "Golf in Scotland Texas Scramble",
            "US Masters Texas Scramble",
        ];

        $result = $this->method->invoke($this->processor, $string, $array);
        $this->assertTrue($result);
    }

    public function testReturnsFalseWhenStringDoesNotContainArrayValue()
    {
        $string = "Some Other Open 2026";
        $array = [
            "Masters",
            "Golf in Scotland Texas Scramble",
            "US Masters Texas Scramble",
        ];

        $result = $this->method->invoke($this->processor, $string, $array);
        $this->assertFalse($result);
    }

    public function testIsCaseInsensitive()
    {
        $string = "us MASTERS texas scramble 2026";
        $array = [
            "Masters",
            "Golf in Scotland Texas Scramble",
            "US Masters Texas Scramble",
        ];

        $result = $this->method->invoke($this->processor, $string, $array);
        $this->assertTrue($result);
    }

    public function testReturnsFalseWithEmptyArray()
    {
        $string = "Anything";
        $array = [];

        $result = $this->method->invoke($this->processor, $string, $array);
        $this->assertFalse($result);
    }

    public function testReturnsTrueWhenMultipleArrayValuesMatch()
    {
        $string = "Golf in Scotland Texas Scramble Masters";
        $array = ["Masters", "Golf in Scotland Texas Scramble"];

        $result = $this->method->invoke($this->processor, $string, $array);
        $this->assertTrue($result);
    }
}
