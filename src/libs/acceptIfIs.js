const luxon = require('luxon');

const acceptIfIs = {
  _foundDate: null,

  SetFoundDate(dateObject) {
    this._foundDate = luxon.DateTime.fromJSDate(dateObject);
    return this;
  },

  Before(dateInISO) {
    let date = luxon.DateTime.fromISO(dateInISO);

    return (date.startOf("day") > this._foundDate);
  },
  Between(fromDateInISO, toDateInISO) {
    let fromDate = luxon.DateTime.fromISO(fromDateInISO);
    let toDate = luxon.DateTime.fromISO(toDateInISO);

    return (this._foundDate.diff(fromDate, ['months', 'days', 'hours']).toObject().days >= 0 && this._foundDate.diff(toDate, ['months', 'days']).toObject().days <= 0);
  },
  After(dateInISO) {
    let date = luxon.DateTime.fromISO(dateInISO);

    return (this._foundDate.diff(date, ['months', 'days', 'hours']).toObject().days > 0);
  },
  On(dateInISO) {
    let date = luxon.DateTime.fromISO(dateInISO);
    console.log(this._foundDate.diff(date, ['months', 'days', 'hours']).toObject())
    return (this._foundDate.diff(date, ['months', 'days', 'hours']).toObject().days === 0);
  }
};

module.exports = acceptIfIs;