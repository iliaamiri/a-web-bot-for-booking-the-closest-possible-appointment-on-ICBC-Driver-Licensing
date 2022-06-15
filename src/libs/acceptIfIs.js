const luxon = require('luxon');

const acceptIfIs = {
  _foundDate: null,
  SetFoundDate(dateObject) {
    this._foundDate = dateObject;
    return this;
  },

  Before(dateInISO) {
    let date = luxon.DateTime.fromISO(dateInISO);

    return (date.startOf("day") < this._foundDate.startOf("day"));
  },
  Between(fromDateInISO, toDateInISO) {
    let fromDate = luxon.DateTime.fromISO(fromDateInISO);
    let toDate = luxon.DateTime.fromISO(toDateInISO);

    return (fromDate.startOf("day") <= this._foundDate.startOf("day") && this._foundDate.startOf("day") <= toDate.startOf("day"));
  },
  After(dateInISO) {
    let date = luxon.DateTime.fromISO(dateInISO);

    return (this._foundDate.startOf("day") < date.startOf("day"));
  },

  On(dateInISO) {
    let date = luxon.DateTime.fromISO(dateInISO);
    return (date.startOf("day") === this._foundDate.startOf("day"));
  }
};

module.exports = acceptIfIs;