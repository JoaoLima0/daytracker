const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

class AppWindow {

  constructor(name, inputParams = {}) {
    // console.log("a");

    var params = {
      height: ('height' in inputParams) ? inputParams.height : 600,
      width: ('width' in inputParams) ? inputParams.width : 900,
      webPreferences: {
        nodeIntegration: ('nodeIntegration' in inputParams) ? inputParams.nodeIntegration : false,
        contextIsolation: ('contextIsolation' in inputParams) ? inputParams.contextIsolation : true,
        enableRemoteModule: false,
        preload: ('preload' in inputParams) ? inputParams.preload : path.join(__dirname, ".", "preload.js")
      }
    } 


    this.window = new BrowserWindow(params);

    var filePath = 'window'+name+'/window'+name+'.html'

    this.window.loadURL(url.format({
        pathname: path.join(__dirname, filePath),
        protocol: 'file:',
        slashes: true
    }));

    this.window.on('close', () => {
      this.window = null;
    });
  }

}

module.exports = AppWindow;
