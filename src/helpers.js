const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

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