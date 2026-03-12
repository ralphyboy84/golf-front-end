export async function fakePageLoadLogInCall(page) {
  await page.route("**/api/getLoggedInUser.php*", async (route) => {
    let body = { error: "1" };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}
