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
  branchStreetNames,
  intervalBetweenEachRefresh,
  totalAttemptsForFetchingVerificationCode,
  intervalBetweenEachFetchingVerificationCodeFromEmail,
  promptMeAndWaitForMyRestartCall,
} from "../config.js";
import { sleep, getDateFromText } from "../helpers.js";
import approvementLogic from "../approvementLogic.js";
import { getVerificationCode } from "./emailVerification.js";

// Helper function to log messages with timestamps
const logWithTimestamp = (message) => {
  const timestamp = new Date().toLocaleString();
  console.log(`[${timestamp}] ${message}`);
};

class WebDriverHelper {
  failedDueToSessionCounter = 0;
  browser = null;
  page = null;
  static attempt = 1;
  lastDateText = null;
  initialized = false;

  async initialize() {
    if (this.browser) {
      await this.browser.close();
    }

    this.browser = await puppeteer.launch({
      headless: false,
    });
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1280, height: 720 });
    this.initialized = true;
  }

  async closeSurveyPopup() {
    try {
      const noThanksButton = await this.page.$x("//button[contains(text(), 'No thanks')]");
      if (noThanksButton.length > 0) {
        logWithTimestamp("Survey popup detected. Closing...");
        await noThanksButton[0].click();
      }
    } catch (error) {
      logWithTimestamp("Error while trying to close survey popup:", error);
    }
  }

  async checkForSoftBan() {
    try {
      const errorMessageElement = await this.page.$x("//span[contains(text(), 'Hmm, looks like something went wrong on our end. Please try again later.')]");
      if (errorMessageElement.length > 0) {
        logWithTimestamp("Soft ban detected. Waiting for 1 hour...");
        await sleep(60 * 60 * 1000);
      }
    } catch (error) {
      logWithTimestamp("Error while checking for soft ban message:", error);
    }
  }

  async getButtonFoundLocation(branchStreetName) {
    while (true) {
      try {
        if (!this.initialized) {
          await this.initialize();
        }

        await this.closeSurveyPopup();

        logWithTimestamp("Redirecting to the start-point...");

        await this.page.goto("https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver");

        const inputLastName = await this.page.$("#mat-input-0");
        const inputDriverLicenseNumber = await this.page.$("#mat-input-1");
        const inputKeyWord = await this.page.$("#mat-input-2");
        const buttonSignIn = await this.page.$x("//button[contains(text(),'Sign in')]");

        logWithTimestamp("Signing-in...");

        if (inputLastName && inputDriverLicenseNumber && inputKeyWord) {
          await inputLastName.type(lastName);
          await inputDriverLicenseNumber.type(driverLicenseNumber);
          await inputKeyWord.type(keyWord);
          await this.page.evaluate(`document.getElementById("mat-checkbox-1-input").click()`);
        } else {
          throw new Error("Sign-in input fields not found.");
        }

        if (buttonSignIn.length > 0) {
          await buttonSignIn[0].click();
        }

        logWithTimestamp("Waiting for the panel to load...");

        await sleep(5000);

        try {
          logWithTimestamp("Looking for the Book Appointment button...");

          const [buttonBookAppointment] = await this.page.$x(
            "//span[contains(text(),'Book Appointment') or contains(text(),'New Appointment')]"
          );
          if (!buttonBookAppointment) {
            throw new Error("Book Appointment Button not found");
          }

          logWithTimestamp("Book Appointment button found! Clicking it...");
          await buttonBookAppointment.click();
        } catch (err) {
          logWithTimestamp("Book Appointment button not found 😵‍💫");
          logWithTimestamp("Looking for the Schedule Appointment button...");

          try {
            const [buttonRescheduleAppointment] = await this.page.$x(
              "//button[contains(text(),'Reschedule appointment')]"
            );

            if (buttonRescheduleAppointment) {
              logWithTimestamp("Schedule Appointment button found! Clicking it...");
              await buttonRescheduleAppointment.click();

              await sleep(2000);

              const [buttonRescheduleAppointment_YesToConfirm] = await this.page.$x("//button[contains(text(),'Yes')]");

              if (buttonRescheduleAppointment_YesToConfirm) {
                await buttonRescheduleAppointment_YesToConfirm.click();

                await sleep(2000);
              } else {
                logWithTimestamp("Confirmation button not found.");
              }
            } else {
              logWithTimestamp("Schedule Appointment button NOT FOUND... Might be in searching area.");
            }
          } catch (e) {
            logWithTimestamp("Schedule Appointment button NOT FOUND... Might be in searching area.");
          }
        }

        logWithTimestamp("Entered the searching area.");
        logWithTimestamp("Searching for the correct branch...");

        const inputLocationName = await this.page.$("#mat-input-3");

        if (!inputLocationName) {
          throw new Error("Location name input field not found.");
        }

        let currentSpellIndex = 0;
        let inputLocationName_SuggestedLocationToConfirm;
        const tryFindingTheSuggestion = async () => {
          if (citySpelledOut[currentSpellIndex] === undefined) {
            throw new Error("Could not find the suggestion city. The element cannot be found.");
          }

          if (citySpelledOut[currentSpellIndex]) {
            await inputLocationName.type(citySpelledOut[currentSpellIndex]);
          }

          await sleep(3500);

          try {
            [inputLocationName_SuggestedLocationToConfirm] = await this.page.$x(
              `//span[contains(text(),'${cityFullName}')]`
            );
            if (!inputLocationName_SuggestedLocationToConfirm) {
              throw new Error("Suggested location not found");
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

        if (buttonSearch) {
          await buttonSearch.click();
        } else {
          throw new Error("Search button not found.");
        }

        await sleep(2000);

        const [buttonFoundLocation] = await this.page.$x(`//div[contains(text(),'${branchStreetName}')]`);
        if (!buttonFoundLocation) {
          throw new Error("Branch not found");
        }

        logWithTimestamp("Initiated successfully.");
        console.log(
          " ___                  ___  __       ___    __           __   ___  __          __  \n" +
          "|__  |\\ | |  |  |\\/| |__  |__)  /\\   |  | /  \\ |\\ |    |__) |__  / _` | |\\ | /__` \n" +
          "|___ | \\| \\__/  |  | |___ |  \\ /~~\\  |  | \\__/ | \\|    |__) |___ \\__> | | \\| .__/ \n" +
          "                                                                                  "
        );

        return buttonFoundLocation;
      } catch (e) {
        logWithTimestamp(`ERROR: ${e}`);
        logWithTimestamp(`Retrying...`);
      }
    }
  }

  async findAppointment() {
    while (true) {
      let foundAppointment = false;

      for (const branchStreetName of branchStreetNames) {
        let buttonFoundLocation;

        while (true) {
          try {
            buttonFoundLocation = await this.getButtonFoundLocation(branchStreetName);
            break;
          } catch (err) {
            logWithTimestamp(`Initialization error: ${err}`);
            this.initialized = false;
            await this.initialize();
          }
        }

        let isAppointmentFoundResult;

        while (true) {
          try {
            await this.closeSurveyPopup();
            try {
              isAppointmentFoundResult = await this.isAppointmentFound(buttonFoundLocation);
            } catch (err) {
              logWithTimestamp(`Error during isAppointmentFound: ${err}`);
              this.initialized = false;
              await this.initialize();
              buttonFoundLocation = await this.getButtonFoundLocation(branchStreetName);
              continue;
            }

            if (isAppointmentFoundResult) {
              try {
                logWithTimestamp("Try to pass the verification and finalize...");
                await this.finishTheVerificationProcessAndGetTheAppointment(isAppointmentFoundResult);
                foundAppointment = true;
                break; // Exit the branch loop after successful appointment
              } catch (err) {
                if (err.message === "Restarting the process") {
                  notifier.notify("FAILING 5 TIMES IN A ROW!!!");
                  logWithTimestamp("Exiting the process...");
                  return; // Exit the function if too many failures
                } else {
                  throw err;
                }
              }
            }
            await sleep(intervalBetweenEachRefresh);
            this.failedDueToSessionCounter = 0;

            await this.closeSurveyPopup();

            WebDriverHelper.attempt++;
          } catch (err) {
            logWithTimestamp(`Error during appointment search: ${err}`);
            this.initialized = false;
            await this.initialize();
            buttonFoundLocation = await this.getButtonFoundLocation(branchStreetName);
          }
        }

        if (foundAppointment) break; // Break outer loop if appointment is found
      }

      if (!foundAppointment) {
        logWithTimestamp("Sleeping for 10 minutes before the next round of attempts...");
        await sleep(10 * 60 * 1000); // Sleep for 10 minutes before the next round of attempts
      }
    }
  }

  async finishTheVerificationProcessAndGetTheAppointment(isAppointmentFoundResult) {
    notifier.notify("DATE FOUND ✅");

    const [buttonScheduleHour] = await this.page.$x("//div[@class='appointment-listings']//child::mat-button-toggle[1]");
    if (!buttonScheduleHour) throw new Error("Schedule hour button not found.");
    await buttonScheduleHour.click();
    await sleep(2000);

    const [buttonReviewAppointment] = await this.page.$x("//*[contains(text(),'Review Appointment')]");
    if (!buttonReviewAppointment) throw new Error("Review Appointment button not found.");
    await buttonReviewAppointment.click();
    await sleep(2000);

    const [buttonNext] = await this.page.$x("//div[contains(@class, 'action-button-container')]//button[contains(text(), 'Next')]");
    if (!buttonNext) throw new Error("Next button not found.");
    await buttonNext.click();
    await sleep(2000);

    const [buttonSend] = await this.page.$x("//div[contains(@class, 'otp-action-buttons')]//button[@type='submit' and contains(text(), 'Send')]");
    if (!buttonSend) throw new Error("Send button not found.");
    await buttonSend.click();
    await sleep(2000);

    logWithTimestamp("Waiting for the verification code input field to be visible and interactable...");
    const verificationCodeInput = await this.page.$("input[formcontrolname='otpField'][type='tel']");
    if (!verificationCodeInput) throw new Error("Verification code input not found.");
    logWithTimestamp("Verification code input found. Waiting before typing...");
    await sleep(3000);

    let verificationCode;
    const totalAttempts = totalAttemptsForFetchingVerificationCode;
    for (let i = 1; i <= totalAttempts; i += 1) {
      try {
        logWithTimestamp(`Fetching verification code from inbox (Attempt ${i}/${totalAttempts})...`);
        const resultOfAttempt = await getVerificationCode();
        if (resultOfAttempt !== "No Email") {
          verificationCode = resultOfAttempt;
          logWithTimestamp(`✅ Verification code: ${verificationCode}`);
          break;
        }
        await sleep(intervalBetweenEachFetchingVerificationCodeFromEmail);
      } catch (er) {
        logWithTimestamp(`FATAL ERROR: ${er}`);
      }
    }

    if (verificationCode === undefined) {
      logWithTimestamp("⚠️ Failed to fetch the verification code!! ... Making decision...");
      if (promptMeAndWaitForMyRestartCall) {
        const verificationCodeOrZero = await this.promptMeAndWaitForMyRestartCall();
        if (verificationCodeOrZero === 0) throw new Error("Restarting the process");
        verificationCode = verificationCodeOrZero;
      } else {
        notifier.notify("FAILING 5 TIMES IN A ROW!!!");
        throw new Error("Restarting the process");
      }
    }

    logWithTimestamp("Found verification code input:", verificationCodeInput);
    logWithTimestamp("Attempting to type the verification code...");

    await verificationCodeInput.type(verificationCode);
    await sleep(1000);

    logWithTimestamp("Waiting for the 'Submit code and book appointment' button to be enabled...");
    await this.page.waitForFunction(
      () => {
        const button = document.querySelector("button.submit-code-button");
        return button && !button.disabled;
      },
      { timeout: 10000 }
    );

    const buttonSubmitCodeAndBookAppointment = await this.page.$("button.submit-code-button:not([disabled])");
    if (!buttonSubmitCodeAndBookAppointment) throw new Error("Submit code and book appointment button not found or is disabled.");

    logWithTimestamp("Found 'Submit code and book appointment' button:", buttonSubmitCodeAndBookAppointment);
    logWithTimestamp("Attempting to scroll to the submit button...");

    await buttonSubmitCodeAndBookAppointment.evaluate(el => el.scrollIntoView());
    await buttonSubmitCodeAndBookAppointment.click();

    logWithTimestamp(
      `Congrats! Your appointment is now booked on: ${isAppointmentFoundResult.getDate()}/${
        isAppointmentFoundResult.getMonth() + 1
      }/${isAppointmentFoundResult.getFullYear()}  ... ENJOY!`
    );
  }

  async promptMeAndWaitForMyRestartCall() {
    const decisions = ["Restart and continue searching again.", "Enter the verification code manually."];
    while (true) {
      const chosenOption = readlineSync.keyInSelect(
        decisions,
        "Please make your decision (type the option's number to select):",
        { cancel: "Exit the program." }
      );

      logWithTimestamp(`You chose: ${decisions[chosenOption] || "Exit the program."}`);

      if (chosenOption === 0) {
        return 0;
      }
      if (chosenOption === 1) {
        return readlineSync.question("Please enter the verification code: ");
      }
      if (chosenOption === -1) {
        logWithTimestamp("Exiting the program...");
        process.exit(0);
      } else {
        logWithTimestamp("Invalid option. Please try again.");
      }
    }
  }

  async isAppointmentFound(buttonFoundLocation) {
    await buttonFoundLocation.click();

    await sleep(2000);

    await this.checkForSoftBan();

    const dateTitleElement = await this.page.$(".date-title");
    let dateText = null;
    if (dateTitleElement) {
      dateText = await this.page.$eval(".date-title", (e) => e.innerText);
    } else {
      throw new Error("Date title element not found.");
    }

    if (this.lastDateText === dateText) {
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`[${new Date().toISOString()}] Attempt #${WebDriverHelper.attempt++}: ${dateText}`);
    } else {
      process.stdout.write(`${EOL}[${new Date().toISOString()}] Attempt #${WebDriverHelper.attempt++}: ${dateText}`);
    }
    this.lastDateText = dateText;

    const date = getDateFromText(dateText);

    const isApproved = approvementLogic(date, dateText);
    if (isApproved) {
      logWithTimestamp(`Appointment Found!!! ----- ${dateText} -----`);
      return date;
    }

    return false;
  }
}

export default WebDriverHelper;
