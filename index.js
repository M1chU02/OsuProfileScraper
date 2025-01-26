import puppeteer from "puppeteer";
import fs from "fs";
import { getProfileStats } from "./getProfileStats.js";
import { getPinnedScores } from "./getPinnedScores.js";
import { getTopScores } from "./getTopScores.js";

const profileUrl = "https://osu.ppy.sh/users/7562902/osu";

const main = async () => {
  const browser = await puppeteer.launch({
    args: ["--lang=en-US"],
    headless: false,
  });
  const page = await browser.newPage();

  try {
    await page.goto(profileUrl, {
      waitUntil: "networkidle2",
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForSelector("body");

    await autoScroll(page);

    // Fetch profile stats and pinned scores
    const profileStats = await getProfileStats(page);
    const pinnedPlays = await getPinnedScores(page);
    const topScores = await getTopScores(page);

    const profileData = {
      profileStats,
      pinnedPlays,
      topScores,
    };

    // Save data to a JSON file
    const fileName = "osu_profile_data.json";
    fs.writeFileSync(fileName, JSON.stringify(profileData, null, 2));
    console.log("Profile data saved");
  } catch (error) {
    console.error("Error fetching profile data:", error);
  } finally {
    await browser.close();
  }
};

// Function to scroll the page
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

main();
