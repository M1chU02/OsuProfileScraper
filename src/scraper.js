import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
import { getCountries } from "./scripts/getCountries.js";
import { getProfileLinks } from "./scripts/getProfileLinks.js";
import { getProfileStats } from "./scripts/getProfileStats.js";
import { getPinnedScores } from "./scripts/getPinnedScores.js";
import { getTopScores } from "./scripts/getTopScores.js";

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

export const scrapeProfileLinks = async (countryUrl, pageNumber) => {
  let formattedUrl = "";
  let formattedUrlGlobal = "";
  let urlType = "";

  if (countryUrl == "https://osu.ppy.sh/rankings/osu/performance") {
    if (pageNumber == 1) {
      formattedUrlGlobal = `${countryUrl}#scores`;
      urlType = "formattedUrlGlobal";
    } else {
      formattedUrlGlobal = `${countryUrl}?page=${pageNumber}#scores`;
      urlType = "formattedUrlGlobal";
    }
  } else {
    if (pageNumber == 1) {
      formattedUrl = `${countryUrl}#scores`;
      urlType = "formattedUrl";
    } else {
      formattedUrl = `${countryUrl}&page=${pageNumber}#scores`;
      urlType = "formattedUrl";
    }
  }

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

    const fileName = path.join(__dirname, "../export/osu_profile_links.json");
    fs.writeFileSync(fileName, JSON.stringify(profileLinks, null, 2));
    console.log("Profile links saved");

    return profileLinks.length; // Return the number of profile links scraped
  } catch (error) {
    console.error("Error fetching profiles data:", error);
    return 0;
  } finally {
    await profilesBrowser.close();
  }
};

export const scrapeProfileData = async (userIdentifier) => {
  const profileUrl = `https://osu.ppy.sh/users/${userIdentifier}/osu`;

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

export const scrapeTopScores = async (
  profileLinks,
  startIndex = 0,
  count = 5
) => {
  const browsers = [];
  const topScoresData = [];
  const maxConcurrentRequests = 5;
  let activeRequests = 0;
  let currentIndex = startIndex;

  // Launch multiple browsers
  for (let i = 0; i < maxConcurrentRequests; i++) {
    const browser = await puppeteer.launch({
      args: ["--lang=en-US"],
      headless: false,
    });
    browsers.push(browser);
  }

  const scrapeProfile = async (profileLink, browser) => {
    const page = await browser.newPage();
    try {
      await page.goto(profileLink, {
        waitUntil: "networkidle2",
      });
      await page.setViewport({ width: 1920, height: 1080 });
      await page.waitForSelector("body");

      await autoScroll(page);

      const topScores = await getTopScores(page);
      topScoresData.push({ profileLink, topScores });
    } catch (error) {
      console.error(`Error fetching top scores for ${profileLink}:`, error);
    } finally {
      await page.close();
      activeRequests--;
      processQueue();
    }
  };

  const processQueue = () => {
    while (
      activeRequests < maxConcurrentRequests &&
      currentIndex < profileLinks.length &&
      currentIndex < startIndex + count
    ) {
      const profileLink = profileLinks[currentIndex];
      const browser = browsers[activeRequests % browsers.length];
      activeRequests++;
      currentIndex++;
      scrapeProfile(profileLink, browser);
    }
  };

  processQueue();

  // Wait for all requests to complete
  while (activeRequests > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  // Save all top scores data to a JSON file
  const fileName = path.join(__dirname, "../export/osu_top_scores.json");
  fs.writeFileSync(fileName, JSON.stringify(topScoresData, null, 2));
  console.log("Top scores data saved");

  // Close all browsers
  for (const browser of browsers) {
    await browser.close();
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
