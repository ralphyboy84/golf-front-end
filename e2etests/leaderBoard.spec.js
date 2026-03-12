import { test, expect } from "@playwright/test";
import { fakePageLoadLogInCall } from "./helpers/logInHelper";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await fakePageLoadLogInCall(page);
});

test("Check you can navigate to an empty leader board", async ({ page }) => {
  await page.route("**/api/getLeaderBoard.php*", async (route) => {
    let body = {};

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await page.click("#leaderBoard");
  await expect(page.locator("#leaderBoardDiv")).toBeVisible();
  await expect(page.locator("#leaderBoardDiv")).toHaveText(
    /There is no leaderboard available currently/,
  );
});

test("Check leaderboard displays ok", async ({ page }) => {
  await page.route("**/api/getLeaderBoard.php*", async (route) => {
    let body = [
      {
        Total: "81",
        userid: "ralphy",
        totalCourses: "557",
        you: 1,
      },
      {
        Total: "1",
        userid: "queen of the nestie",
        totalCourses: "557",
      },
      {
        Total: "1",
        userid: "steve",
        totalCourses: "557",
      },
    ];

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  // Expect a title "to contain" a substring.
  await page.click("#dropDownButton");
  await page.click("#leaderBoard");
  await expect(page.locator("#leaderBoardDiv")).toBeVisible();
  await expect(page.locator("#leaderBoardDiv")).toHaveText(/ralphy/);
});
