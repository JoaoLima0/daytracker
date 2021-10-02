var selectedTask = null;
var userTasks = null;

function setSelectedTask(selTask){
  selectedTask = selTask;
}

function setUserTasks(uTasks){
  userTasks = uTasks
}

var tttask = new Task(20, 20, "Title", "25/05/2021 05:05:05", "25/05/2021 07:05:05", false);
//console.log(tttask.compactAsArray());

var setSelectorOptions, updateTaskParameters, openPresetTask = null;

function setupFunction(fName, f){
  if(fName === 'setSelectorOptions') setSelectorOptions = f;
  if(fName === 'updateTaskParameters') updateTaskParameters = f;
  if(fName === 'openPresetTask') openPresetTask = f;
}

function makeTasks(compTasks){
  var taskArray = [];
  for(var i = 0; i < compTasks.length; i++){
    var task = new Task(...compTasks[i]);
    taskArray.push(task);
  }
  return taskArray;
}

function getSelectedTaskAsArray(){
  return selectedTask.compactAsArray()
}

function makeTask(compTask){
  var task = new Task(...compTask);
  return task;
}
