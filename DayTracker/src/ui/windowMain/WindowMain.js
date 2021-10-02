const WindowModel = require('../WindowModel.js');

const { ipcMain } = require('electron');
const path = require('path');

class WindowMain extends WindowModel {

  constructor() {
    super('windowMain/windowMain.html', {
      height: 600,
      width: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "..", "preload.js")
      }
    });

    // ipcMain.on('user:connected', (e, user) => {
    //   this.window.webContents.send('windowMain:newUser', user);
    // })

  }

}

module.exports = WindowMain;
