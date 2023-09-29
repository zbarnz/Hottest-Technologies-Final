type PayFrequency = "year" | "month" | "hour";

export function calculateYearlySalary(
  frequency: PayFrequency,
  amount: number
): number {
  switch (frequency.toLowerCase()) {
    case "year":
      return amount;
    case "month":
      return amount * 12;
    case "hour":
      // Assuming a 40-hour work week and 52 weeks in a year
      return amount * 40 * 52;
    default:
      return 1337;
  }
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
