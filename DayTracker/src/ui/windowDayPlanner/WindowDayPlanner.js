const WindowModel = require('../WindowModel.js');

const { ipcMain } = require('electron');
const path = require('path');

const daoHandler = require('../../dao/DayTrackerDAOHandler.js').getInstance();

class WindowDayPlanner extends WindowModel {

  constructor() {
    super('windowDayPlanner/windowDayPlanner.html', {
      height: 600,
      width: 950,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, "..", "preload.js")
      }
    });


  }

}

module.exports = WindowDayPlanner;
