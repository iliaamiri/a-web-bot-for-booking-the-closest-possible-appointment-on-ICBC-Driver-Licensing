const acceptIfIs = require("./libs/acceptIfIs");

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

// You can add/remove more logic here to decide if the appointment is accepted or not.
function logic(acceptIfIs) {
  return (
    (acceptIfIs.Between("2022-06-28T00:00:00.000Z", "2022-07-05T00:00:00.000Z")) ||  // If it was between June 28th and July 5th

    (acceptIfIs.On("2022-06-28T00:00:00.000Z")) || // Or If it was on June 28th

    (acceptIfIs.After("2022-06-28T00:00:00.000Z")) || // Or If it was after June 28th

    (acceptIfIs.Before("2022-07-05T00:00:00.000Z")) // Or If it was before July 5th
  )
}

module.exports = approvementLogic;