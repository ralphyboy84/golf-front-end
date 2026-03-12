import { test, expect } from "@playwright/test";
import { fakePageLoadLogInCall } from "./helpers/logInHelper";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await fakePageLoadLogInCall(page);
});

test("Check correct fields are displayed when not logged in", async ({
  page,
}) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await expect(page.locator("#logInLi")).toBeVisible();
  await expect(page.locator("#signUpLi")).toBeVisible();
  await expect(page.locator("#yourInfoLi")).toBeHidden();
  await expect(page.locator("#logOutLi")).toBeHidden();
});

test("Check no username entered", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#signUp");
  await page.click("#signUpButton");
  await expect(page.locator("#noUserName")).toBeVisible();
  await expect(page.locator("#noUserName")).toHaveText(
    /You have not entered a username/,
  );
});

test("Check no password entered", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#signUp");
  await page.fill("#username", "ralph");
  await page.click("#signUpButton");
  await expect(page.locator("#noPassword")).toBeVisible();
  await expect(page.locator("#noPassword")).toHaveText(
    /You have not entered a password/,
  );
});

test("Check no password confirmation entered", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#signUp");
  await page.fill("#username", "ralph");
  await page.fill("#password", "test");
  await page.click("#signUpButton");
  await expect(page.locator("#noPasswordConfirm")).toBeVisible();
  await expect(page.locator("#noPasswordConfirm")).toHaveText(
    /You have not confirmed your password/,
  );
});

test("Check passwords do not match", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#signUp");
  await page.fill("#username", "ralph");
  await page.fill("#password", "test");
  await page.fill("#passwordConfirmed", "test1");
  await page.click("#signUpButton");
  await expect(page.locator("#passwordsDoNotMatch")).toBeVisible();
  await expect(page.locator("#passwordsDoNotMatch")).toHaveText(
    /Your passwords do not match/,
  );
});

test("Check account already exists", async ({ page }) => {
  await page.route("**/api/createUser.php*", async (route) => {
    let body = { error: "user created" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#signUp");
  await page.fill("#username", "ralph");
  await page.fill("#password", "test");
  await page.fill("#passwordConfirmed", "test");
  await page.click("#signUpButton");
  await expect(page.locator("#userExists")).toBeVisible();
  await expect(page.locator("#userExists")).toHaveText(
    /This user already exists/,
  );
});

test("Check account created successfully", async ({ page }) => {
  await page.route("**/api/createUser.php*", async (route) => {
    let body = { success: "user created" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });

  // Expect a title "to contain" a substring.
  await page.click("#userDropDown");
  await page.click("#signUp");
  await page.fill("#username", "ralph");
  await page.fill("#password", "test");
  await page.fill("#passwordConfirmed", "test");
  await page.click("#signUpButton");

  await expect(page.locator("#loggedIn")).toBeVisible();
  await expect(page.locator("#loggedIn")).toHaveText(
    /Congrats, you have signed up and are logged in!/,
  );
});
