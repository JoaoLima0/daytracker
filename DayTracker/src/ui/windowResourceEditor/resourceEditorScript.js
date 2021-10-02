var selectedTask;
var selectedResource;
var userResources;
var selectedType;

function setSelectedTask(e, taskAsArray){
  console.log(taskAsArray);
  var task = new Task(...taskAsArray);
  console.log(task)
  selectedTask = task;
}

function setSelectedResource(resource){
  selectedResource = resource;
}


var setSelectorOptions, updateResourceParameters, openPresetResource = null;

function setupFunction(fName, f){
  if(fName === 'setSelectorOptions') setSelectorOptions = f;
  if(fName === 'updateResourceParameters') updateResourceParameters = f;
  if(fName === 'openPresetResource') openPresetResource = f;
}

function makeResources(compResources){
  var resourceArray = [];
  for(var i = 0; i < compResources.length; i++){
    var resource = ResourceFactory.createResourceFromObj(compResources[i]);
    resourceArray.push(resource);
  }
  return resourceArray;
}

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}
