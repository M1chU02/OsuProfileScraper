const puppeteer = require("puppeteer");

const url = "https://osu.ppy.sh/users/35516029";

const main = async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: true, // Set to false if you want to see the browser UI
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Optional arguments for better compatibility
  });

  // Open a new page
  const page = await browser.newPage();

  // Set a default user agent (optional, but helps avoid detection)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  );

  await page.goto(url, {
    waitUntil: "networkidle2", // Wait for the page to fully load
  });

  const profileData = await page.evaluate(() => {
    const profileName = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-info.profile-info--cover > div.profile-info__details > div.profile-info__info > h1 > span"
    ).innerHTML;

    const profileRank = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div.profile-detail__chart-numbers.profile-detail__chart-numbers--top > div:nth-child(1) > div:nth-child(1) > div.value-display__value > div"
    ).innerHTML;

    const profilePlayCount = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div.profile-stats > dl.profile-stats__entry.profile-stats__entry--key-play_count > dd"
    ).innerHTML;

    const profilePP = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div:nth-child(1) > div:nth-child(3) > div.profile-detail__values.profile-detail__values--grid > div:nth-child(2) > div.value-display__value > div"
    ).innerHTML;

    const profileAccuracy = document.querySelector(
      "body > div.osu-layout__section.osu-layout__section--full > div > div > div > div.osu-page.osu-page--generic-compact > div:nth-child(1) > div.profile-detail > div > div.profile-stats > dl.profile-stats__entry.profile-stats__entry--key-hit_accuracy > dd"
    ).innerHTML;

    return {
      profileName,
      profileRank,
      profilePlayCount,
      profilePP,
      profileAccuracy,
    };
  });
  console.log(profileData);

  // Close the browser
  await browser.close();
};

main();
