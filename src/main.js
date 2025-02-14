import { app, BrowserWindow, ipcMain, Menu } from "electron";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  scrapeCountriesValues,
  scrapeProfileLinks,
  scrapeProfileData,
  scrapeTopScores,
} from "./scraper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile("views/index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Handle IPC events
  ipcMain.handle("scrape-countries-values", async () => {
    const countryValues = await scrapeCountriesValues();
    return countryValues;
  });

  ipcMain.handle(
    "scrape-profile-links",
    async (event, countryUrl, pageNumber) => {
      await scrapeProfileLinks(countryUrl, pageNumber);
    }
  );

  ipcMain.handle("scrape-profile-data", async (event, userIdentifier) => {
    await scrapeProfileData(userIdentifier);
  });

  ipcMain.handle("scrape-top-scores", async (event, profileLinksArray) => {
    await scrapeTopScores(profileLinksArray);
  });

  // Create a custom menu
  const menuTemplate = [
    { label: "file", submenu: [{ role: "quit" }] },
    {
      label: "help",
      submenu: [
        {
          label: "About",
          click: () => {
            const aboutWindow = new BrowserWindow({
              width: 400,
              height: 300,
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
              },
            });
            aboutWindow.loadFile("views/about.html");
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
