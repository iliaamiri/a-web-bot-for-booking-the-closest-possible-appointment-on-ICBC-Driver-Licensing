const {Builder, By} = require("selenium-webdriver");
const {EOL} = require("os");

const readlineSync = require('readline-sync');

const {
  seleniumForBrowser, seleniumServer, seleniumServerPort,
  lastName,
  driverLicenseNumber,
  keyWord,
  citySpelledOut,
  cityFullName,
  branchStreetName, intervalBetweenEachRefresh,
  totalAttemptsForFetchingVerificationCode,
  intervalBetweenEachFetchingVerificationCodeFromEmail,
  promptMeAndWaitForMyRestartCall
} = require("../config");

const {sleep, getDateFromText} = require("../helpers");
const approvementLogic = require("../approvementLogic");
const {getVerificationCode} = require("../libs/emailVerification");

class DriverLibs {
  _driver = null;

  async getDriver() {
    return this._driver;
  }

  static attempt = 1;

  _lastDateText = null;

  async getLastDateText() {
    return this._lastDateText;
  }

  constructor() {
    this._driver = new Builder()
      .forBrowser(seleniumForBrowser)
      .usingServer(`http://${seleniumServer}:${seleniumServerPort}/wd/hub`)
      .build();
  }

  async getButtonFoundLocation() {
    while (true) {
      try {
        console.log("Redirecting to the start-point...");

        await this._driver.get('https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver');

        let inputLastName = await this._driver.findElement(By.id('mat-input-0'));
        let inputDriverLicenseNumber = await this._driver.findElement(By.id('mat-input-1'));
        let inputKeyWord = await this._driver.findElement(By.id('mat-input-2'));
        let buttonSignIn = await this._driver.findElement(By.xpath("//span[contains(text(),'Sign in')]"));

        console.log("Signing-in...");

        await inputLastName.sendKeys(lastName);
        await inputDriverLicenseNumber.sendKeys(driverLicenseNumber);
        await inputKeyWord.sendKeys(keyWord);
        await this._driver.executeScript(`document.getElementById('mat-checkbox-1-input').click();`);

        await buttonSignIn.click();

        console.log("Waiting for the panel to load...");

        await sleep(5000);

        try {
          console.log("Looking for the Book Appointment button...");

          // Not sure about this xpath, but I hope it works :) // TODO: make sure that the button is called "Book Appointment" or something like that
          let buttonBookAppointment = await this._driver.findElement(By.xpath("//span[contains(text(),'Book Appointment') or contains(text(),'New Appointment')]"));

          console.log("Book Appointment button found! Clicking it...");
          await buttonBookAppointment.click();
        } catch (err) {
          console.log("Book Appointment button not found 😵‍💫");
          console.log("Looking for the Schedule Appointment button...");

          try {
            let buttonRescheduleAppointment = await this._driver.findElement(By.xpath("//span[contains(text(),'Reschedule appointment')]"));

            console.log("Schedule Appointment button found! Clicking it...");
            await buttonRescheduleAppointment.click();
  
            let buttonRescheduleAppointment_YesToConfirm = await this._driver.findElement(By.xpath("//span[contains(text(),'Yes')]"));
  
            await buttonRescheduleAppointment_YesToConfirm.click();
          } catch (err) {
            console.log("Schedule Appointment button NOT FOUND... Might be in searching area.");
          }
        }

        console.log("Entered the searching area.");
        console.log("Searching for the correct branch...");

        // Entered the map
        let inputLocationName = await this._driver.findElement(By.id('mat-input-3'));

        let currentSpellIndex = 0;
        let inputLocationName_SuggestedLocationToConfirm;
        const tryFindingTheSuggestion = async () => {
          if (citySpelledOut[currentSpellIndex] === undefined) {
            throw "Could not find the suggestion city. The element cannot be found.";
          }

          if (citySpelledOut[currentSpellIndex]) {
            await inputLocationName.sendKeys(citySpelledOut[currentSpellIndex]);
          }

          await sleep(3500);

          try {
            inputLocationName_SuggestedLocationToConfirm = await this._driver.findElement(By.xpath(`//span[contains(text(),'${cityFullName}')]`));
          } catch (err) {
            currentSpellIndex++;
            await tryFindingTheSuggestion();
          }
        }
        await tryFindingTheSuggestion();

        inputLocationName_SuggestedLocationToConfirm.click();

        await sleep(3000);

        let buttonSearch = await this._driver.findElement(By.className("mat-raised-button mat-button-base search-button mat-accent"));

        await buttonSearch.click();

        await sleep(2000);

        let buttonFoundLocation = await this._driver.findElement(By.xpath(`//div[contains(text(),'${branchStreetName}')]`));

        console.log("Initiated successfully.");
        console.log(" ___                  ___  __       ___    __           __   ___  __          __  \n" +
          "|__  |\\ | |  |  |\\/| |__  |__)  /\\   |  | /  \\ |\\ |    |__) |__  / _` | |\\ | /__` \n" +
          "|___ | \\| \\__/  |  | |___ |  \\ /~~\\  |  | \\__/ | \\|    |__) |___ \\__> | | \\| .__/ \n" +
          "                                                                                  ");

        return buttonFoundLocation;
      } catch (e) {
        console.log(`ERROR: ${e}`);
        console.log(`Retrying...`);
      }
    }
  }

