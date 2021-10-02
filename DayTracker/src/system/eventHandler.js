const { ipcMain } = require('electron');
const WindowManager = require('../ui/windowManager.js').getInstance();
const daoHandler = require('../dao/DayTrackerDAOHandler.js').getInstance();
const Reports = require('./Reports.js');
const path = require('path');
const pdf = require("html-pdf"); 
const ejs = require("ejs")

async function setupReports(){
  try {
    if(!reports){
      reports = await new Reports();
      await reports.getEverything(function(){
        console.log(reports.tasks);
        WindowManager.send("reports", 'windowReports:reports', { reports: reports });
      });
    } else {
      WindowManager.send("reports", 'windowReports:reports', { reports: reports });
    }
  } catch (err) {
    console.error(err);
  }
}






ipcMain.on('openWindow', (e, data) => {
  console.log(daoHandler.getConnectedUser());
  var params = ('params' in data) ? data.params : {};
  WindowManager.createWindow(data.windowName, params);
  if(data.sendConUser ?? false){
    WindowManager.sendOnReady(data.windowName, 'connectedUser', daoHandler.getConnectedUser());
  }
  // if(data.windowName === 'dayplanner'){
  //   WindowManager.sendTaskClassOnReady(data.windowName, 'dayPlanner:TaskClass');
  // }
});

ipcMain.on('closeWindow', (e, data) => {
  // console.log("closeWindow: "+data.windowName);
  WindowManager.closeWindow(data.windowName);
});


ipcMain.on('windowReports:requestReports', () => {
  setupReports();
})



ipcMain.on('user:connected', (e, user) => {
  WindowManager.send("main", 'windowMain:newUser', user);

})


function getTasksForWM(day = null, week = null){
  daoHandler.getTasks(tasks => {
    WindowManager.setupUserTasks(tasks);
    if(day ?? false) returnGetTasksFromDay(day);
    if(week ?? false) returnGetTasksFromWeek(week);
  }, () => {
    console.log("Error when getting tasks");
  });
}

curUserName = "";
//windowLogin
ipcMain.on('windowLogin:requestLogin', (e, data) => {
  daoHandler.login(data.username, data.password, (user) => {
    WindowManager.send("login", 'login:success', user);
    WindowManager.send("main", 'windowMain:newUser', user);
    WindowManager.closeWindow("login");
    WindowManager.resetTasks();
    curUserName = data.username;
    getTasksForWM();
  }, () => {
    WindowManager.send("login", 'login:failed');
  });
});


ipcMain.on('windowSignup:signup', (e, data) => {
  daoHandler.createAccount(data.username, data.password, data.email, () => {
    WindowManager.send("signup", 'signup:success');
  }, () => {
    WindowManager.send("signup", 'signup:failed');
  });
});


ipcMain.on('windowTaskEditor:saveTask', (e, data) => {
  daoHandler.saveTask(data, () => {
    WindowManager.send("taskeditor", 'saveTask:success')
  }, () => {
    WindowManager.send("taskeditor", 'saveTask:failed')
  })
});

ipcMain.on('windowTaskEditor:editResources', (e, data) => {
  WindowManager.createWindow('resourceeditor');
  WindowManager.sendOnReady('resourceeditor', 'windowResourceEditor:selectedTask', data)
})

ipcMain.on('windowTaskEditor:getTasks', () => {
  WindowManager.sendTasks("taskeditor", 'getTasks:success')

  // daoHandler.getTasks(function(tasks){
  //   WindowManager.send("taskeditor", 'getTasks:success', tasks)
  // }, () => {
  //   // console.log("FAILLLL");
  // })
})



ipcMain.on('windowResourceEditor:getResources', (e, compTask) => {
  daoHandler.getResources(compTask, (resources) => {
    WindowManager.send("resourceeditor", 'getResources:success', resources)
  })

  // daoHandler.getTasks(function(tasks){
  //   WindowManager.send("taskeditor", 'getTasks:success', tasks)
  // }, () => {
  //   // console.log("FAILLLL");
  // })
})

ipcMain.on('windowResourceEditor:saveResource', (e, resourceObj) => {
  daoHandler.saveResource(resourceObj, () => {
    WindowManager.send("resourceeditor", 'saveResource:success')
  }, () => {
    WindowManager.send("resourceeditor", 'saveResource:failed')
  })
})







function returnGetTasksFromDay(day){
  WindowManager.sendTasks("dayplanner", "getTasksFromDay:success", {
    day: day
  }, task => {
    // console.log(task);
    // console.log(day);
    // console.log(task.containsDay(day));
    return task.containsDay(day)
  });
}

ipcMain.on('windowDayPlanner:getTasksFromDay', (e, data) => {
  // console.log(e);
  // console.log(data);
  if(!WindowManager.hasTasks()){
    getTasksForWM(data.day);
  } else {
    returnGetTasksFromDay(data.day);
  }


  // daoHandler.getTasksFromDay(data.day, function(tasks){
  //   WindowManager.send("dayplanner", "getTasksFromDay:success", {
  //     tasks: tasks,
  //     day: data.day
  //   });
  // })
})


ipcMain.on('openTaskInEditor', (e, compTask) => {
  console.log("openTaskInEditor - "+compTask);
  WindowManager.createWindow("taskeditor");
  WindowManager.sendOnReady("taskeditor", 'openPresetTask', compTask);
});



function returnGetTasksFromWeek(week){
  WindowManager.sendTasks("weekplanner", "getTasksFromWeek:success", {
    week
  }, task => {
    return task.isInWeek(week)
  });
}


ipcMain.on('windowWeekPlanner:getTasksFromWeek', (e, data) => {
  console.log(data.week);
  if(!WindowManager.hasTasks()){
    getTasksForWM(null, data.week);
  } else {
    returnGetTasksFromWeek(data.week);
  }
  // WindowManager.send("weekplanner", "getTasksFromDay:success", {
  //   tasks: tasks,
  //   day: data.day
  // });
})

