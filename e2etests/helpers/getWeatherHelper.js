export async function interceptGetWeatherAPICall(page) {
  await page.route("**/api/weather/getWeather.php*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });
}