  async findAppointment() {
    let buttonFoundLocation = await this.getButtonFoundLocation();


    let isAppointmentFoundResult;

    while (true) {
      try {
        isAppointmentFoundResult = await this.isAppointmentFound(buttonFoundLocation)

        if (isAppointmentFoundResult) {
          try {
            console.log("Try to pass the verification and finalize...");

            await this.finishTheVerificationProcessAndGetTheAppointment(isAppointmentFoundResult);

            break;
          } catch (err) {
            if (err.message === "Restarting the process") {
              console.log("Restarting the process...");
            } else {
              throw err;
            }
          }
        }
        await sleep(intervalBetweenEachRefresh);


      } catch (err) {
        if (err['name'] !== undefined && err['name'] === "NoSuchElementError") {
          console.log(`${EOL}Restarting due to session expiration...`);
          buttonFoundLocation = await this.getButtonFoundLocation();
        } else {
          console.log(`FATAL ERROR: ${err}`);
        }
      }
    }
  }

  async finishTheVerificationProcessAndGetTheAppointment(isAppointmentFoundResult) {
    let buttonScheduleHour = await this._driver.findElement(By.xpath("//div[@class='appointment-listings']//child::mat-button-toggle[1]"));

    await buttonScheduleHour.click();

    await sleep(2000);

    let buttonReviewAppointment = await this._driver.findElement(By.xpath("//*[contains(text(),'Review Appointment')]"));

    await buttonReviewAppointment.click();

    await sleep(2000);

    let buttonNext = await this._driver.findElement(By.xpath("//span[contains(text(),'Next')]"));

    await buttonNext.click();

    await sleep(2000);

    let buttonSend = await this._driver.findElement(By.xpath("//span[contains(text(),'Send')]"));

    await buttonSend.click();

    await sleep(2000);

    let verificationCodeInput = await this._driver.findElement(By.xpath("//input[@formcontrolname='otpField']"));

    await sleep(3000)

    let verificationCode;
    let totalAttempts = totalAttemptsForFetchingVerificationCode;
    for (let i = 1; i <= totalAttempts; i++) {
      try {
        console.log(`Fetching verification code from inbox (Attempt ${i}/${totalAttempts})...`);
        let resultOfAttempt = await getVerificationCode();

        if (resultOfAttempt !== "No Email") {
          verificationCode = resultOfAttempt;

          console.log(`✅ Verification code: ${verificationCode}`);

          break;
        }

        await sleep(intervalBetweenEachFetchingVerificationCodeFromEmail);
      } catch (er) {
        console.log("FATAL ERROR: " + er);
      }
    }

    if (verificationCode === undefined) {
      console.log("⚠️ Failed to fetch the verification code!! ... Making decision...");

      if (promptMeAndWaitForMyRestartCall) {
        const verificationCodeOrZero = await this.promptMeAndWaitForMyRestartCall();

        if (verificationCodeOrZero === 0) {
          throw "Restarting the process";
        } else {
          verificationCode = verificationCodeOrZero;
        }
      } else {
        throw "Restarting the process";
      }
    }

    await verificationCodeInput.sendKeys(verificationCode);

    let buttonSubmitCodeAndBookAppointment = await this._driver.findElement(By.xpath("//span[contains(text(),'Submit code and book appointment')]"));

    await buttonSubmitCodeAndBookAppointment.click();

    console.log(`Congrats! Your appointment is now booked on: ${isAppointmentFoundResult.getDate()}/${isAppointmentFoundResult.getMonth() + 1}/${isAppointmentFoundResult.getFullYear()}  ... ENJOY!`);
  }

  async promptMeAndWaitForMyRestartCall() {
    const decisions = [
      "Restart and continue searching again.",
      "Enter the verification code manually."
    ];
    while (true) {
      const chosenOption = readlineSync.keyInSelect(decisions, "Please make your decision (type the option's number to select):", { cancel: "Exit the program." });

      console.log("You chose: " + (decisions[chosenOption] || "Exit the program."));

      if (chosenOption === 0) {
        return 0;
      } else if (chosenOption === 1) {
        return readlineSync.question("Please enter the verification code: ");
      } else if (chosenOption === -1) {
        console.log("Exiting the program...");
        process.exit(0);
      } else {
        console.log("Invalid option. Please try again.");
      }
    }
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
      console.log(`Appointment Found!!! ----- ${dateText} -----`);
      return date;
    }

    return false;
  }
}

module.exports = DriverLibs;