const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

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

const getDateFromText = (dateText) => {
    let arrayDate = dateText.split(",");

    // let dayOfWeek = arrayDate[0].trim();

    let monthAndDayOfMonth = arrayDate[1].trim();
    let arrayMonthAndDay = monthAndDayOfMonth.split(" ");

    let month = monthsList[arrayMonthAndDay[0]];
    let dayOfMonth = parseInt(arrayMonthAndDay[1]);

    let year = parseInt(arrayDate[2].trim());

    return new Date(year, month, dayOfMonth)
}

module.exports = {
    sleep,
    randomIntFromInterval,
    getDateFromText
}