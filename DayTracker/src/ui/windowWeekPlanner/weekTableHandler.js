var colors = {
  color0: "#C4DFE5",
  color1: "#8fd6e1",
  color2: "#1597bb",
  color3: "#150e56",
  color4: "#7b113a",
  color5: "#0A4B5D",
  color6: "#10798C",
  color50: "#97bb15",
  color60: "#bb1597"
}

var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var curDate = new DateTime('23/05/2021 00:00:00');
// {
//   day: 23,
//   month: 5,
//   year: 2021
// }

var tasks = [];

function setup() {
  var canvas = createCanvas(770, 300);
  canvas.parent("canvasContainer");
}

function basicDraw(){
  stroke(0, 0, 0, 255);
  // stroke(0, 0, 0, 100);
  // stroke(0, 0, 0, 50*weight);
  textSize(20);
  strokeWeight(2);
  for(var i = 0; i <= 7; i++){
    line(110*i, 0, 110*i, 300);
  }
  strokeWeight(1);
  fill(0)
  for(var i = 0; i < 7; i++){
    text(weekDays[i], 110*i, 17);
  }
  noFill()
}

function resetTasks(){
  tasks = [];
}


function addTask(compTask, week){
  var tempDay = new DateTime(week.sunday);
  var task = new Task(...compTask);

  for(var i = 0; i < 7; i++){
    if(task.containsDay(tempDay)){
      console.log("-------");
      console.log(task);
      console.log(tempDay.getDateAsString());
      console.log(task.containsDay(tempDay));
      addTaskInDay(task, tempDay, i);
    }
    tempDay = tempDay.tomorrow();
  }

}


function addTaskInDay(task, day, dayOfWeek){
  //var timestart = task.timestart.split(" ")[1].split(":");
  console.log("--");
  var timestart = [task.timestart.hours, task.timestart.minutes, task.timestart.seconds];
  console.log(timestart);
  //var timeend = task.timefinish.split(" ")[1].split(":");
  var timeend = [task.timeend.hours, task.timeend.minutes, task.timeend.seconds];
  console.log(timeend);
  var start = 25*(parseInt(timestart[0])+parseInt(timestart[1])/60+parseInt(timestart[2])/3600);
  var end = 25*(parseInt(timeend[0])+parseInt(timeend[1])/60+parseInt(timeend[2])/3600);
  //if(task.timestart.split(" ")[0] !== day) start = 0;
  //if(task.timefinish.split(" ")[0] !== day) end = 600;
  if(!task.timestart.isEqual(day, 'day')) start = 0;
  if(!task.timeend.isEqual(day, 'day')) end = 600;
  tasks.push({
    task: task,
    dayOfWeek: dayOfWeek,
    start: start/2,
    end: end/2,
    strong: getNextStrong()
  });
}

function getNextStrong(){
  if(tasks.length > 0) return !tasks[tasks.length-1].strong;
  else return true;
}



function draw() {
  background(color(colors.color1));
  stroke(0, 0, 0, 255);
  strokeWeight(1);
  for(var i = 0; i < tasks.length; i++){
    var taskColor = tasks[i].strong ? color(colors.color5) : color(colors.color6);
    taskColor.setAlpha(255);
    fill(taskColor);
    rect(110*tasks[i].dayOfWeek, tasks[i].start, 110, tasks[i].end-tasks[i].start);
  }
  basicDraw();
  // strokeWeight(15);
  // stroke(0, 0, 0, 100);
  // line(25*9+1, 0, 25*9+1, 40)
}

// var updateInfo = null;
//
// function setUpdateInfoFunction(f){
//   updateInfo = f;
// }


function mouseMoved(){

}

function mouseClicked(){

}

var funcRequestTasks = null;

function setFuncRequestTasks(f){
  funcRequestTasks = f;
}

function changeDate(forward){
  if(forward){
    curDate.updateValues({ day: curDate.day+7 });
    curDate.updateFromModularTransform();
  } else {
    curDate.updateValues({ day: curDate.day-7 });
    curDate.updateFromModularTransform();
  }
  endOfWeek = new DateTime(curDate.getDateAsString());
  endOfWeek.updateValues({ day: endOfWeek.day+7, seconds: endOfWeek.seconds-1 });
  endOfWeek.updateFromModularTransform();
  $(".block > h2").html(curDate.getDateAsString().slice(0, 5) + " - " +endOfWeek.getDateAsString().slice(0, 5));
  funcRequestTasks(curDate.day, curDate.month, curDate.year);
}
