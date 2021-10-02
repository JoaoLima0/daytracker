class DateTime{
  static DEFAULT_FORMAT = 0; //"DD/MM/YYYY HH/mi/ss"
  static AMERICAN_FORMAT = 1; //"MM/DD/YYYY HH/mi/ss"

  static MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


  constructor(dateString, parseFormat = this.DEFAULT_FORMAT, ...args){
    if(dateString === '') {
      const [year, month, day, hours, minutes, seconds] = args;
      this.setValuesFromObject({year, month, day, hours, minutes, seconds, parseFormat});
    } else {
      //console.log(dateString);
      const expanded = this.expandFromString(dateString, parseFormat);
      this.setValuesFromObject(expanded);
    }
  }

  expandFromString(dateString, parseFormat = 0){
    //console.log(dateString);
    var [date, time] = dateString.split(" ");
    var day, month, year;
    if(parseFormat == 0) [day, month, year] = date.split("/");
    else if(parseFormat == 1) [month, day, year] = date.split("/");
    else throw new TypeError("Invalid parseFormat: "+parseFormat);
    var [hours, minutes, seconds] = time?.split(":") ?? "00:00:00".split(":");
    return {year, month, day, hours, minutes, seconds, parseFormat};
  }

  setValuesFromObject(dateObj){
    this.year = parseInt(dateObj.year) ?? undefined;
    this.month = parseInt(dateObj.month) ?? undefined;
    this.day = parseInt(dateObj.day) ?? undefined;
    this.hours = parseInt(dateObj.hours) ?? undefined;
    this.minutes = parseInt(dateObj.minutes) ?? undefined;
    this.seconds = parseInt(dateObj.seconds) ?? undefined;
    this.parseFormat = parseInt(dateObj.parseFormat) ?? this.DEFAULT_FORMAT;
  }

  getAsString(attrName){
    var valueStr = "000"+this.getAsObj()[attrName];
    if(attrName == 'year') valueStr = valueStr.slice(-4);
    else valueStr = valueStr.slice(-2);
    return valueStr;
  }

  getDateAsString(){
    var str = this.getAsString('day')+"/"+this.getAsString('month');
    if(this.parseFormat == 1) str = this.getAsString('month')+"/"+this.getAsString('day')
    str += "/"+this.getAsString('year') + " ";
    str += this.getAsString('hours')+":"+this.getAsString('minutes')+":"+this.getAsString('seconds');
    return str;
  }

  getAsObj(){
    return {
      year: this.year,
      month: this.month,
      day: this.day,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      parseFormat: this.parseFormat
    }
  }

  isEqual(dt2, depth = ''){
    var result = true;
    result = result && this.year === dt2.year;
    if(depth === 'year') return result;
    result = result && this.month === dt2.month;
    if(depth === 'month') return result;
    result = result && this.day === dt2.day;
    if(depth === 'day') return result;
    result = result && this.hours === dt2.hours;
    if(depth === 'hours') return result;
    result = result && this.minutes === dt2.minutes;
    if(depth === 'minutes') return result;
    result = result && this.seconds === dt2.seconds;
    return result;
  }

  isEqualFromStr(dt2str, depth = ''){
    var dt2 = new DateTime(dt2str);
    return this.isEqual(dt2, depth);
  }

  isAfter(dt2, depth = ''){
    var result = false;
    result = result || this.year > dt2.year;
    if(depth === 'year' || this.year < dt2.year) return result;
    // console.log("After year" + result);
    result = result || this.month > dt2.month;
    if(depth === 'month' || this.month < dt2.month) return result;
    // console.log("After month" + result);
    result = result || this.day > dt2.day;
    if(depth === 'day' || this.day < dt2.day) return result;
    // console.log("After day" + result);
    result = result || this.hours > dt2.hours;
    if(depth === 'hours' || this.hours < dt2.hours) return result;
    // console.log("After hours" + result);
    result = result || this.minutes > dt2.minutes;
    if(depth === 'minutes' || this.minutes < dt2.minutes) return result;
    // console.log("After minutes" + result);
    result = result || this.seconds > dt2.seconds;
    return result;
  }

  isBetween(dt2, dt3, depth = ''){
    return this.isAfter(dt2, depth) && !(this.isAfter(dt3, depth) || this.isEqual(dt3, depth));
  }

  isBetweenOrEqual(dt2, dt3, depth = ''){
    return (this.isAfter(dt2, depth) || this.isEqual(dt2, depth)) && !this.isAfter(dt3, depth);
  }

  //static: run function as dt1
  static isEqual(dt1, dt2, depth = ''){
    return dt1.isEqual(dt2, depth);
  }

  static isAfter(dt1, dt2, depth = ''){
    return dt1.isAfter(dt2, depth);
  }

  static isBetween(dt1, dt2, dt3, depth = ''){
    return dt1.isBetween(dt2, dt3, depth);
  }

  static isBetweenOrEqual(dt1, dt2, dt3, depth = ''){
    return dt1.isBetweenOrEqual(dt2, dt3, depth);
  }

  updateValues(values){
    this.year = values.year ?? this.year;
    this.month = values.month ?? this.month;
    this.day = values.day ?? this.day;
    this.hours = values.hours ?? this.hours;
    this.minutes = values.minutes ?? this.minutes;
    this.seconds = values.seconds ?? this.seconds;
  }

  updateFromModularTransform(){
    this.setValuesFromObject(DateTime.modularTransformValid(this.getAsObj()));
  }

  yesterday(){
    var dtYesterday = new DateTime(this.getDateAsString(), this.parseFormat);
    dtYesterday.updateValues({ day: dtYesterday.day-1 });
    dtYesterday.updateFromModularTransform();
    return dtYesterday;
  }

  tomorrow(){
    var dtTomorrow = new DateTime(this.getDateAsString(), this.parseFormat);
    dtTomorrow.updateValues({ day: dtTomorrow.day+1 });
    dtTomorrow.updateFromModularTransform();
    return dtTomorrow;
  }



  static modularTransformValid(dtR){
    dtR = this.transformAttr(dtR, 'seconds', 'minutes', 60);
    dtR = this.transformAttr(dtR, 'minutes', 'hours', 60);
    dtR = this.transformAttr(dtR, 'hours', 'day', 24);
    dtR = this.transformAttr(dtR, 'day', 'month', -1);
    dtR = this.transformAttr(dtR, 'month', 'year', 12);
    return dtR;
  }

  static transformAttr(dtObject, attr, attrConvertTo, attrConvertValue){
    //Setup month lengths and leap years
    dtObject.day--;
    dtObject.month--;
    var prevMonthLength;
    var ml = DateTime.MONTH_LENGTHS;
    if(dtObject.year%4 == 0 && (dtObject.year%100 != 0 || dtObject.year%400 == 0)) {
      ml[1] = 29;
    } else ml[1] = 28;
    if(attrConvertValue == -1){
      attrConvertValue = ml[dtObject.month]; //month is 1-12, array index is 0-11
      prevMonthLength = ml[(dtObject.month+11)%12];; //month - 2 can be negative, so x = (x+12)%12
    }
    if(dtObject[attr] < 0) {
      dtObject[attr] += prevMonthLength ?? attrConvertValue;
      dtObject[attr] %= prevMonthLength ?? attrConvertValue;
      dtObject[attrConvertTo]--;
    }
    else if(dtObject[attr] >= attrConvertValue){
      dtObject[attr] %= attrConvertValue;
      dtObject[attrConvertTo]++;
    }
    dtObject.day++;
    dtObject.month++;
    return dtObject;
  }

}

module.exports = DateTime;
