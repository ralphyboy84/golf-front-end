<?php

require_once "processor/brsProcessor.php";

use PHPUnit\Framework\TestCase;

class _get_green_feeTest extends TestCase
{
    /** @test */
    public function it_returns_the_first_green_fee_value()
    {
        $service = new class extends BRSProcessor {
            public function callGetGreenFee($fees)
            {
                return $this->_get_green_fee($fees);
            }
        };

        $fees = [
            [
                "green_fee1_ball" => 85,
                "green_fee2_ball" => 160,
            ],
        ];

        $result = $service->callGetGreenFee($fees);

        $this->assertEquals(85, $result);
    }
}
