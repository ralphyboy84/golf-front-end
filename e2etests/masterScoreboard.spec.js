import { test, expect } from "@playwright/test";
import fs from "fs";

test.describe.configure({ mode: "serial" });

var competitions = [];

const localOnlyDescribe = process.env.CI ? test.describe.skip : test.describe;

localOnlyDescribe("local-only tests", () => {
  test("Check bonarbridge", async ({ page }) => {
    await getOpen(6048, "bonarbridge", page);
  });

  test("Check Dalbeattie", async ({ page }) => {
    await getOpen(6124, "Dalbeattie", page);
  });

  test("Check Durness", async ({ page }) => {
    await getOpen(6159, "Durness", page);
  });

  test("Check colvend", async ({ page }) => {
    await getOpen(6100, "colvend", page);
  });

  test("Check IsleofHarris", async ({ page }) => {
    await getOpen(6237, "IsleofHarris", page);
  });

  test("Check melrose", async ({ page }) => {
    await getOpen(6317, "melrose", page);
  });

  test("Check Orkney", async ({ page }) => {
    await getOpen(6359, "Orkney", page);
  });

  test("Check thurso", async ({ page }) => {
    await getOpen(6457, "thurso", page);
  });

  test("Check stboswells", async ({ page }) => {
    await getOpen(6427, "stboswells", page);
  });

  test("Check machrie", async ({ page }) => {
    await getOpen(6235, "machrie", page);
  });

  test("Check wick", async ({ page }) => {
    await getOpen(6489, "wick", page);
  });

  test("Check Lybster", async ({ page }) => {
    await getOpen(6311, "Lybster", page);
  });

  test("Check GatehouseofFleet", async ({ page }) => {
    await getOpen(6187, "GatehouseofFleet", page);
  });

  test("Check Stornoway", async ({ page }) => {
    await getOpen(6433, "Stornoway", page);
  });

  test("Check hamilton", async ({ page }) => {
    await getOpen(6211, "hamilton", page);
  });

  test("Check reay", async ({ page }) => {
    await getOpen(6388, "reay", page);

    const data = {
      name: "test",
      price: 20,
    };

    fs.writeFileSync("./scripts/data.json", JSON.stringify(competitions));
  });

  test("Load Opens", async ({ page }) => {
    await page.goto(`http://localhost/scripts/loadOpens.php?load=masters`);
    await expect(page.locator("body")).toHaveText(/LOADING MASTERS/);
    await expect(page.locator("body")).toHaveText(/OPENS LOADED/);
    fs.unlink("./scripts/data.json", (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
  });
});

async function getOpen(courseid, clubid, page) {
  await page.goto(
    `https://www.masterscoreboard.co.uk/ClubOpens.php?CWID=${courseid}`,
  );

  const items = page.locator("ul.w3-ul > li");
  const count = await items.count();

  let priceText = "";
  let visitorPrice = "";

  for (let i = 0; i < count; i++) {
    const li = items.nth(i);
    const classes = await li.getAttribute("class");

    // Month header
    if (classes?.includes("future-comps")) {
      const currentMonth = (await li.textContent())?.trim() || "";
      continue;
    }

    // Competition row
    const date = await li.locator("div").nth(1).textContent();
    const competition = await li.locator("div b").textContent();
    visitorPrice = "0.00";

    // if (clubid != "Orkney" && clubid != "machrie") {
    //   priceText = await li
    //     .locator('span:has-text("Visitors")')
    //     .first()
    //     .textContent();
    //   visitorPrice = priceText?.match(/Visitors:\s*£([\d.]+)/)?.[1];
    // }

    const tmpDate = date?.trim();

    const formLocator = li.locator("form");
    const formCount = await formLocator.count();
    let openid = "";

    if (formCount > 0) {
      const formAction = await formLocator.getAttribute("action");
      openid = formAction?.match(/CompID=(\d+)/)?.[1] || "";

      competitions.push({
        clubid,
        courseid,
        openid,
        date: convertDate(tmpDate),
        competition: competition?.trim(),
        visitorPrice,
      });
    }
  }
}

function convertDate(dateStr) {
  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const [, day, month, year] = dateStr.split(" ");

  const yyyy = "20" + year;
  const mm = months[month];
  const dd = day.padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}
