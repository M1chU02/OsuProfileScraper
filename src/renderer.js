let testBtn = document.getElementById("testBtn");
testBtn.addEventListener("click", async () => {
  alert("Test button clicked!");
  console.log("Test button clicked!");
});

document.addEventListener("DOMContentLoaded", async () => {
  let countryValues = await window.electron.ipcRenderer.invoke(
    "scrape-countries-values"
  );
  let countrySelect = document.getElementById("countrySelect");
  countryValues.forEach((country) => {
    let option = document.createElement("option");
    option.value = country.countryUrl;
    option.text = country.countryName;
    countrySelect.appendChild(option);
  });
});

let scrapeProfileDataBtn = document.getElementById("scrapeProfileDataBtn");
let scrapeProfileLinksBtn = document.getElementById("scrapeProfileLinksBtn");
let scrapeNextTopScoresBtn = document.getElementById("scrapeNextTopScoresBtn");

let profileLinksArray = [];
let currentIndex = 0;

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
  let countryUrl = document.getElementById("countrySelect").value;
  let pageNumber = document.getElementById("pageNumber").value;
  if (pageNumber && countryUrl) {
    const numLinks = await window.electron.ipcRenderer.invoke(
      "scrape-profile-links",
      countryUrl,
      pageNumber
    );
    // Fetch profile links and scrape top scores from the first 5 profiles
    try {
      const response = await fetch("export/osu_profile_links.json");
      profileLinksArray = await response.json();

      currentIndex = 0;
      await window.electron.ipcRenderer.invoke(
        "scrape-top-scores",
        profileLinksArray.slice(currentIndex, currentIndex + 5)
      );

      alert(
        `Profile links and top scores scraped and saved! ${numLinks} links found.`
      );
    } catch (error) {
      console.error("Error fetching profile links:", error);
      alert("Error fetching profile links.");
    }
  } else {
    alert("Please enter a page number.");
  }
});

scrapeNextTopScoresBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (currentIndex < profileLinksArray.length) {
    currentIndex += 5;
    await window.electron.ipcRenderer.invoke(
      "scrape-top-scores",
      profileLinksArray.slice(currentIndex, currentIndex + 5)
    );
    alert("Next set of top scores scraped and saved!");
  } else {
    alert("No more profiles to scrape.");
  }
});

// Add a delay mechanism to the button click
let isButtonDisabled = false;
scrapeNextTopScoresBtn.addEventListener("click", async (event) => {
  if (isButtonDisabled) return;
  isButtonDisabled = true;
  setTimeout(() => {
    isButtonDisabled = false;
  }, 5000); // 5 seconds delay
});
