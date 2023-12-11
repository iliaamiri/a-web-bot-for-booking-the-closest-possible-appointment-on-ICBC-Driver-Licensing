import acceptIfIs from "./libs/acceptIfIs.js";
import { logic } from "./config.js";
/**
 *  The approving logic for your soonest appointment.
 *  This function is called when the bot wants to decide whether to accept or reject an appointment.
 * @param dateObject
 * @param dateText
 * @param callback
 * @returns {boolean}
 */
const approvementLogic = (dateObject, dateText, callback = logic) => callback(acceptIfIs.SetFoundDate(dateObject));

export default approvementLogic;
