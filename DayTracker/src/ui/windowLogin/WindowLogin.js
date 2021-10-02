const WindowModel = require('../WindowModel.js');

const { ipcMain } = require('electron');
const path = require('path');

const daoHandler = require('../../dao/DayTrackerDAOHandler.js').getInstance();

class WindowLogin extends WindowModel {

  constructor() {
    super('windowLogin/windowLogin.html', {
      height: 600,
      width: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "..", "preload.js")
      }
    });

    //Listener para receber solicitação de login da página e encaminhá-la para o DAOHandler
    // ipcMain.on('windowLogin:requestLogin', (e, data) => {
    //   daoHandler.login(data.username, data.password, (user) => {
    //     this.window.webContents.send('login:success', user);
    //   }, () => {
    //     this.window.webContents.send('login:failed');
    //   });
    // });
  }

}

module.exports = WindowLogin;
