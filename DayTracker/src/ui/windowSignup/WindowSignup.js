const WindowModel = require('../WindowModel.js');

const { ipcMain } = require('electron');
const path = require('path');

const daoHandler = require('../../dao/DayTrackerDAOHandler.js').getInstance();

class WindowSignup extends WindowModel {

  constructor() {
    super('windowSignup/windowSignup.html', {
      height: 600,
      width: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "..", "preload.js")
      }
    });

    //Listener para receber solicitação de signup da página e encaminhá-la para o DAOHandler
    // ipcMain.on('windowSignup:signup', (e, data) => {
    //   daoHandler.createAccount(data.username, data.password, data.email, () => {
    //     this.window.webContents.send('signup:success');
    //   }, () => {
    //     this.window.webContents.send('signup:failed');
    //   });
    // });
  }

}

module.exports = WindowSignup;
