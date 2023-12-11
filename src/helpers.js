export const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const randomIntFromInterval = (
  min,
  max, // min and max included
) => Math.floor(Math.random() * (max - min + 1) + min);

export const monthsList = {
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
