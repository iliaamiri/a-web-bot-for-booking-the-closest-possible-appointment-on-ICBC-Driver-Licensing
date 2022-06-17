const {Builder, By} = require('selenium-webdriver');
const {getVerificationCode} = require('./libs/emailVerification');
const { EOL } = require('os');

const { randomIntFromInterval, sleep, getDateFromText} = require('./helpers');

const {
    seleniumServer,
    seleniumServerPort,
    lastName,
    driverLicenseNumber,
    keyWord,
    intervalBetweenEachRefresh,
    citySpelledOut,
    cityFullName,
    branchStreetName,
    seleniumForBrowser, intervalBetweenEachFetchingVerificationCodeFromEmail, totalAttemptsForFetchingVerificationCode
} = require('./config');

const approvementLogic = require('./approvementLogic');

const monthsList = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

let attempt = 1;
let lastDateText;


(async function solution() {
    try {
        console.log("  __ ___      _ ___ \n" +
            " (_   |  /\\  |_) |  \n" +
            " __)  | /--\\ | \\ |  \n" +
            "                    ");
        console.log("------------- Configs ---------------");
        console.log(`Selenium Server: ${seleniumServer}`);
        console.log(`Selenium Server Port: ${seleniumServerPort}`);
        console.log(`Last Name: ${lastName}`);
        console.log(`Driver License Number: ${driverLicenseNumber}`);
        console.log(`Keyword: ******${EOL}`);
        console.log(`Interval Between Each Refresh: ${intervalBetweenEachRefresh}ms`);
        console.log("-------------------------------------");
        console.log("Attempting to connect to selenium server...");
        let driver = await new Builder()
            .forBrowser(seleniumForBrowser)
            .usingServer(`http://${seleniumServer}:${seleniumServerPort}/wd/hub`)
            .build();

        let buttonFoundLocation = await start(driver);


        let isAppointmentFoundResult;

        while (true) {
            try{
                isAppointmentFoundResult = await isAppointmentFound(driver, buttonFoundLocation)

                if (isAppointmentFoundResult) {
                    break;
                }
                await sleep(intervalBetweenEachRefresh);


            } catch (err) {
                if (err['name'] !== undefined && err['name'] === "NoSuchElementError") {
                    console.log(`${EOL}Restarting due to session expiration...`);
                    buttonFoundLocation = await start(driver);
                }
            }
        }

        let buttonScheduleHour = await driver.findElement(By.xpath("//div[@class='appointment-listings']//child::mat-button-toggle[1]"));

        await buttonScheduleHour.click();

        await sleep(2000);

        let buttonReviewAppointment = await driver.findElement(By.xpath("//*[contains(text(),'Review Appointment')]"));

        await buttonReviewAppointment.click();

        await sleep(2000);

        let buttonNext = await driver.findElement(By.xpath("//span[contains(text(),'Next')]"));

        await buttonNext.click();

        await sleep(2000);

        let buttonSend = await driver.findElement(By.xpath("//span[contains(text(),'Send')]"));

        await buttonSend.click();

        await sleep(2000);

        let verificationCodeInput = await driver.findElement(By.xpath("//input[@formcontrolname='otpField']"));

        await sleep(3000);

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
            return console.log("Failed to fetch the verification code!! .. Terminating the process...");
        }

        await verificationCodeInput.sendKeys(verificationCode);

        let buttonSubmitCodeAndBookAppointment = await driver.findElement(By.xpath("//span[contains(text(),'Submit code and book appointment')]"));

        await buttonSubmitCodeAndBookAppointment.click();

        console.log(`Congrats! Your appointment is now booked on: ${isAppointmentFoundResult.getDate()}/${isAppointmentFoundResult.getMonth() + 1}/${isAppointmentFoundResult.getFullYear()}  ... ENJOY!`);
    } catch (e) {
        console.log(`FATAL ERROR: ${e}`)
    }

})();

