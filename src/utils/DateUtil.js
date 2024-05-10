/* eslint-disable no-dupe-keys */
const dayjs = require("dayjs");
const { toNumber, toString, isString } = require("lodash");
// export const MORNING = 'MORNING';
// export const AFTERNOON = 'AFTERNOON';
// export const EVENING = 'EVENING';

module.exports = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  EVENING: 'EVENING',

  getTimeOfDay() {
    const currentHour = new Date().getHours();
    const results = ["MORNING", "AFTERNOON", "EVENING"];
    const idx = currentHour >= 4 && currentHour < 12
      ? 0
      : currentHour >= 12 && currentHour <= 17
        ? 1
        : 2;

    return results[idx];
  },

  formatDateTime(date, format = 'DD/MM/YYYY HH:mm:ss') {
    return dayjs(date).format(format)
  },

  formatDate(date) {
    return dayjs(date).format('DD/MM/YYYY')
  },

  getNowDateTime() {
    let now = dayjs();
    return now.format('YYYY-MM-DD HH:mm:ss.SSS')
  },

  timestamp(date) {
    return dayjs(date).unix();
  },
  
  getPreviousDay(numOfDate = 1, format = 'YYYY-MM-DD') {
    return dayjs().subtract(toNumber(numOfDate), 'days').format(format);
  },
  
  getFirstDayOfMonth(format = 'YYYY-MM-DD') {
    return dayjs().startOf('month').format(format);
  },
  
  getFirstDayPrevMonth(format = 'YYYY-MM-DD') {
    return dayjs().subtract(1, 'month').startOf('month').format(format);
  },
  
  getLastDayPrevMonth(format = 'YYYY-MM-DD') {
    return dayjs().subtract(1, 'month').endOf('month').format(format);
  },

  checkDayOfMonth(format = 'YYYY-MM-DD') {
    return dayjs().diff(dayjs().startOf('month'), 'days');
  },

  parseTextToDate(text, chart = '-') {
    let textString = toString(text);
    let newString = textString.slice(0, 4) + chart + textString.slice(4, 6) + chart + textString.slice(6);
    return newString;
  },

  areDatesEqual(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  },

  compareDates(date1, date2) {
    var firstDate = new Date(date1);
    var secondDate = new Date(date2);

    if (firstDate <= secondDate) {
      return true;
    } else {
      return false;
    }
  },
  durationInMinutes(date1, date2, duration='m') {
    const startTime = dayjs(date1);
    const endTime = dayjs(date2);

    return endTime.diff(startTime, duration);
  }

}
