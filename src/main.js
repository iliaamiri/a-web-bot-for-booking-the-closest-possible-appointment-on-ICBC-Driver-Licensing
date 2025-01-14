import { EOL } from "os";

import { lastName, driverLicenseNumber, intervalBetweenEachRefresh } from "./config.js";

import WebDriverHelper from "./libs/webDriverHelper.js";

try {
  console.log("  __ ___      _ ___ \n (_   |  /\\  |_) |  \n __)  | /--\\ | \\ |  \n                    ");
  console.log("------------- Configs ---------------");
  console.log(`Last Name: ${lastName}`);
  console.log(`Driver License Number: ${driverLicenseNumber}`);
  console.log(`Keyword: ******${EOL}`);
  console.log(`Interval Between Each Refresh: ${intervalBetweenEachRefresh}ms`);
  console.log("-------------------------------------");

  const Solution = new WebDriverHelper();

  await Solution.findAppointment();
} catch (e) {
  console.log(`FATAL ERROR:`, e);
}
