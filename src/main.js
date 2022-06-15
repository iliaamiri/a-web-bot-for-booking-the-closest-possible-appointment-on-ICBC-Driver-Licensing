const {Builder, By} = require('selenium-webdriver');
const {getVerificationCode} = require('./emailVerification');
const { EOL } = require('os');

const { randomIntFromInterval, sleep } = require('./helpers');

const {
    seleniumServer,
    seleniumServerPort,
    lastName,
    driverLicenseNumber,
    keyWord,
    intervalBetweenEachRefresh,
    approvementLogic,
    citySpelledOut,
    cityFullName,
    branchStreetName,
    seleniumForBrowser
} = require('./config');

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

        let buttonFoundLocation = await initiate(driver);


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
                    console.log(`${EOL}Restarting due to session expiration...`)
                    buttonFoundLocation = await initiate(driver)
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

        await sleep(3000)

        let verificationCode = await getVerificationCode()
            .then(resultOfAttempt1 => {
                console.log("Fetching verification code from inbox (Attempt 1/3): " + resultOfAttempt1)

                if (resultOfAttempt1 === "No Email") {
                    return getVerificationCode();
                }

                return resultOfAttempt1;
            })
            .then(resultOfAttempt2 => {
                if (resultOfAttempt2 === "No Email"){
                    console.log("Fetching verification code from inbox (Attempt 2/3): " + resultOfAttempt2);
                    return getVerificationCode();
                }

                return resultOfAttempt2;
            })
            .then(resultOfAttempt3 => {
                if (resultOfAttempt3 === "No Email"){
                    console.log("Fetching verification code from inbox (Attempt 3/3): " + resultOfAttempt3);
                    return getVerificationCode();
                }

                return resultOfAttempt3;
            })
            .then(resultOfAttempt4 => {
                if (resultOfAttempt4 !== "No Email") {
                    return resultOfAttempt4;
                } else {
                    console.log("All attempts to fetch verification code from inbox failed!")
                }
            })
            .catch(err => {
                console.log("FATAL ERROR: " + err)
            })

        if (verificationCode === undefined) {
            return console.log("Failed to fetch the verification code!! .. Terminating the process...");
        }

        await verificationCodeInput.sendKeys(verificationCode)

        let buttonSubmitCodeAndBookAppointment = await driver.findElement(By.xpath("//span[contains(text(),'Submit code and book appointment')]"));

        await buttonSubmitCodeAndBookAppointment.click();

        console.log(`Congrats! Your appointment is now booked on: ${isAppointmentFoundResult.getDate()}/${isAppointmentFoundResult.getMonth() + 1}/${isAppointmentFoundResult.getFullYear()}  ... ENJOY!`);
    } catch (e) {
        console.log(`FATAL ERROR: ${e}`)
    }

})();

async function initiate(driver) {
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

            console.log("Rescheduling...");

            await sleep(5000);

            let buttonRescheduleAppointment = await driver.findElement(By.xpath("//span[contains(text(),'Reschedule appointment')]"))

            await buttonRescheduleAppointment.click()

            let buttonRescheduleAppointment_YesToConfirm = await driver.findElement(By.xpath("//span[contains(text(),'Yes')]"))

            await buttonRescheduleAppointment_YesToConfirm.click();

            console.log("Entered the searching area.");
            console.log("Searching for the correct branch...")

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

            await sleep(3000)

            let buttonSearch = await driver.findElement(By.className("mat-raised-button mat-button-base search-button mat-accent"))

            await buttonSearch.click()

            await sleep(2000)

            let buttonFoundLocation = await driver.findElement(By.xpath(`//div[contains(text(),'${branchStreetName}')]`))

            console.log("Initiated successfully.")
            console.log(" ___                  ___  __       ___    __           __   ___  __          __  \n" +
                "|__  |\\ | |  |  |\\/| |__  |__)  /\\   |  | /  \\ |\\ |    |__) |__  / _` | |\\ | /__` \n" +
                "|___ | \\| \\__/  |  | |___ |  \\ /~~\\  |  | \\__/ | \\|    |__) |___ \\__> | | \\| .__/ \n" +
                "                                                                                  ");

            return buttonFoundLocation;
        } catch (e) {
            console.log(`ERROR: ${e}`)
            console.log(`Retrying...`)
        }
    }
}

async function isAppointmentFound(driver, buttonFoundLocation) {
    await buttonFoundLocation.click()

    await sleep(2000)

    let divFoundSchedules = await driver.findElement(By.className("date-title"))

    let dateText = await divFoundSchedules.getText();

    if (lastDateText === dateText) {
        process.stdout.write("\r\x1b[K")
        process.stdout.write(`Attempt #${attempt++}: ${dateText}`)
    } else {
        process.stdout.write(`${EOL}Attempt #${attempt++}: ${dateText}`)
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

function getDateFromText(dateText) {
    let arrayDate = dateText.split(",");

   // let dayOfWeek = arrayDate[0].trim();

    let monthAndDayOfMonth = arrayDate[1].trim();
    let arrayMonthAndDay = monthAndDayOfMonth.split(" ");

    let month = monthsList[arrayMonthAndDay[0]];
    let dayOfMonth = parseInt(arrayMonthAndDay[1]);

    let year = parseInt(arrayDate[2].trim());

    return new Date(year, month, dayOfMonth)
}