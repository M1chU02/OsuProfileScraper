import puppeteer from "puppeteer";
import fs from "fs";
import { getProfileLinks } from "./scripts/getProfileLinks.js";
import { getProfileStats } from "./scripts/getProfileStats.js";
import { getPinnedScores } from "./scripts/getPinnedScores.js";
import { getTopScores } from "./scripts/getTopScores.js";

/*const profileUrl = "https://osu.ppy.sh/users/7562902/osu";
const profilesUrl =
  "https://osu.ppy.sh/rankings/osu/performance?country=AT&page=3#scores";*/

// TODO: Handle passing variables
export const scrapeProfileLinks = async () => {
  const profilesBrowser = await puppeteer.launch({
    args: ["--lang=en-US"],
    headless: false,
  });
  const profilesPage = await profilesBrowser.newPage();

  try {
    await profilesPage.goto(profilesUrl, {
      waitUntil: "networkidle2",
    });
    await profilesPage.setViewport({ width: 1920, height: 1080 });
    await profilesPage.waitForSelector("body");

    await autoScroll(profilesPage);

    const profileLinks = await getProfileLinks(profilesPage);

    const fileName = "osu_profile_links.json";
    fs.writeFileSync(fileName, JSON.stringify(profileLinks, null, 2));
    console.log("Profile links saved");
  } catch (error) {
    console.error("Error fetching profiles data:", error);
  } finally {
    await profilesBrowser.close();
  }
};

// TODO: Handle passing variables
export const scrapeProfileData = async () => {
  const profileBrowser = await puppeteer.launch({
    args: ["--lang=en-US"],
    headless: false,
  });
  const profilePage = await profileBrowser.newPage();

  try {
    await profilePage.goto(profileUrl, {
      waitUntil: "networkidle2",
    });
    await profilePage.setViewport({ width: 1920, height: 1080 });
    await profilePage.waitForSelector("body");

    await autoScroll(profilePage);

    // Fetch profile stats and pinned scores
    const profileStats = await getProfileStats(profilePage);
    const pinnedPlays = await getPinnedScores(profilePage);
    const topScores = await getTopScores(profilePage);

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
    await profileBrowser.close();
  }
};

// Function to scroll the profile page
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
