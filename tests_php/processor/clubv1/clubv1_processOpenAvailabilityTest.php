<?php

require_once "api/processor/clubv1Processor.php";

use PHPUnit\Framework\TestCase;

class clubv1_processOpenAvailabilityTest extends TestCase
{
    private function makeService()
    {
        return new ClubV1Processor(); // replace with your actual class
    }

    public function testReturnsNoWhenNoSlotsAvailable()
    {
        $html = <<<HTML
        <div class="booking">
            <div>
                <div>08:00</div>
                <div>
                    <div><span>Unavailable</span></div>
                </div>
            </div>
        </div>
        HTML;
        $service = $this->makeService();
        $result = $service->processOpenAvailability($html, 123, "abc");
        $this->assertSame("No", $result["slotsAvailable"]);
        $this->assertSame(
            "https://howdidido-whs.clubv1.com/hdidbooking/open?token=abc&cid=123&rd=1",
            $result["openBookingUrl"],
        );
    }

    public function testReturnsYesWhenDirectAvailableSpanExists()
    {
        $html = <<<HTML
        <div class="booking">
            <div>
                <div>08:10</div>
                <div>
                    <div><span>Available</span></div>
                </div>
            </div>
        </div>
        HTML;
        $service = $this->makeService();
        $result = $service->processOpenAvailability($html, 456, "token123");
        $this->assertSame("Yes", $result["slotsAvailable"]);
    }

    public function testReturnsYesWhenNestedSlotIsAvailable()
    {
        $html = <<<HTML
        <div class="booking">
            <div>
                <div>Time</div>
                <div></div>
            </div>
            <div>
                <div>08:20</div>
                <div>
                    <div>
                        <div><span>Unavailable</span></div>
                        <div><span>Available</span></div>
                    </div>
                </div>
            </div>
        </div>
        HTML;
        $service = $this->makeService();
        $result = $service->processOpenAvailability($html, 999, "xyz");
        $this->assertSame("Yes", $result["slotsAvailable"]);
    }

    public function testSkipsHeaderRow()
    {
        $html = <<<HTML
        <div class="booking">
            <div>
                <div>Time</div>
                <div>Status</div>
            </div>
        </div>
        HTML;
        $service = $this->makeService();
        $result = $service->processOpenAvailability($html, 1, "t");
        $this->assertSame("No", $result["slotsAvailable"]);
    }

    public function testHandlesMissingBookingNode()
    {
        $html = "<div><p>No booking data</p></div>";
        $service = $this->makeService();
        $result = $service->processOpenAvailability($html, 1, "t");
        $this->assertSame("No", $result["slotsAvailable"]);
    }
}