// ipcMain.on('windowWeekPlanner:getTasksFromDay', (e, data) => {
//   daoHandler.getTasksFromDay(data.day, function(tasks){
//     WindowManager.send("weekplanner", "getTasksFromDay:success", {
//       tasks: tasks,
//       day: data.day
//     });
//   })
// })










/// REPORTS

ipcMain.on('windowReports:allUserTasks', function(){
  ejs.renderFile(path.join(__dirname, ".", "reportModel.ejs"), {
    title: "All user tasks",
    username: curUserName,
    makeTable: true,
    headers: ["TaskId", "UserId", "Name", "TimeStart", "TimeEnd", "IsFinished"],
    content: WindowManager.getUserTasks().map(task => task.compactAsArray())
  }, (err, html) => {
    if(err) console.log(err);
    else {
      console.log(html);
      pdf.create(html, {}).toFile("src/reports/test1.pdf", (err, res) => {
        if(err) console.log(err);
        else console.log(res);
      });
    }
  })

})


ipcMain.on('windowReports:taskCompletionRate', function(){
  var today = "12/07/2021 00:00:00";
  var uTasks = WindowManager.getUserTasks(task => !task.timestart.isAfter(today)).map(task => task.compactAsArray());
  console.log(uTasks);
  var total = uTasks.length;
  var completed = uTasks.reduce((acc, task) => task[5] ? acc + 1 : acc, 0);
  var paragraphs = [];
  paragraphs.push("Completed "+completed+" out of "+total);
  ejs.renderFile(path.join(__dirname, ".", "reportModel.ejs"), {
    title: "All user tasks",
    username: curUserName,
    makeTable: false,
    headers: [],
    content: paragraphs
  }, (err, html) => {
    if(err) console.log(err);
    else {
      console.log(html);
      pdf.create(html, {}).toFile("src/reports/test1.pdf", (err, res) => {
        if(err) console.log(err);
        else console.log(res);
      });
    }
  })

})


function afterGetAllTasks(allTasks){
  console.log("===============");
  console.log(allTasks);
  console.log("===============");
  var results = [];
  for(var i = 0; i < allTasks.length; i++){
    results[allTasks[i].userid] = results[allTasks[i].userid] ?? 0;
    results[allTasks[i].userid]++;
  }
  var content = [];
  for(var i = 0; i < results.length; i++){
    content.push([i, results[i]]);
  }
  console.log(content);
  ejs.renderFile(path.join(__dirname, ".", "reportModel.ejs"), {
    title: "All user tasks",
    username: curUserName,
    makeTable: true,
    headers: ["UserId", "Total tasks"],
    content: content
  }, (err, html) => {
    if(err) console.log(err);
    else {
      console.log(html);
      pdf.create(html, {}).toFile("src/reports/test1.pdf", (err, res) => {
        if(err) console.log(err);
        else console.log(res);
      });
    }
  })
}


ipcMain.on('windowReports:userActivity', function(){

  daoHandler.getAllTasks(afterGetAllTasks);

})



ipcMain.on('windowReports:filtered', function(e, filters){
  var filteredTasks = WindowManager.getUserTasks().map(task => task.compactAsArray());
  console.log(filteredTasks);
  if('minTimeStart' in filters) {
    filteredTasks = filteredTasks.filter(task => isAfter(task[3], filters.minTimeStart));
  }
  if('maxTimeStart' in filters) {
    filteredTasks = filteredTasks.filter(task => isAfter(filters.maxTimeStart, task[3]));
  }
  if('minTimeEnd' in filters) {
    filteredTasks = filteredTasks.filter(task => isAfter(task[4], filters.minTimeEnd));
  }
  if('maxTimeEnd' in filters) {
    filteredTasks = filteredTasks.filter(task => isAfter(filters.maxTimeEnd, task[4]));
  }
  if('isFinished' in filters) {
    filteredTasks = filteredTasks.filter(task => filters.isFinished == task[5]);
  }



  ejs.renderFile(path.join(__dirname, ".", "reportModel.ejs"), {
    title: "Filtered user tasks",
    username: curUserName,
    makeTable: true,
    headers: ["TaskId", "UserId", "Name", "TimeStart", "TimeEnd", "IsFinished"],
    content: filteredTasks
  }, (err, html) => {
    if(err) console.log(err);
    else {
      console.log(html);
      pdf.create(html, {}).toFile("src/reports/test1.pdf", (err, res) => {
        if(err) console.log(err);
        else console.log(res);
      });
    }
  })

});









function isAfter(date, otherDate){
  var date1 = date.split(" ")[0].split("/");
  var date2 = otherDate.split(" ")[0].split("/");
  var time1 = date.split(" ")[1].split(":");
  var time2 = otherDate.split(" ")[1].split(":");
  var isAfter = true; //caso seja exatamente o mesmo, o desejado é true
  if(date1[2] > date2[2]) isAfter = true;
  else if(date1[2] < date2[2]) isAfter = false;
  else if(date1[1] > date2[1]) isAfter = true;
  else if(date1[1] < date2[1]) isAfter = false;
  else if(date1[0] > date2[0]) isAfter = true;
  else if(date1[0] < date2[0]) isAfter = false;
  else if(time1[0] > time2[0]) isAfter = true;
  else if(time1[0] < time2[0]) isAfter = false;
  else if(time1[1] > time2[1]) isAfter = true;
  else if(time1[1] < time2[1]) isAfter = false;
  else if(time1[2] > time2[2]) isAfter = true;
  else if(time1[2] < time2[2]) isAfter = false;
  return isAfter;
}


//a
