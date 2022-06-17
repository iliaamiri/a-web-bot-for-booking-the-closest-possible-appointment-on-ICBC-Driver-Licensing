// rename this file to config.js

// --------------- Selenium Server ---------------
const seleniumServer = "localhost";
const seleniumServerPort = 4444;
const seleniumForBrowser = "firefox";

// --------------- Your Credentials ---------------
const lastName = "YOUR LAST NAME";
const driverLicenseNumber = "YOUR DRIVER LICENSE #";
const keyWord = "YOUR KEYWORD";

// --------------- Location ---------------
const citySpelledOut = ["Surr", "ey", ", BC"]; // Location's name (Spelled-out) e.g. Surrey, BC -> ["Surr", "ey", "BC"]
const cityFullName = citySpelledOut.join("");

const branchStreetName = "19950 Willowbrook Dr j7"; // Branch's street name

// --------------- IMAP for Email Automation --------------- (optional - For Full Automation)
const email = "YOUR EMAIL";
const passwordOfEmail = "YOUR PASSWORD";
const imapServer = "IMAP SERVER";
const imapPort = 993;

// --------------- Logic for finding appointment ---------------
// You can add/remove more logic here to decide if the appointment is accepted or not.
const logic = (acceptIfIs) => {
    return (
      (acceptIfIs.Between("2022-06-28", "2022-07-05")) ||  // If it was between June 28th and July 5th

      (acceptIfIs.On("2022-06-28")) || // Or If it was on June 28th

      (acceptIfIs.After("2022-06-28")) || // Or If it was after June 28th

      (acceptIfIs.Before("2022-07-05")) // Or If it was before July 5th
    )
}

// --------------- Intervals and waiting times (times are in milliseconds) ---------------
const intervalBetweenEachRefresh = 1000; //

// Fetching verification code from email
const totalAttemptsForFetchingVerificationCode = 3;
const intervalBetweenEachFetchingVerificationCodeFromEmail = 1000; // (can be 0)

// --------------- Prompt for user input ---------------
const promptMeAndWaitForMyRestartCall = false; // If true, the bot will wait for your call to either enter the validation code MANUALLY or continue looking for appointment.
                                                // If false, the bot will just restart the process and tries to find an appointment from scratch, again. (It won't stop and wait for your call).









module.exports = {
    seleniumServer,
    seleniumServerPort,
    lastName,
    driverLicenseNumber,
    keyWord,
    email,
    passwordOfEmail,
    imapServer,
    imapPort,
    intervalBetweenEachRefresh,
    citySpelledOut,
    cityFullName,
    branchStreetName,
    seleniumForBrowser,
    totalAttemptsForFetchingVerificationCode,
    intervalBetweenEachFetchingVerificationCodeFromEmail,
    promptMeAndWaitForMyRestartCall,
    logic
};