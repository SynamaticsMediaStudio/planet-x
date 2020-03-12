import { app, BrowserWindow } from 'electron'
import { initSplashScreen, OfficeTemplate } from 'electron-splashscreen';
import axios from '../axios'
import isDev from 'electron-is-dev';
import path from 'path';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    minWidth:600,
    minHeight:600,
    show:false,
    frame:false,
    webPreferences:{
      nodeIntegration:true,
      nodeIntegrationInWorker:true
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.once('ready-to-show',()=>{
    mainWindow.show();
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
async function generateSplash(){
  let reactiveTs = 'Connecting to server....'
  const hideSplashscreen = initSplashScreen({
    mainWindow,
    icon: undefined,
    url: OfficeTemplate,
    width: 400,
    height: 200,
    backgroundColor:'#9e9e9e',
    brand: 'Synamatics',
    productName: 'Planet-X',
    logo: "https://github.com/SynamaticsMediaStudio/planet-x/blob/master/static/logo/cover.png",
    website: 'www.my-brand.com',
    text: reactiveTs
  }).then(res=>{
    console.log('ok')
  });
  await axios.get('/')
     .then(res=>{
       window.alert(res.status)
         reactiveTs = "Connection Success"
         if(res.status == 200){
         reactiveTs = "Connection Success"
       }
     })
     .catch(error=>{
       reactiveTs = error
     })
     .then(()=>{

     })
   // hideSplashscreen();
   // createWindow();  
}



app.on('ready', generateSplash)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    generateSplash()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
