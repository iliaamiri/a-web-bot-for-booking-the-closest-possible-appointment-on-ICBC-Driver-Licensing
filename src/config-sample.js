// rename this file to config.js

// --------------- Your Credentials ---------------
export const lastName = "YOUR LAST NAME";
export const driverLicenseNumber = "YOUR DRIVER LICENSE #";
export const keyWord = "YOUR KEYWORD";

// --------------- Location ---------------
export const citySpelledOut = ["Surr", "ey", ", BC"]; // Location's name (Spelled-out) e.g. Surrey, BC -> ["Surr", "ey", "BC"]
// const cityFullName = "Surrey, BC"; // IF The bottom one didn't work, try spelling this fully and not spelling the whole thing at the top. (eg. try "Surr", "ey" OR different variations).
export const cityFullName = citySpelledOut.join("");

export const branchStreetNames = ["19950 Willowbrook Dr j7"]; // Branches' street names

// --------------- IMAP for Email Automation --------------- (optional - For Full Automation)
export const email = "YOUR EMAIL";
export const passwordOfEmail = "YOUR PASSWORD";
export const imapServer = "IMAP SERVER";
export const imapPort = 993;

// --------------- Logic for finding appointment ---------------
// You can add/remove more logic here to decide if the appointment is accepted or not.
export const logic = (acceptIfIs) =>
  acceptIfIs.Between("2022-06-28", "2022-07-05") || // If it was between June 28th and July 5th
  acceptIfIs.On("2022-06-28") || // Or If it was on June 28th
  acceptIfIs.After("2022-06-28") || // Or If it was after June 28th
  acceptIfIs.Before("2022-07-05"); // Or If it was before July 5th

// --------------- Intervals and waiting times (times are in milliseconds) ---------------
export const intervalBetweenEachRefresh = 1000; //

// Fetching verification code from email
export const totalAttemptsForFetchingVerificationCode = 3;
export const intervalBetweenEachFetchingVerificationCodeFromEmail = 1000; // (can be 0)

// --------------- Prompt for user input ---------------
export const promptMeAndWaitForMyRestartCall = false; // If true, the bot will wait for your call to either enter the validation code MANUALLY or continue looking for appointment.
// If false, the bot will just restart the process and tries to find an appointment from scratch, again. (It won't stop and wait for your call).
