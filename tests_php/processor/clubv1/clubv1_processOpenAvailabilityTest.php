<?php

require_once "api/processor/clubv1Processor.php";

use PHPUnit\Framework\TestCase;

class clubv1_processOpenAvailabilityTest extends TestCase
{
    private $processor;

    protected function setUp(): void
    {
        $this->processor = new ClubV1Processor();
    }

    public function testNoBookingNode()
    {
        $html = '<div class="other-class"></div>';
        $openId = 123;
        $token = "abc";

        $result = $this->processor->processOpenAvailability(
            $html,
            $openId,
            $token,
        );

        $this->assertEquals(
            [
                "slotsAvailable" => "No",
                "openBookingUrl" =>
                    "https://howdidido-whs.clubv1.com/hdidbooking/open?token=abc&cid=123&rd=1",
            ],
            $result,
        );
    }

    public function testBookingNodeNoAvailability()
    {
        $html = '
            <div class="booking">
                <div>
                    <div>
                        <div>Time</div>
                        <div><div><span>Booked</span></div></div>
                    </div>
                </div>
            </div>
        ';

        $openId = 456;
        $token = "xyz";

        $result = $this->processor->processOpenAvailability(
            $html,
            $openId,
            $token,
        );

        $this->assertEquals("No", $result["slotsAvailable"]);
        $this->assertStringContainsString(
            "token=xyz&cid=456",
            $result["openBookingUrl"],
        );
    }

    // public function testBookingNodeWithAvailability()
    // {
    //     $html = '
    //         <div class="booking">
    //             <div>
    //                 <div>
    //                     <div>09:03</div>
    //                     <div>
    //                         <div><span>Available</span></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     ';

    //     $openId = 789;
    //     $token = "token123";

    //     $result = $this->processor->processOpenAvailability(
    //         $html,
    //         $openId,
    //         $token,
    //     );

    //     $this->assertEquals("Yes", $result["slotsAvailable"]);
    //     $this->assertEquals(
    //         "https://howdidido-whs.clubv1.com/hdidbooking/open?token=token123&cid=789&rd=1",
    //         $result["openBookingUrl"],
    //     );
    // }

    public function testBookingNodeWithMultipleSlots()
    {
        $html = '
            <div class="booking">
                <div>
                    <div>
                        <div>08:00</div>
                        <div>
                            <div><span>Booked</span></div>
                            <div><span>Available</span></div>
                        </div>
                    </div>
                    <div>
                        <div>09:00</div>
                        <div>
                            <div><span>Booked</span></div>
                        </div>
                    </div>
                </div>
            </div>
        ';

        $openId = 321;
        $token = "multi";

        $result = $this->processor->processOpenAvailability(
            $html,
            $openId,
            $token,
        );

        $this->assertEquals("Yes", $result["slotsAvailable"]);
        $this->assertEquals(
            "https://howdidido-whs.clubv1.com/hdidbooking/open?token=multi&cid=321&rd=1",
            $result["openBookingUrl"],
        );
    }
}
