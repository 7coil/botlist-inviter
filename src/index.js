import { app, BrowserWindow } from 'electron';
import urlParser from 'url';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk: true,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'renderer.js'),
      // devTools: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const onChangeUrl = (e, url) => {
    const parsed = urlParser.parse(url);
    console.log(parsed);
    if (parsed.host === 'discordapp.com' && parsed.pathname === '/oauth2/authorize') {
      // discord
    } else if (parsed.protocol === 'file:') {
      // home
    } else {
      // Not Home or Discord Invite link. Terminate and go home
      e.preventDefault();
      mainWindow.loadURL(`file://${__dirname}/index.html`);
    }
  };

  mainWindow.webContents.on('will-navigate', onChangeUrl);
  mainWindow.webContents.on('navigation-entry-commited', onChangeUrl);
};

app.on('ready', createWindow);
