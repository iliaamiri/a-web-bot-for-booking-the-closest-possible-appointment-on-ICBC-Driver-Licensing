import * as luxon from "luxon";

const acceptIfIs = {
  foundDate: null,

  SetFoundDate(dateObject) {
    this.foundDate = luxon.DateTime.fromJSDate(dateObject).toLocal();
    console.log(`\nFound Date set to: ${this.foundDate.toISO()}`);
    return this;
  },

  Before(dateInISO) {
    const date = this.getLuxonDateFromISO(dateInISO);
    console.log(`Checking if found date ${this.foundDate.toISO()} is before ${date.toISO()}`);
    const result = this.foundDate < date;
    console.log(`Result: ${result}`);
    return result;
  },

  Between(fromDateInISO, toDateInISO) {
    const fromDate = this.getLuxonDateFromISO(fromDateInISO);
    const toDate = this.getLuxonDateFromISO(toDateInISO);
    console.log(`Checking if found date ${this.foundDate.toISO()} is between ${fromDate.toISO()} and ${toDate.toISO()}`);
    const result = this.foundDate >= fromDate && this.foundDate <= toDate;
    console.log(`Result: ${result}`);
    return result;
  },

  After(dateInISO) {
    const date = this.getLuxonDateFromISO(dateInISO);
    console.log(`Checking if found date ${this.foundDate.toISO()} is after ${date.toISO()}`);
    const result = this.foundDate > date;
    console.log(`Result: ${result}`);
    return result;
  },

  On(dateInISO) {
    const date = this.getLuxonDateFromISO(dateInISO);
    console.log(`Checking if found date ${this.foundDate.toISO()} is on ${date.toISO()}`);
    const result = this.foundDate.hasSame(date, 'day');
    console.log(`Result: ${result}`);
    return result;
  },

  getLuxonDateFromISO(dateInISO) {
    const date = luxon.DateTime.fromISO(dateInISO).toLocal();
    //console.log(`Converted ISO date ${dateInISO} to Luxon DateTime: ${date.toISO()}`);
    return date;
  }
};

export default acceptIfIs;
