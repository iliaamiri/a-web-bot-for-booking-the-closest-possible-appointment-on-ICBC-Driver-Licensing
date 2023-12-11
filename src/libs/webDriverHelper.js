import { Builder, By } from "selenium-webdriver";
import { EOL } from "os";

import notifier from "node-notifier";
import readlineSync from "readline-sync";

import puppeteer from "puppeteer";
import {
  lastName,
  driverLicenseNumber,
  keyWord,
  citySpelledOut,
  cityFullName,
  branchStreetName,
  intervalBetweenEachRefresh,
  totalAttemptsForFetchingVerificationCode,
  intervalBetweenEachFetchingVerificationCodeFromEmail,
  promptMeAndWaitForMyRestartCall,
} from "../config.js";

import { sleep, getDateFromText } from "../helpers.js";
import approvementLogic from "../approvementLogic.js";
import { getVerificationCode } from "./emailVerification.js";

/**
 * @class WebDriverHelper
 * @description This class is responsible for the whole process of finding an appointment.
 */
class WebDriverHelper {
  failedDueToSessionCounter = 0;

  browser = null;

  page = null;

  static attempt = 1;

  /**
   * @type {string|null}
   * @private
   */
  lastDateText = null;

  initialized = false;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to false if you need a GUI
    });
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1280, height: 720 });
    this.initialized = true;
  }

  async getButtonFoundLocation() {
    while (true) {
      try {
        if (!this.initialized) {
          await this.initialize();
        }

        console.log("Redirecting to the start-point...");

        await this.page.goto("https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver");

        const inputLastName = await this.page.$("#mat-input-0");
        const inputDriverLicenseNumber = await this.page.$("#mat-input-1");
        const inputKeyWord = await this.page.$("#mat-input-2");
        const buttonSignIn = await this.page.$x("//button[contains(text(),'Sign in')]");

        console.log("Signing-in...");

        await inputLastName.type(lastName);
        await inputDriverLicenseNumber.type(driverLicenseNumber);
        await inputKeyWord.type(keyWord);
        await this.page.evaluate(`document.getElementById("mat-checkbox-1-input").click()`);

        if (buttonSignIn.length > 0) {
          await buttonSignIn[0].click();
        }

        console.log("Waiting for the panel to load...");

        await sleep(5000);

        try {
          console.log("Looking for the Book Appointment button...");

          const [buttonBookAppointment] = await this.page.$x(
            "//span[contains(text(),'Book Appointment') or contains(text(),'New Appointment')]",
          );
          if (!buttonBookAppointment) {
            throw "Book Appointment Button not found";
          }

          console.log("Book Appointment button found! Clicking it...");
          await buttonBookAppointment.click();
        } catch (err) {
          console.log("Book Appointment button not found 😵‍💫");
          console.log("Looking for the Schedule Appointment button...");

          try {
            const [buttonRescheduleAppointment] = await this.page.$x(
              "//button[contains(text(),'Reschedule appointment')]",
            );

            console.log("Schedule Appointment button found! Clicking it...");
            await buttonRescheduleAppointment.click();

            await sleep(2000);

            const [buttonRescheduleAppointment_YesToConfirm] = await this.page.$x("//button[contains(text(),'Yes')]");

            await buttonRescheduleAppointment_YesToConfirm.click();

            await sleep(2000);
          } catch (e) {
            console.log("Schedule Appointment button NOT FOUND... Might be in searching area.");
          }
        }

        console.log("Entered the searching area.");
        console.log("Searching for the correct branch...");

        // Entered the map
        const inputLocationName = await this.page.$("#mat-input-3");

        let currentSpellIndex = 0;
        let inputLocationName_SuggestedLocationToConfirm;
        const tryFindingTheSuggestion = async () => {
          if (citySpelledOut[currentSpellIndex] === undefined) {
            throw "Could not find the suggestion city. The element cannot be found.";
          }

          if (citySpelledOut[currentSpellIndex]) {
            await inputLocationName.type(citySpelledOut[currentSpellIndex]);
          }

          await sleep(3500);

          try {
            [inputLocationName_SuggestedLocationToConfirm] = await this.page.$x(
              `//span[contains(text(),'${cityFullName}')]`,
            );
            console.log("inputLocationName_SuggestedLocationToConfirm", inputLocationName_SuggestedLocationToConfirm);
            if (!inputLocationName_SuggestedLocationToConfirm) {
              throw "Suggested location not found";
            }
          } catch (err) {
            currentSpellIndex += 1;
            await tryFindingTheSuggestion();
          }
        };
        await tryFindingTheSuggestion();

        await inputLocationName_SuggestedLocationToConfirm.click();

        await sleep(3000);

        const buttonSearch = await this.page.$(".mat-raised-button > span:nth-child(1)");

        await buttonSearch.click();

        await sleep(2000);

        const [buttonFoundLocation] = await this.page.$x(`//div[contains(text(),'${branchStreetName}')]`);
        if (!buttonFoundLocation) {
          throw "Branch not found";
        }

        console.log("Initiated successfully.");
        console.log(
          " ___                  ___  __       ___    __           __   ___  __          __  \n" +
            "|__  |\\ | |  |  |\\/| |__  |__)  /\\   |  | /  \\ |\\ |    |__) |__  / _` | |\\ | /__` \n" +
            "|___ | \\| \\__/  |  | |___ |  \\ /~~\\  |  | \\__/ | \\|    |__) |___ \\__> | | \\| .__/ \n" +
            "                                                                                  ",
        );

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
        isAppointmentFoundResult = await this.isAppointmentFound(buttonFoundLocation);

        if (isAppointmentFoundResult) {
          try {
            console.log("Try to pass the verification and finalize...");

            await this.finishTheVerificationProcessAndGetTheAppointment(isAppointmentFoundResult);

            break;
          } catch (err) {
            if (err.message === "Restarting the process") {
              notifier.notify("FAILING 5 TIMES IN A ROW!!!");
              console.log("Exiting the process...");
            } else {
              throw err;
            }
          }
        }
        await sleep(intervalBetweenEachRefresh);

        // reset the failing attempts.
        this.failedDueToSessionCounter = 0;
      } catch (err) {
        if (err.name !== undefined && err.name === "NoSuchElementError") {
          console.log(`${EOL}Restarting due to session expiration...`);
          if (this.failedDueToSessionCounter < 5) {
            buttonFoundLocation = await this.getButtonFoundLocation();
          } else {
            notifier.notify("FAILING 5 TIMES IN A ROW!!!");
            process.exit(0);
          }
        } else {
          console.log(`FATAL ERROR: ${err}`);
          notifier.notify("Fatal error !!!! 💀");
          process.exit(0);
        }
      }
    }
  }

  async finishTheVerificationProcessAndGetTheAppointment(isAppointmentFoundResult) {
    notifier.notify("DATE FOUND ✅");
    const [buttonScheduleHour] = await this.page.$x(
      "//div[@class='appointment-listings']//child::mat-button-toggle[1]",
    );

    await buttonScheduleHour.click();

    await sleep(2000);

    const [buttonReviewAppointment] = await this.page.$x("//*[contains(text(),'Review Appointment')]");

    await buttonReviewAppointment.click();

    await sleep(2000);

    const [buttonNext] = await this.page.$x("//span[contains(text(),'Next')]");

    await buttonNext.click();

    await sleep(2000);

    const [buttonSend] = await this.page.$x("//span[contains(text(),'Send')]");

    await buttonSend.click();

    await sleep(2000);

    const [verificationCodeInput] = await this.page.$x("//input[@formcontrolname='otpField']");

    await sleep(3000);

    let verificationCode;
    const totalAttempts = totalAttemptsForFetchingVerificationCode;
    for (let i = 1; i <= totalAttempts; i += 1) {
      try {
        console.log(`Fetching verification code from inbox (Attempt ${i}/${totalAttempts})...`);
        const resultOfAttempt = await getVerificationCode();

        if (resultOfAttempt !== "No Email") {
          verificationCode = resultOfAttempt;

          console.log(`✅ Verification code: ${verificationCode}`);

          break;
        }

        await sleep(intervalBetweenEachFetchingVerificationCodeFromEmail);
      } catch (er) {
        console.log(`FATAL ERROR: ${er}`);
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
        notifier.notify("FAILING 5 TIMES IN A ROW!!!");
        throw "Restarting the process";
      }
    }

    await verificationCodeInput.sendKeys(verificationCode);

    const [buttonSubmitCodeAndBookAppointment] = await this.page.$x(
      "//span[contains(text(),'Submit code and book appointment')]",
    );

    await buttonSubmitCodeAndBookAppointment.click();

    console.log(
      `Congrats! Your appointment is now booked on: ${isAppointmentFoundResult.getDate()}/${
        isAppointmentFoundResult.getMonth() + 1
      }/${isAppointmentFoundResult.getFullYear()}  ... ENJOY!`,
    );
  }

  async promptMeAndWaitForMyRestartCall() {
    const decisions = ["Restart and continue searching again.", "Enter the verification code manually."];
    while (true) {
      const chosenOption = readlineSync.keyInSelect(
        decisions,
        "Please make your decision (type the option's number to select):",
        { cancel: "Exit the program." },
      );

      console.log(`You chose: ${decisions[chosenOption] || "Exit the program."}`);

      if (chosenOption === 0) {
        return 0;
      }
      if (chosenOption === 1) {
        return readlineSync.question("Please enter the verification code: ");
      }
      if (chosenOption === -1) {
        console.log("Exiting the program...");
        process.exit(0);
      } else {
        console.log("Invalid option. Please try again.");
      }
    }
  }

  async isAppointmentFound(buttonFoundLocation) {
    await buttonFoundLocation.click();

    await sleep(2000);

    const dateTitleElement = await this.page.$(".date-title");
    let dateText = null;
    if (!dateTitleElement) {
      dateText = await this.page.$eval(".date-title", (e) => e.innerText);
    }

    if (this.lastDateText === dateText) {
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`Attempt #${WebDriverHelper.attempt++}: ${dateText}`);
    } else {
      process.stdout.write(`${EOL}Attempt #${WebDriverHelper.attempt++}: ${dateText}`);
    }
    this.lastDateText = dateText;

    const date = getDateFromText(dateText);

    const isApproved = approvementLogic(date, dateText);
    if (isApproved) {
      console.log(`Appointment Found!!! ----- ${dateText} -----`);
      return date;
    }

    return false;
  }
}

export default WebDriverHelper;
