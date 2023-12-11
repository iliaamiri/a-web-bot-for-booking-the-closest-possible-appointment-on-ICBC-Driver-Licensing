import * as luxon from "luxon";

const acceptIfIs = {
  foundDate: null,

  SetFoundDate(dateObject) {
    this.foundDate = luxon.DateTime.fromJSDate(dateObject);
    return this;
  },

  Before(dateInISO) {
    const date = this.getLuxonDateFromISO(dateInISO);

    return date.startOf("day") > this.foundDate;
  },
  Between(fromDateInISO, toDateInISO) {
    const fromDate = this.getLuxonDateFromISO(fromDateInISO);
    const toDate = this.getLuxonDateFromISO(toDateInISO);

    return (
      this.foundDate.diff(fromDate, ["months", "days", "hours"]).toObject().days >= 0 &&
      this.foundDate.diff(toDate, ["months", "days"]).toObject().days <= 0
    );
  },
  After(dateInISO) {
    const date = this.getLuxonDateFromISO(dateInISO);

    return this.foundDate.diff(date, ["months", "days", "hours"]).toObject().days > 0;
  },
  On(dateInISO) {
    const date = this.getLuxonDateFromISO(dateInISO);
    console.log(this.foundDate.diff(date, ["months", "days", "hours"]).toObject());
    return this.foundDate.diff(date, ["months", "days", "hours"]).toObject().days === 0;
  },

  getLuxonDateFromISO(dateInISO) {
    return luxon.DateTime.fromISO(this.addTheTZ(dateInISO));
  },
  addTheTZ(dateInISO) {
    return `${dateInISO}T00:00:00.000Z`;
  },
};
export default acceptIfIs;
