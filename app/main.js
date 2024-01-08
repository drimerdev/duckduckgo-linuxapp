// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const Store = require('electron-store');

const store = new Store();

let mainWindow;
let settingsWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  const storedCredentials = store.get('credentials');

  // You can use the stored credentials to authenticate requests, etc.
  if (storedCredentials) {
    mainWindow.webContents.send('load-credentials', storedCredentials);
  }
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  settingsWindow.loadFile('settings.html');

  settingsWindow.on('closed', function () {
    settingsWindow = null;
  });
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  aboutWindow.loadFile('about.html');

  aboutWindow.on('closed', function () {
    aboutWindow = null;
  });
}

ipcMain.on('save-credentials', (event, credentials) => {
  // Save the credentials securely using electron-store
  store.set('credentials', credentials);
});

app.on('ready', createMainWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createMainWindow();
});

ipcMain.on('toggleDarkMode', (event, darkModeEnabled) => {
  if (mainWindow) {
    mainWindow.webContents.send('toggleDarkMode', darkModeEnabled);
  }
});

// ... (previous code) ...
