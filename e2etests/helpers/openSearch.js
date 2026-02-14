import { opens } from "../fixtures/opens";

export async function interceptGetAllOpensAPICall(page) {
  await page.route("**/api/getAllOpens.php", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(opens),
    });
  });
}

export async function interceptGetRegionsAPICall(page) {
  await page.route("**/api/getRegions.php", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(regions),
    });
  });
}
