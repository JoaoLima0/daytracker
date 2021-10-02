class Task{
  constructor(taskid, userid, title, timestart, timeend, isfinished, parseFormat = DateTime.DEFAULT_FORMAT){
    this.taskid = taskid;
    this.userid = userid;
    this.title = title;
    this.timestart = (timestart instanceof DateTime) ? timestart : new DateTime(timestart, parseFormat);
    this.timeend = (timeend instanceof DateTime) ? timeend : new DateTime(timeend, parseFormat);
    this.isfinished = isfinished;
  }

  compactAsArray(){
    var compTask = [
      this.taskid,
      this.userid,
      this.title,
      this.timestart.getDateAsString(),
      this.timeend.getDateAsString(),
      this.isfinished
    ];
    return compTask;
  }

  containsEntireDay(day){
    // console.log(day);
    var day = (day instanceof DateTime) ? day : new DateTime(day);
    return day.isBetween(this.timestart, this.timeend, 'day');
  }

  containsDay(day){
    // console.log(day);
    var day = (day instanceof DateTime) ? day : new DateTime(day);
    return day.isBetweenOrEqual(this.timestart, this.timeend, 'day');
  }

  isInWeek(week){
    var day = (week.sunday instanceof DateTime) ? week.sunday : new DateTime(week.sunday);
    var day2 = (week.sunday instanceof DateTime) ? week.sunday : new DateTime(week.sunday);
    day2.updateValues({ day: day2.day+7, seconds: day2.seconds-1 });
    day2.updateFromModularTransform();
    console.log("Week: "+day.getDateAsString()+" -> "+day2.getDateAsString());
    var result = false;
    result = result || this.timestart.isBetweenOrEqual(day, day2, 'day');
    result = result || this.timeend.isBetweenOrEqual(day, day2, 'day');
    result = result || day.isBetweenOrEqual(this.timestart, this.timeend);
    result = result || day2.isBetweenOrEqual(this.timestart, this.timeend)
    return result
  }

  static getDateTimeClass(){
    return DateTime;
  }
}
