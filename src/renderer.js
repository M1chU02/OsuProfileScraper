import { ipcRenderer } from "electron";

document
  .getElementById("scrapeProfileLinksBtn")
  .addEventListener("click", async () => {
    await ipcRenderer.invoke("scrape-profile-links");
    alert("Profile links scraped and saved!");
  });

document
  .getElementById("scrapeProfileDataBtn")
  .addEventListener("click", async () => {
    await ipcRenderer.invoke("scrape-profile-data");
    alert("Profile data scraped and saved!");
  });
