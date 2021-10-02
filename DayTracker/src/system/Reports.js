

let daoHandler;
 
function getDHInstance(){
  const DaoHandler = require('../dao/DayTrackerDAOHandler.js');
  daoHandler = DaoHandler.getInstance();
  console.log("xxx");
  console.log(daoHandler);
}

class Reports {



  constructor(){
    getDHInstance();
    this.tasks = null;
    this.allTasks = null;
    this.allUsers = null;
    this.getEverything();
  }

  async getEverything(callback){
    try{
      console.log("ge");
      this.tasks = await this.getTasks();
      this.allTasks = await this.getAllTasks();
      this.allUsers = await this.getAllUsers();
    } catch (err) {
      console.error(err);
    }

  }

  async getTasks(){
    try {
      var tttasks;
      if(this.tasks == null){
        await daoHandler.getTasks(function(returnedTasks){
          tttasks = returnedTasks;
        }, () => {
          console.log("Failed to get tasks");
        });
        return tttasks;
      } else return this.tasks;
    } catch(err) {
      console.error(err);
      return null;
    }

  }

  async getAllTasks(){
    try{
      var aaallTasks;
      if(this.allTasks == null){
        await daoHandler.getAllTasks(function(returnedTasks){
          aaallTasks = returnedTasks;
        }, () => {
          console.log("Failed to get all tasks");
        });
        return aaallTasks;
      } else return this.allTasks;
    } catch(err) {
      console.error(err);
      return null;
    }
  }

  async getAllUsers(){
    try{
      var aaalUsers;
      if(this.allUsers == null){
        await daoHandler.getAllUsers(function(returnedUsers){
          aaalUsers = returnedUsers;
        }, () => {
          console.log("Failed to get all users");
        });
        return aaalUsers;
      } else return this.allUsers;
    } catch(err) {
      console.error(err);
      return null;
    }
  }

  // async nextNum(defaultFileName){
  //   fs.readdir('../reports/', (err, files) => {
  //     console.log(files);
  //   });
  //
  // }

  async completionRateReport(){
    if(this.tasks){
      const total = this.tasks.length;
      const finished = this.tasks.reduce((acc, cur) => acc + (cur.isfinished ? 1 : 0), 0);
      const content = "User "+this.tasks[0].userid+" finished "+finished+" out of "+total+" tasks";
      // await this.nextNum("completionRateReport");
      // const num = 1;
      // fs.writeFile('../reports/completionRateReport.txt', content, err => {
      //   if(err){
      //     console.error(err);
      //   }
      // })
      console.table(this.tasks);
      return content;
    }
  }

  allTasksReport(){
    console.table(this.allTasks);
  }

  async allTasksReportA(){
    if(await this.getAllTasks()){
      return this.allTasks;
    }
  }

  async allTasksReportCB(callback){
    var t = await this.allTasksReportA();
    callback(t);
  }

  allTasksReportUse(callback){
    this.allTasksReportCB(callback);
  }

  async filteredTasksReportTable(filters){
    var fTasks = await this.filteredTasksReport(filters);
    console.table(fTasks);
  }

  async filteredTasksReport(filters){
    if(await this.getTasks()){
      var filteredTasks = this.tasks;
      if('minTimeStart' in filters) {
        filteredTasks = filteredTasks.filter(task => this.isAfter(task.timestart, filters.minTimeStart));
      }
      if('maxTimeStart' in filters) {
        filteredTasks = filteredTasks.filter(task => this.isAfter(filters.maxTimeStart, task.timestart));
      }
      if('minTimeEnd' in filters) {
        filteredTasks = filteredTasks.filter(task => this.isAfter(task.timeend, filters.minTimeEnd));
      }
      if('maxTimeEnd' in filters) {
        filteredTasks = filteredTasks.filter(task => this.isAfter(filters.maxTimeEnd, task.timeend));
      }
      if('isFinished' in filters) {
        filteredTasks = filteredTasks.filter(task => filters.isFinished == task.isfinished);
      }
      return filteredTasks;
    }
  }


  async userActivityTable(){
    var usActCount = await this.userActivity();
    console.table(usActCount);
  }

  async userActivity(){
    if(this.allTasks){
      var maxUserId = -1;
      for(var i = 0; i < this.allTasks.length; i++){
        if(this.allTasks[i].userid > maxUserId) maxUserId = this.allTasks[i].userid;
      }
      console.log(maxUserId);
      var userActivityCount = [];
      for(var i = 0; i <= maxUserId; i++){
        var numberOfTasks = 0;
        for(var j = 0; j < this.allTasks.length; j++){
          if(this.allTasks[j].userid == i) numberOfTasks++;
        }
        if(numberOfTasks > 0){
          userActivityCount.push({
            userid: i,
            numberOfTasks: numberOfTasks
          });
        }
      }
      if(this.allUsers){
        for(var i = 0; i < userActivityCount; i++){
          innerLoop: for(var j = 0; j < this.allUsers.length; j++){
            if(this.allUsers[j].userid == userActivityCount[i].userid){
              userActivityCount[i].name = this.allUsers[j].name;
              break innerLoop;
            }
          }
        }
      }
      return userActivityCount;
    }
  }

  isAfter(date, otherDate){
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
}


module.exports = Reports;
