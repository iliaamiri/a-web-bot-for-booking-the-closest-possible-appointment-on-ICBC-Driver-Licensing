const acceptIfIs = require("./libs/acceptIfIs");

/**
 *  The approving logic for your soonest appointment.
 *  This function is called when the bot wants to decide whether to accept or reject an appointment.
 * @param dateObject: Date -> Date object of the possible appointment.
 * @param dateText: String -> The text that the bot has found for the date.
 * @returns {boolean}
 */
const approvementLogic = (dateObject, dateText) => {
  acceptIfIs.SetFoundDate(dateObject);

  // You can add/remove more logic here to decide if the appointment is accepted or not.
  return (
    (acceptIfIs.Before("2022-07")) || // If it was in June
    (acceptIfIs.Before("2022-07-16")) // Or If it was in July AND was before or on 15th
  );

  // return (
  //   (dateObject.getMonth() === 6 || dateText.includes("June")) || // If it was in June
  //   (dateObject.getDay() <= 15 && dateText.includes("July")) // Or If it was in July AND was before or on 15th
  // );
};

module.exports = approvementLogic;