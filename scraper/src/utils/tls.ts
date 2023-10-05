import tls from "node:tls"

export function getCiphers(): string {
  // Inner shuffle function
  function shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const ciphersArray: string[] = tls.DEFAULT_CIPHERS.split(":");

  if (ciphersArray.length <= 4) {
    ciphersArray.push(
      "ECDHE-ECDSA-AES128-GCM-SHA256",
      "ECDHE-RSA-AES256-GCM-SHA384",
      "ECDHE-ECDSA-AES256-GCM-SHA384",
      "DHE-RSA-AES128-GCM-SHA256",
      "ECDHE-RSA-AES128-SHA256",
      "DHE-RSA-AES128-SHA256",
      "ECDHE-RSA-AES256-SHA384",
      "DHE-RSA-AES256-SHA384",
      "ECDHE-RSA-AES256-SHA256",
      "DHE-RSA-AES256-SHA256",
      "HIGH",
      "!aNULL",
      "!eNULL",
      "!EXPORT",
      "!DES",
      "!RC4",
      "!MD5",
      "!PSK",
      "!SRP",
      "!CAMELLIA"
    );
  }

  ciphersArray.splice(-10, 10);
  const fixed = ciphersArray.slice(0, 4);
  const rest = shuffleArray(ciphersArray.slice(4));
  return fixed.concat(rest).join(":");
}
