// rename this file to config.js

const seleniumServer = "localhost";
const seleniumServerPort = 4444;

// Your Credentials
const lastName = "YOUR LAST NAME";
const driverLicenseNumber = "YOUR DRIVER LICENSE #";
const keyWord = "YOUR KEYWORD";

// The approving logic for your soonest appointment
const approvementLogic = (dateObject, dateText) => {
    return (
        (dateObject.getMonth() === 6 || dateText.includes("June")) || // If it was in June
        (dateObject.getDay() <= 15 && dateText.includes("July")) // Or If it was in July AND was before or on 15th
    ); 
};

// Location's name (Spelled-out)
const citySpelledOut = ["Surr", "ey", ", BC"];
const cityFullName = citySpelledOut.join("");

const branchStreetName = "19950 Willowbrook Dr j7";

// IMAP for Email Automation
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
    approvementLogic,
    citySpelledOut,
    cityFullName,
    branchStreetName
};