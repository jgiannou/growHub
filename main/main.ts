import { app, BrowserWindow } from "electron";
import * as path from "path";
import axios from "axios";

let mainWindow: BrowserWindow | null = null;
const STRAPI_URL = "http://127.0.0.1:1338";
const MAX_RETRIES = 30;
const RETRY_INTERVAL = 1000;

async function waitForStrapi(retries = 0): Promise<boolean> {
  if (retries >= MAX_RETRIES) {
    console.error("Failed to connect to Strapi after maximum retries");
    return false;
  }

  try {
    console.log(`Checking Strapi (attempt ${retries + 1}/${MAX_RETRIES})...`);
    await axios.get(STRAPI_URL, {
      httpAgent: new (require("http").Agent)({ family: 4 }),
      timeout: 2000,
      validateStatus: (status) => {
        return true;
      },
    });

    console.log("Successfully connected to Strapi");
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response && error.code === "ECONNREFUSED") {
        console.log("Strapi not ready yet, retrying...");
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
        return waitForStrapi(retries + 1);
      }

      if (error.response) {
        console.log("Strapi is running (got HTTP response)");
        return true;
      }
    }

    console.error("Unexpected error:", error);
    return false;
  }
}

function createWindow(): void {
  console.log("Creating main window...");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  console.log("Window created, loading content...");

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "../dist/index.html")}`;
  console.log("Loading URL:", startUrl);

  mainWindow.loadURL(startUrl).catch((err) => {
    console.error("Failed to load URL:", err);
  });

  mainWindow.on("closed", () => {
    console.log("Window closed");
    mainWindow = null;
  });
}

async function initializeApp() {
  try {
    console.log("Waiting for Strapi to be ready...");
    const strapiReady = await waitForStrapi();

    if (!strapiReady) {
      console.error(
        "Failed to connect to Strapi server. Please ensure Strapi is running on port 1338"
      );
      app.quit();
      return;
    }

    createWindow();
  } catch (error) {
    console.error("Error during app initialization:", error);
    app.quit();
  }
}

app.whenReady().then(initializeApp);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    initializeApp();
  }
});
