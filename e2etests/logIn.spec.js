import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Check no username entered", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#logIn");
  await page.click("#logInButton");
  await expect(page.locator("#noUserName")).toBeVisible();
  await expect(page.locator("#noUserName")).toHaveText(
    /You have not entered a username/,
  );
});

test("Check no password entered", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#logIn");
  await page.fill("#username", "ralph");
  await page.click("#logInButton");
  await expect(page.locator("#noPassword")).toBeVisible();
  await expect(page.locator("#noPassword")).toHaveText(
    /You have not entered a password/,
  );
});

test("Check password incorrect", async ({ page }) => {
  await page.route("**/api/logInUser.php*", async (route) => {
    let body = { error: "xxx" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#logIn");
  await page.fill("#username", "ralph");
  await page.fill("#password", "ralph");
  await page.click("#logInButton");

  await expect(page.locator("#passwordsDoNotMatch")).toBeVisible();
  await expect(page.locator("#passwordsDoNotMatch")).toHaveText(
    /Wrong password entered/,
  );
});

test("Check logged in ok", async ({ page }) => {
  await page.route("**/api/logInUser.php*", async (route) => {
    let body = { success: "xxx" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#logIn");
  await page.fill("#username", "ralph");
  await page.fill("#password", "ralph");
  await page.click("#logInButton");

  await expect(page.locator("#loggedIn")).toBeVisible();
  await expect(page.locator("#loggedIn")).toHaveText(
    /Congrats, you are logged in!/,
  );
});
