const approvementLogic = require("../src/approvementLogic");

var luxon = require('luxon');

const expectItToBe = (foundDate, testLogic, expects) => {
  const isApproved = approvementLogic(foundDate, "", testLogic);

  expect(isApproved).toBe(expects);
};

describe('Want it to be between June 28th and July 5th', function () {
  const testLogic = (acceptIfIs) => {
    return (
      (acceptIfIs.Between("2022-06-28", "2022-07-05")) // If it was in June
    )
  };

  test('should return true if the date is on July 1st', function () {
    const foundDate = new Date("2022-07-01");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return true if the date is on July 5th', function () {
    const foundDate = new Date("2022-07-05");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return false if the date is on July 6th', function () {
    const foundDate = new Date("2022-07-06");

    expectItToBe(foundDate, testLogic, false);
  });

  test('should return false if the date is on July 7th', function () {
    const foundDate = new Date("2022-07-07");

    expectItToBe(foundDate, testLogic, false);
  });

  test('should return true if the date is on June 28th', function () {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return false the date is on June 27th', function () {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, false);
  });
});

describe('Want it to be exactly on June 28th', function () {
  const testLogic = (acceptIfIs) => {
    return (
      (acceptIfIs.On("2022-06-28")) // If it was on June 28th
    )
  };

  test('should return true if the date is on June 28th', function () {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return false if the date is on June 29th', function () {
    const foundDate = new Date("2022-06-29");

    expectItToBe(foundDate, testLogic, false);
  });

  test('should return false if the date is on June 27th', function () {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, false);
  });
});

describe('Want it to be after on June 28th', function () {
  const testLogic = (acceptIfIs) => {
    return (
      (acceptIfIs.After("2022-06-28")) // If it was on June 28th
    )
  };

  test('should return true if the date is on June 29th', function () {
    const foundDate = new Date("2022-06-29");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return false if the date is on June 28th', function () {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, false);
  });

  test('should return false if the date is on June 27th', function () {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, false);
  });
});

describe('Want it to be before on June 28th', function () {
  const testLogic = (acceptIfIs) => {
    return (
      (acceptIfIs.Before("2022-06-28")) // If it was on June 28th
    )
  };

  test('should return true if the date is on May', function () {
    const foundDate = new Date("2022-05-27");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return true if the date is on June 27th', function () {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return true if the date is on June 26th', function () {
    const foundDate = new Date("2022-06-26");

    expectItToBe(foundDate, testLogic, true);
  });

  test('should return true if the date is on June 28th', function () {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, false);
  });

  test('should return true if the date is on June 29th', function () {
    const foundDate = new Date("2022-06-29");

    expectItToBe(foundDate, testLogic, false);
  });

  test('should return true if the date is on June 30th', function () {
    const foundDate = new Date("2022-06-30");

    expectItToBe(foundDate, testLogic, false);
  });
});
