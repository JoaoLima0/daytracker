const { BrowserWindow, ipcMain } = require('electron');
const AppWindow = require('./AppWindow.js');
const Task = require('../system/Task.js');

let instance = null;
 
let caseSensitive = {
  main: "Main",
  login: "Login",
  signup: "Signup",
  taskeditor: "TaskEditor",
  dayplanner: "DayPlanner",
  weekplanner: "WeekPlanner",
  reports: "Reports",
  resourceeditor: "ResourceEditor"
};

/*
classe WindowManager - armazena as diversas telas e possui métodos para lidar com elas
precisa de um rework:
- armazenar telas em um objeto com as respectivas keys
- montar loops nos métodos ao invés de hard coding
*/

class WindowManager {

  constructor(){
    this.windows = {
      main: null,
      login: null,
      signup: null,
      taskeditor: null,
      dayplanner: null,
      weekplanner: null,
      reports: null,
      resourceeditor: null
    }
  };

  createWindow(name, params = {}){
    if(!this.windows[name]){
      if(name in caseSensitive){
        var newWindow = new AppWindow(caseSensitive[name], params);
        newWindow.window.on('close', () => {
          this.windows[name] = null;
        });
        this.windows[name] = newWindow;
      }
    }
  };

  closeWindow(name){
    this.windows[name].window.close();
  }

  send(name, msg, data = null){
    this.windows[name].window.webContents.send(msg, data);
  }

  sendOnReady(name, msg, data = null){
    this.windows[name].window.on('ready-to-show', () => {
      this.send(name, msg, data);
    });
  }

  sendTasks(name, msg, data = null, filter = null){
    data = data ?? {};
    data.tasks = this.getUserTasks(filter).map(task => task.compactAsArray());
    console.log(data.tasks);
    this.send(name, msg, data);
  }

  // sendTaskClassOnReady(name, msg){
  //   var data = Task;
  //   this.sendOnReady(name, msg, data);
  // }

  // printOpenWindows(){
  //   console.log("Open windows:");
  //   if(this.windows["main"] != null) console.log(" - Main");
  //   if(this.windows["login"] != null) console.log(" - Login");
  //   if(this.windows["signup"] != null) console.log(" - Signup");
  //   if(this.windows["taskeditor"] != null) console.log(" - Task Editor");
  // };

  setupUserTasks(returnedTasks){
    // console.log("WindowManager:setupUserTasks");
    // console.log(returnedTasks);
    var tasks = [];
    for(var i = 0; i < returnedTasks.length; i++){
      var rTask = returnedTasks[i]
      // console.log(rTask);
      var task = new Task(rTask.taskid, rTask.userid, rTask.title, rTask.timestart, rTask.timefinish, rTask.isfinished);
      tasks.push(task);
    }
    this.tasks = tasks;
    // console.log(this.tasks);
  }

  resetTasks(){
    this.tasks = null;
  }

  hasTasks(){
    return this.tasks ?? false;
  }

  getUserTasks(filter = x => x){
    filter = filter ?? function(task){return task};
    return this.tasks.filter?.(filter) ?? this.tasks;
  }

  static getInstance(){
    if(!instance){
      instance = new WindowManager();
    }
    return instance;
  }

}


module.exports = WindowManager;
