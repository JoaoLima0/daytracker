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

var curDate = {
  day: 25,
  month: 5,
  year: 2021
}


var tasks = [];

function setup() {
  var canvas = createCanvas(600, 300);
  canvas.parent("canvasContainer");
}

function verticalLine(hour, weight){
  strokeWeight(weight);
  stroke(0, 0, 0, 255);
  // stroke(0, 0, 0, 100);
  // stroke(0, 0, 0, 50*weight);
  line(25*hour, 0, 25*hour, 5*weight*weight*weight);
}

function resetTasks(){
  tasks = [];
}


function addTask(compTask, day){

  var task = new Task(...compTask);
  console.log("...compTask");
  console.log(task);


  // var timestart = task.timestart.split(" ")[1].split(":");
  var timestart = [task.timestart.hours, task.timestart.minutes, task.timestart.seconds]
  //var timeend = task.timeend.split(" ")[1].split(":");
  var timeend = [task.timeend.hours, task.timeend.minutes, task.timeend.seconds];
  var start = 25*(parseInt(timestart[0])+parseInt(timestart[1])/60+parseInt(timestart[2])/3600)
  var end = 25*(parseInt(timeend[0])+parseInt(timeend[1])/60+parseInt(timeend[2])/3600)
  if(!task.timestart.isEqualFromStr(day, 'day')) start = 0;
  if(!task.timeend.isEqualFromStr(day, 'day')) end = 600;
  tasks.push({
    task: task,
    start: start,
    end: end,
    strong: getNextStrong(),
    compactTaskAsArray: function(){
      return this.task.compactAsArray();
    }
  });
  console.log(tasks[tasks.length - 1]);
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
    rect(tasks[i].start, 0, tasks[i].end-tasks[i].start, 300);
  }
  for(var i = 1; i < 24; i++){
    var weight = 1;
    if(i%3 == 0) weight++;
    if(i%6 == 0) weight++;
    if(i%12 == 0) weight++;
    verticalLine(i, weight);
  }
  // strokeWeight(15);
  // stroke(0, 0, 0, 100);
  // line(25*9+1, 0, 25*9+1, 40)
}

var updateInfo = null;

function setUpdateInfoFunction(f){
  updateInfo = f;
}


function mouseMoved(){
  var hoveredTask = null;
  if(mouseY > 0 && mouseY < 300 && mouseX > 0 && mouseX < 600){
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i].start < mouseX && mouseX < tasks[i].end){
        hoveredTask = tasks[i];
      }
    }
    if(hoveredTask != null){
      updateInfo(hoveredTask, true);
    } else {
      updateInfo(null, true);
    }
  }
}

function mouseClicked(){
  var clickedTask = null;
  if(mouseY > 0 && mouseY < 300 && mouseX > 0 && mouseX < 600){
    for(var i = 0; i < tasks.length; i++){
      if(tasks[i].start < mouseX && mouseX < tasks[i].end){
        clickedTask = tasks[i];
      }
    }
    if(clickedTask != null){
      updateInfo(clickedTask, false);
    }
  }
}

var funcRequestTasks = null;

function setFuncRequestTasks(f){
  funcRequestTasks = f;
}

function changeDate(forward){
  if(forward){
    curDate.day++;
    if(curDate.day > monthDays[curDate.month - 1]){
      curDate.day %= monthDays[curDate.month - 1];
      curDate.month++;
      if(curDate.month > 12){
        curDate.month %= 12;
        curDate.year++;
      }
    }
  } else {
    curDate.day--;
    if(curDate.day < 1){
      curDate.day = monthDays[(curDate.month - 2 + 12)%12];
      curDate.month--;
      if(curDate.month < 1){
        curDate.month += 12;
        curDate.year--;
      }
    }
  }
  funcRequestTasks(curDate.day, curDate.month, curDate.year);
}
