export async function interceptGetDistanceAPICall(page) {
  await page.route("**/api/map/getDistance.php*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
}
