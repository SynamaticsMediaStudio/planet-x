'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
import { autoUpdater } from "electron-updater"

let win
protocol.registerSchemesAsPrivileged([{scheme: 'planetx', privileges: { secure: true, standard: true } }])

function createWindow () {
  win = new BrowserWindow(
    { 
      width: 800, 
      height: 600, 
      show:false,
      webPreferences: {
        nodeIntegration: true
      }
    })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('planetx')
    win.loadURL('planetx://./index.html')
  }
  win.once('ready-to-show', () =>{
    win.show();
    updateApplication(win)
  });
  win.on('closed', () => {
    win = null
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  createWindow()
})
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
function updateApplication(wn){
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on('checking-for-update', () => {
    wn.webContents.send('checking-for-update');
  });
  autoUpdater.on('error', (info) => {
    wn.webContents.send('update_error',error);
  });    
  autoUpdater.on('update-available', (info) => {
    wn.webContents.send('update_available',info);
  });    
  autoUpdater.on('update-downloaded', (info) => {
    wn.webContents.send('update_downloaded',info);
  });
  autoUpdater.on('update-not-available', (info) => {
    wn.webContents.send('update-not-available',info);
  });
  autoUpdater.on('download-progress', ({progress,bytesPerSecond,percent,total,transferred}) => {
    wn.webContents.send('update-download-progress',{progress,bytesPerSecond,percent,total,transferred});
  });
}