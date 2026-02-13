<?php

require_once "processor/Processor.php";

use PHPUnit\Framework\TestCase;

class _format_dateTest extends TestCase
{
    protected $processor;

    protected function setUp(): void
    {
        // Create an anonymous class extending Processor because Processor is abstract
        $this->processor = new class extends Processor {};
    }

    public function testFormatDate()
    {
        $date = "2026-01-18";

        $reflection = new ReflectionClass($this->processor);
        $method = $reflection->getMethod("_format_date");
        $method->setAccessible(true); // allow calling protected method

        $formatted = $method->invoke($this->processor, $date);

        $this->assertEquals("18/01/2026", $formatted);
    }

    public function testFormatDateDifferentDate()
    {
        $date = "1999-12-31";

        $reflection = new ReflectionClass($this->processor);
        $method = $reflection->getMethod("_format_date");
        $method->setAccessible(true);

        $formatted = $method->invoke($this->processor, $date);

        $this->assertEquals("31/12/1999", $formatted);
    }
}
