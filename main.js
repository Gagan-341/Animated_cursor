// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     transparent: true,
//     frame: false,
//     alwaysOnTop: true,
//     hasShadow: false,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//       nodeIntegration: true,
//       contextIsolation: false,
//     }
//   });

//   win.setIgnoreMouseEvents(false); // Set to true if you want click-through
//   win.loadFile('index.html');
// }

// // Make window click-through when needed
// const { ipcMain } = require('electron');

// ipcMain.on('toggle-clickthrough', (event, isClickThrough) => {
//   win.setIgnoreMouseEvents(isClickThrough, { forward: true });
// });

// app.whenReady().then(() => {
//   createWindow();
// });

// const { Tray, Menu } = require('electron');

// let tray = null;

// app.whenReady().then(() => {
//   tray = new Tray('icon.png'); // You need an icon.png file
//   const contextMenu = Menu.buildFromTemplate([
//     { label: 'Toggle Smoke', click: () => {
//       win.webContents.send('toggle-smoke');
//     }},
//     { label: 'Quit', click: () => {
//       app.quit();
//     }}
//   ]);
//   tray.setToolTip('Smoky Cursor App');
//   tray.setContextMenu(contextMenu);
// });

const { app, BrowserWindow, screen, ipcMain } = require('electron');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    fullscreen: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  win.webContents.once('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      const { ipcRenderer } = require('electron');
      const toggle = document.getElementById('toggle');
      
      toggle.addEventListener('mouseenter', () => {
        ipcRenderer.send('mouse-enter-toggle');
      });

      toggle.addEventListener('mouseleave', () => {
        ipcRenderer.send('mouse-leave-toggle');
      });
    `);
  });

  // By default, ignore mouse everywhere
  win.setIgnoreMouseEvents(true, { forward: true });
}

app.whenReady().then(createWindow);

ipcMain.on('mouse-enter-toggle', () => {
  win.setIgnoreMouseEvents(false);
});

ipcMain.on('mouse-leave-toggle', () => {
  win.setIgnoreMouseEvents(true, { forward: true });
});

// NEW — when toggle hides, ignore mouse everywhere
ipcMain.on('toggle-hidden', () => {
  win.setIgnoreMouseEvents(true, { forward: true });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
