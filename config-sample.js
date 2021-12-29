// rename this file to config.js

const seleniumServer = "localhost";
const seleniumServerPort = 4445;

const lastName = "YOUR LAST NAME";
const driverLicenseNumber = "YOUR DRIVER LICENSE";
const keyWord = "YOUR KEYWORD";

const email = "YOUR EMAIL";
const passwordOfEmail = "YOUR PASSWORD";
const imapServer = "IMAP SERVER";
const imapPort = 993;

const intervalBetweenEachRefresh = 1000; // in milli-seconds

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
};