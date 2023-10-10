type PayFrequency = "annual" | "year" | "month" | "hour" | "hourly";

export function calculateYearlySalary(
  frequency: PayFrequency,
  amount: number
): number {
  switch (frequency.toLowerCase()) {
    case "annual": //dice
    case "year": //indeed
      return amount;
    case "monthly": //dice
    case "month": //indeed
      return amount * 12;
    case "hourly": //dice
    case "hour":  //indeed
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
