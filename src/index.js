import { app, BrowserWindow } from 'electron';
import urlParser from 'url';
import path from 'path';
import { exec } from 'child_process';

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
    width: 1024,
    height: 768,
    kiosk: true,
    frame: false,
    closable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'renderer.js'),
      devTools: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://ls.terminal.ink/bots/kiosk');

  // When the URL changes, we need to check if we're on a valid link
  const onChangeUrl = (e, url) => {
    const parsed = urlParser.parse(url);

    // If we're on the discord oauth page, allow
    if (parsed.host === 'discordapp.com' && parsed.pathname === '/oauth2/authorize') {
      // discord
    } else if (parsed.host === 'ls.terminal.ink') {
      // webserver
    } else if (parsed.protocol === 'x-ls-terminal-ink:' && parsed.host === 'disconnect') { // if we're on any local file, allow
      app.exit();
      e.preventDefault();
    } else { // If we somehow got somewhere else, go home
      e.preventDefault();
      mainWindow.loadURL('http://ls.terminal.ink/bots/kiosk');
    }
  };

  // Check link change for hash and on normal page changes
  mainWindow.webContents.on('will-navigate', onChangeUrl);
  mainWindow.webContents.on('navigation-entry-commited', onChangeUrl);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // You cannot create new windows
  mainWindow.webContents.on('new-window', (e) => {
    e.preventDefault();
  });
};

app.on('ready', createWindow);
