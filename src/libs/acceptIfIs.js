const luxon = require('luxon');

const acceptIfIs = {
  _foundDate: null,

  SetFoundDate(dateObject) {
    this._foundDate = luxon.DateTime.fromJSDate(dateObject);
    return this;
  },

  Before(dateInISO) {
    let date = this._getLuxonDateFromISO(dateInISO);

    return (date.startOf("day") > this._foundDate);
  },
  Between(fromDateInISO, toDateInISO) {
    let fromDate = this._getLuxonDateFromISO(fromDateInISO);
    let toDate = this._getLuxonDateFromISO(toDateInISO);

    return (this._foundDate.diff(fromDate, ['months', 'days', 'hours']).toObject().days >= 0 && this._foundDate.diff(toDate, ['months', 'days']).toObject().days <= 0);
  },
  After(dateInISO) {
    let date = this._getLuxonDateFromISO(dateInISO);

    return (this._foundDate.diff(date, ['months', 'days', 'hours']).toObject().days > 0);
  },
  On(dateInISO) {
    let date = this._getLuxonDateFromISO(dateInISO);
    console.log(this._foundDate.diff(date, ['months', 'days', 'hours']).toObject())
    return (this._foundDate.diff(date, ['months', 'days', 'hours']).toObject().days === 0);
  },

  _getLuxonDateFromISO(dateInISO) {
    return luxon.DateTime.fromISO(this._addTheTZ(dateInISO));
  },
  _addTheTZ(dateInISO) {
    return dateInISO + "T00:00:00.000Z";
  }
};

module.exports = acceptIfIs;