async function start(driver) {
    while (true) {
        try {
            console.log("Redirecting to the start-point...");

            await driver.get('https://onlinebusiness.icbc.com/webdeas-ui/login;type=driver');

            let inputLastName = await driver.findElement(By.id('mat-input-0'));
            let inputDriverLicenseNumber = await driver.findElement(By.id('mat-input-1'));
            let inputKeyWord = await driver.findElement(By.id('mat-input-2'));
            let buttonSignIn = await driver.findElement(By.xpath("//span[contains(text(),'Sign in')]"));

            console.log("Signing-in...");

            await inputLastName.sendKeys(lastName);
            await inputDriverLicenseNumber.sendKeys(driverLicenseNumber);
            await inputKeyWord.sendKeys(keyWord);
            await driver.executeScript(`document.getElementById('mat-checkbox-1-input').click();`);

            await buttonSignIn.click();

            console.log("Waiting for the panel to load...");

            await sleep(5000);

            try {
                console.log("Looking for the Book Appointment button...");

                // Not sure about this xpath, but I hope it works :) // TODO: make sure that the button is called "Book Appointment" or something like that
                let buttonBookAppointment = await driver.findElement(By.xpath("//span[contains(text(),'Book Appointment') or contains(text(),'New Appointment')]"));

                console.log("Book Appointment button found! Clicking it...");
                await buttonBookAppointment.click();
            } catch (err) {
                console.log("Book Appointment button not found 😵‍💫");
                console.log("Looking for the Schedule Appointment button...");

                let buttonRescheduleAppointment = await driver.findElement(By.xpath("//span[contains(text(),'Reschedule appointment')]"));

                console.log("Schedule Appointment button found! Clicking it...");
                await buttonRescheduleAppointment.click();

                let buttonRescheduleAppointment_YesToConfirm = await driver.findElement(By.xpath("//span[contains(text(),'Yes')]"));

                await buttonRescheduleAppointment_YesToConfirm.click();
            }

            console.log("Entered the searching area.");
            console.log("Searching for the correct branch...");

            // Entered the map
            let inputLocationName = await driver.findElement(By.id('mat-input-3'));

            let currentSpellIndex = 0;
            let inputLocationName_SuggestedLocationToConfirm;
            const tryFindingTheSuggestion = async () => {
                if (citySpelledOut[currentSpellIndex] === undefined) {
                    throw "Could not find the suggestion city. The element cannot be found.";
                }

                await inputLocationName.sendKeys(citySpelledOut[currentSpellIndex]);

                await sleep(1500);

                try {
                    inputLocationName_SuggestedLocationToConfirm = await driver.findElement(By.xpath(`//span[contains(text(),'${cityFullName}')]`));
                } catch(err) {
                    currentSpellIndex++;
                    await tryFindingTheSuggestion();
                }
            }
            await tryFindingTheSuggestion();

            inputLocationName_SuggestedLocationToConfirm.click();

            await sleep(3000);

            let buttonSearch = await driver.findElement(By.className("mat-raised-button mat-button-base search-button mat-accent"));

            await buttonSearch.click();

            await sleep(2000);

            let buttonFoundLocation = await driver.findElement(By.xpath(`//div[contains(text(),'${branchStreetName}')]`));

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

async function isAppointmentFound(driver, buttonFoundLocation) {
    await buttonFoundLocation.click();

    await sleep(2000);

    let divFoundSchedules = await driver.findElement(By.className("date-title"));

    let dateText = await divFoundSchedules.getText();

    if (lastDateText === dateText) {
        process.stdout.write("\r\x1b[K");
        process.stdout.write(`Attempt #${attempt++}: ${dateText}`);
    } else {
        process.stdout.write(`${EOL}Attempt #${attempt++}: ${dateText}`);
    }
    lastDateText = dateText;

    let date = getDateFromText(dateText);

    const isApproved = approvementLogic(date, dateText);
    if (isApproved) {
        console.log(`Successful!!! ----- ${dateText} -----`);
        return date;
    }

    return false;
}