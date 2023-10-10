function getMinMaxPay(pay: string): {
  minpay: number | null;
  maxpay: number | null;
} {
  if (!pay) {
    return { minpay: null, maxpay: null };
  }

  const matches = pay.match(
    /(\d+(?:,\d{3})*(?:\.\d{2})?)(?:\s*-\s*(\d+(?:,\d{3})*(?:\.\d{2})?))?/g
  );
  if (!matches || matches.length === 0) {
    return { minpay: null, maxpay: null };
  }

  let min = Infinity;
  let max = -Infinity;
  for (let match of matches) {
    const [_, startStr, endStr] =
      match.match(
        /(\d+(?:,\d{3})*(?:\.\d{2})?)(?:\s*-\s*(\d+(?:,\d{3})*(?:\.\d{2})?))?/
      ) || [];
    const start = startStr ? parseFloat(startStr.replace(/,/g, "")) : null;
    const end = endStr ? parseFloat(endStr.replace(/,/g, "")) : null;

    if (start !== null) {
      min = Math.min(min, start);
      max = Math.max(max, start);
    }

    if (end !== null) {
      min = Math.min(min, end);
      max = Math.max(max, end);
    }
  }

  const PERCENTAGE_THRESHOLD = 500; // for example, a value of 500 means the max can be 500% (or 5 times) larger than the min.
  if (min !== 0 && max / min > PERCENTAGE_THRESHOLD) {
    return { minpay: max, maxpay: max };
  }

  return {
    minpay: min !== Infinity ? min : null,
    maxpay: max !== -Infinity ? max : null,
  };
}

console.log(
  getMinMaxPay(
    "USD 154,700.00 - 209,300.00 ;USD 139,200.00 - 188,400.00 per year;USD 123,800.00 - 167,400.00 per year;USD 187,000.00 - 253,000.00 ;USD 168,300.00 - 227,700.00 ;USD 149,600.00 - 202,400.00 per year; USD 50.02"
  )
);
