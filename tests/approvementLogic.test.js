import approvementLogic from "../src/approvementLogic";

const expectItToBe = (foundDate, testLogic, expects) => {
  const isApproved = approvementLogic(foundDate, "", testLogic);

  expect(isApproved).toBe(expects);
};

describe("Want it to be between June 28th and July 5th", () => {
  const testLogic = (acceptIfIs) => acceptIfIs.Between("2022-06-28", "2022-07-05"); // If it was in June

  test("should return true if the date is on July 1st", () => {
    const foundDate = new Date("2022-07-01");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return true if the date is on July 5th", () => {
    const foundDate = new Date("2022-07-05");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return false if the date is on July 6th", () => {
    const foundDate = new Date("2022-07-06");

    expectItToBe(foundDate, testLogic, false);
  });

  test("should return false if the date is on July 7th", () => {
    const foundDate = new Date("2022-07-07");

    expectItToBe(foundDate, testLogic, false);
  });

  test("should return true if the date is on June 28th", () => {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return false the date is on June 27th", () => {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, false);
  });
});

describe("Want it to be exactly on June 28th", () => {
  const testLogic = (acceptIfIs) => acceptIfIs.On("2022-06-28"); // If it was on June 28th

  test("should return true if the date is on June 28th", () => {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return false if the date is on June 29th", () => {
    const foundDate = new Date("2022-06-29");

    expectItToBe(foundDate, testLogic, false);
  });

  test("should return false if the date is on June 27th", () => {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, false);
  });
});

describe("Want it to be after on June 28th", () => {
  const testLogic = (acceptIfIs) => acceptIfIs.After("2022-06-28"); // If it was on June 28th

  test("should return true if the date is on June 29th", () => {
    const foundDate = new Date("2022-06-29");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return false if the date is on June 28th", () => {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, false);
  });

  test("should return false if the date is on June 27th", () => {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, false);
  });
});

describe("Want it to be before on June 28th", () => {
  const testLogic = (acceptIfIs) => acceptIfIs.Before("2022-06-28"); // If it was on June 28th

  test("should return true if the date is on May", () => {
    const foundDate = new Date("2022-05-27");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return true if the date is on June 27th", () => {
    const foundDate = new Date("2022-06-27");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return true if the date is on June 26th", () => {
    const foundDate = new Date("2022-06-26");

    expectItToBe(foundDate, testLogic, true);
  });

  test("should return true if the date is on June 28th", () => {
    const foundDate = new Date("2022-06-28");

    expectItToBe(foundDate, testLogic, false);
  });

  test("should return true if the date is on June 29th", () => {
    const foundDate = new Date("2022-06-29");

    expectItToBe(foundDate, testLogic, false);
  });

  test("should return true if the date is on June 30th", () => {
    const foundDate = new Date("2022-06-30");

    expectItToBe(foundDate, testLogic, false);
  });
});
