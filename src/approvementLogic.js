const acceptIfIs = require("./libs/acceptIfIs");
const logic = require("./config").logic;
/**
 *  The approving logic for your soonest appointment.
 *  This function is called when the bot wants to decide whether to accept or reject an appointment.
 * @param dateObject: Date -> Date object of the possible appointment.
 * @param dateText: String -> The text that the bot has found for the date.
 * @param callback
 * @returns {boolean}
 */
const approvementLogic = (dateObject, dateText, callback = logic) => {
  return callback(acceptIfIs.SetFoundDate(dateObject));

  // return (
  //   (dateObject.getMonth() === 6 || dateText.includes("June")) || // If it was in June
  //   (dateObject.getDay() <= 15 && dateText.includes("July")) // Or If it was in July AND was before or on 15th
  // );
};

module.exports = approvementLogic;