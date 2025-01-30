import puppeteer from "puppeteer";
import { getCountries } from "./scripts/getCountries.js";

let testBtn = document.getElementById("testBtn");
testBtn.addEventListener("click", async () => {
  alert("Test button clicked!");
  console.log("Test button clicked!");
});

// TODO: Inject country options to select element
const countriesUrl = "https://osu.ppy.sh/rankings/osu/performance";

export const scrapeCountriesValues = async () => {
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

    const countrySelect = document.getElementById("countrySelect");
    countriesValues.forEach((country) => {
      const option = document.createElement("option");
      option.value = country;
      option.textContent = country;
      countrySelect.appendChild(option);
    });

    console.log("Countries values injected");
  } catch (error) {
    console.error("Error fetching countries data:", error);
  } finally {
    await countriesBrowser.close();
  }
};

scrapeCountriesValues();

let scrapeProfileDataBtn = document.getElementById("scrapeProfileDataBtn");
let scrapeProfileLinksBtn = document.getElementById("scrapeProfileLinksBtn");

scrapeProfileDataBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  let userName = document.getElementById("userName").value;
  let userId = document.getElementById("userId").value;
  if (userName || userId) {
    await window.electron.ipcRenderer.invoke(
      "scrape-profile-data",
      userName || userId
    );
    alert("Profile data scraped and saved!");
  } else {
    alert("Please enter a user name.");
  }
});

scrapeProfileLinksBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  // TODO: Add input validation
  // TODO: Handle country selection
  let pageNumber = document.getElementById("pageNumber").value;
  if (pageNumber) {
    await ipcRenderer.invoke("scrape-profile-links", pageNumber);
    alert("Profile links scraped and saved!");
  } else {
    alert("Please enter a page number.");
  }
});
