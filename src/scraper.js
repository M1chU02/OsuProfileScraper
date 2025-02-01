import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname, format } from "path";
import path from "path";
import fs from "fs";
import { getCountries } from "./scripts/getCountries.js";
import { getProfileLinks } from "./scripts/getProfileLinks.js";
import { getProfileStats } from "./scripts/getProfileStats.js";
import { getPinnedScores } from "./scripts/getPinnedScores.js";
import { getTopScores } from "./scripts/getTopScores.js";
import { count } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const scrapeCountriesValues = async () => {
  const countriesUrl = "https://osu.ppy.sh/rankings/osu/performance";
  const countriesBrowser = await puppeteer.launch({
    args: ["--lang=en-US"],
    headless: false,
  });
  const countriesPage = await countriesBrowser.newPage();

  try {
    await countriesPage.goto(countriesUrl, {
      waitUntil: "networkidle2",
    });
    await countriesPage.setViewport({ width: 1920, height: 1080 });
    await countriesPage.waitForSelector("body");

    const countriesValues = await getCountries(countriesPage);
    return countriesValues;
  } catch (error) {
    console.error("Error fetching countries data:", error);
    throw error;
  } finally {
    await countriesBrowser.close();
  }
};

// TODO: Handle passing variables
export const scrapeProfileLinks = async (countryUrl, pageNumber) => {
  let formattedUrl = "";
  let formattedUrlGlobal = "";
  let urlType = "";

  if (countryUrl == "https://osu.ppy.sh/rankings/osu/performance") {
    console.log("main");
    if (pageNumber == 1) {
      console.log("first");
      formattedUrlGlobal = `${countryUrl}#scores`;
      urlType = "formattedUrlGlobal";
    } else {
      console.log("other");
      formattedUrlGlobal = `${countryUrl}?page=${pageNumber}#scores`;
      urlType = "formattedUrlGlobal";
    }
  } else {
    if (pageNumber == 1) {
      console.log("certain first");
      formattedUrl = `${countryUrl}#scores`;
      urlType = "formattedUrl";
    } else {
      console.log("certain other");
      formattedUrl = `${countryUrl}&page=${pageNumber}#scores`;
      urlType = "formattedUrl";
    }
  }
  console.log("Formatted URL:", formattedUrl || formattedUrlGlobal);

  const profilesBrowser = await puppeteer.launch({
    args: ["--lang=en-US"],
    headless: false,
  });
  const profilesPage = await profilesBrowser.newPage();

  try {
    const urlToVisit = formattedUrl || formattedUrlGlobal;
    await profilesPage.goto(urlToVisit, {
      waitUntil: "networkidle2",
    });
    await profilesPage.setViewport({ width: 1920, height: 1080 });
    await profilesPage.waitForSelector("body");

    await autoScroll(profilesPage);

    const profileLinks = await getProfileLinks(profilesPage, urlType);
    console.log(profileLinks);

    const fileName = path.join(__dirname, "../export/osu_profile_links.json");
    fs.writeFileSync(fileName, JSON.stringify(profileLinks, null, 2));
    console.log("Profile links saved");
  } catch (error) {
    console.error("Error fetching profiles data:", error);
  } finally {
    await profilesBrowser.close();
  }
};

// TODO: Handle passing variables
export const scrapeProfileData = async (userIdentifier) => {
  console.log("scrapeProfileData called with userIdentifier:", userIdentifier); // Add this line
  const profileUrl = `https://osu.ppy.sh/users/${userIdentifier}/osu`;
  console.log("Generated profileUrl:", profileUrl);

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
    const profileStats = await getProfileStats(profilePage, userIdentifier);
    const pinnedPlays = await getPinnedScores(profilePage, userIdentifier);
    const topScores = await getTopScores(profilePage, userIdentifier);

    const profileData = {
      profileStats,
      pinnedPlays,
      topScores,
    };

    // Save data to a JSON file
    const fileName = path.join(__dirname, "../export/osu_profile_data.json");
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
