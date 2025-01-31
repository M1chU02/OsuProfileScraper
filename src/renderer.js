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
