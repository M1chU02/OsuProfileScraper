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
    await window.electron.ipcRenderer.invoke(
      "scrape-profile-links",
      countryUrl,
      pageNumber
    );
    // Fetch profile links and scrape top scores from each profile
    try {
      const response = await fetch("export/osu_profile_links.json");
      const profileLinksArray = await response.json();
      console.log(profileLinksArray);

      await window.electron.ipcRenderer.invoke(
        "scrape-top-scores",
        profileLinksArray
      );

      alert("Profile links and top scores scraped and saved!");
    } catch (error) {
      console.error("Error fetching profile links:", error);
      alert("Error fetching profile links.");
    }
  } else {
    alert("Please enter a page number.");
  }
});
