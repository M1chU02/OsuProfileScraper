// src/main.js
import puppeteer from "puppeteer";
import fs from "fs";
import { getProfileStats } from "./getProfileStats.js";
import { getPinnedScores } from "./getPinnedScores.js";

const url = "https://osu.ppy.sh/users/35516029";

const main = async () => {
  const browser = await puppeteer.launch({
    args: ["--lang=en-US"],
    headless: true,
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.waitForSelector("body");

    // Fetch profile stats and pinned scores
    const profileStats = await getProfileStats(page);
    const pinnedPlays = await getPinnedScores(page);

    const profileData = {
      profileStats,
      pinnedPlays,
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

main();
