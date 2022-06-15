// rename this file to config.js

const seleniumServer = "localhost";
const seleniumServerPort = 4444;
const seleniumForBrowser = "firefox";

// Your Credentials
const lastName = "YOUR LAST NAME";
const driverLicenseNumber = "YOUR DRIVER LICENSE #";
const keyWord = "YOUR KEYWORD";

// Location's name (Spelled-out)
const citySpelledOut = ["Surr", "ey", ", BC"];
const cityFullName = citySpelledOut.join("");

const branchStreetName = "19950 Willowbrook Dr j7";

// IMAP for Email Automation
const email = "YOUR EMAIL";
const passwordOfEmail = "YOUR PASSWORD";
const imapServer = "IMAP SERVER";
const imapPort = 993;

const intervalBetweenEachRefresh = 1000; // in milliseconds

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
    seleniumForBrowser
};