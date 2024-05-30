export const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const randomIntFromInterval = (
  min,
  max, // min and max included
) => Math.floor(Math.random() * (max - min + 1) + min);

export const monthsList = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export const getDateFromText = (dateText) => {
  const arrayDate = dateText.split(",");

  // let dayOfWeek = arrayDate[0].trim();

  const monthAndDayOfMonth = arrayDate[1].trim();
  const arrayMonthAndDay = monthAndDayOfMonth.split(" ");

  const month = monthsList[arrayMonthAndDay[0]];
  const dayOfMonth = parseInt(arrayMonthAndDay[1], 10);

  const year = parseInt(arrayDate[2].trim(), 10);

  return new Date(year, month, dayOfMonth);
};
