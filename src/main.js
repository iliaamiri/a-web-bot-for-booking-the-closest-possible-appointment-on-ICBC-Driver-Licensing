import { EOL } from "os";

import {
  seleniumServer,
  seleniumServerPort,
  lastName,
  driverLicenseNumber,
  intervalBetweenEachRefresh,
} from "./config.js";

import WebDriverHelper from "./libs/webDriverHelper.js";

try {
  console.log("  __ ___      _ ___ \n (_   |  /\\  |_) |  \n __)  | /--\\ | \\ |  \n                    ");
  console.log("------------- Configs ---------------");
  console.log(`Selenium Server: ${seleniumServer}`);
  console.log(`Selenium Server Port: ${seleniumServerPort}`);
  console.log(`Last Name: ${lastName}`);
  console.log(`Driver License Number: ${driverLicenseNumber}`);
  console.log(`Keyword: ******${EOL}`);
  console.log(`Interval Between Each Refresh: ${intervalBetweenEachRefresh}ms`);
  console.log("-------------------------------------");
  console.log("Attempting to connect to selenium server...");

  const Solution = new WebDriverHelper();

  await Solution.findAppointment();
} catch (e) {
  console.log(`FATAL ERROR: ${e}`);
}
