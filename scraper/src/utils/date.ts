export const utcToUnix = (utcString: string): number => {
  const dateObj = new Date(utcString);
  const unixTimestampMillis = dateObj.getTime();
  return Math.floor(unixTimestampMillis / 1000);
};