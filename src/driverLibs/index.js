const {Builder, By} = require("selenium-webdriver");
const {EOL} = require("os");

const {seleniumForBrowser, seleniumServer, seleniumServerPort} = require("../config");
const {sleep, getDateFromText} = require("../helpers");
const approvementLogic = require("../approvementLogic");

class DriverLibs {
  _driver = null;
  async getDriver() { return this._driver; }

  static attempt = 1;

  _lastDateText = null;
  async getLastDateText() { return this._lastDateText; }

  constructor() {
    this._driver = new Builder()
      .forBrowser(seleniumForBrowser)
      .usingServer(`http://${seleniumServer}:${seleniumServerPort}/wd/hub`)
  }

  async isAppointmentFound(buttonFoundLocation) {
    await buttonFoundLocation.click()

    await sleep(2000)

    let divFoundSchedules = await this._driver.findElement(By.className("date-title"))

    let dateText = await divFoundSchedules.getText();

    if (this._lastDateText === dateText) {
      process.stdout.write("\r\x1b[K")
      process.stdout.write(`Attempt #${DriverLibs.attempt++}: ${dateText}`)
    } else {
      process.stdout.write(`${EOL}Attempt #${DriverLibs.attempt++}: ${dateText}`)
    }
    this._lastDateText = dateText;

    let date = getDateFromText(dateText);

    const isApproved = approvementLogic(date, dateText);
    if (isApproved) {
      console.log(`Successful!!! ----- ${dateText} -----`);
      return date;
    }

    return false;
  }
}

module.exports = DriverLibs;