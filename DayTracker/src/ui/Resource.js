/*

TYPES:
- Timer
- Notifier

*/

class ResourceFactory{
  static createTimer(resourceid, taskid, name, time = '00:00:00'){
    return new Timer(resourceid, taskid, name, time);
  }

  static createDescription(resourceid, taskid, name, msg){
    return new Description(resourceid, taskid, name, msg)
  }
  
  static createResourceFromObj(tObj){
    if(tObj.type === 'timer'){
      return new Timer(tObj.resid, tObj.taskid, tObj.name, tObj.vals)
    } else if(tObj.type === 'description'){
      return new Description(tObj.resid, tObj.taskid, tObj.name, tObj.vals)
    }
  }

}


class Resource {

  constructor(resourceid, taskid, name, type){
    this.resourceid = resourceid;
    this.taskid = taskid;
    this.name = name;
    this.type = type;
  }

  getAsObj(){
    return undefined;
  }

}

class Timer extends Resource{

  constructor(resourceid, taskid, name, time = '00:00:00'){
    super(resourceid, taskid, name, 'timer')
    this.time = time;
  }

  getAsObj(){
    return {
      resourceid: this.resourceid,
      taskid: this.taskid,
      name: this.name,
      type: this.type,
      vals: this.time
    }
  }

}

class Description extends Resource{

  constructor(resourceid, taskid, name, msg){
    super(resourceid, taskid, name, 'description')
    this.msg = msg;
  }

  getAsObj(){
    return {
      resourceid: this.resourceid,
      taskid: this.taskid,
      name: this.name,
      type: this.type,
      vals: this.msg
    }
  }

}
