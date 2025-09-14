export function maskPII(text) {
  if (!text) return text;
  return text
    .replace(/\b\d{12}\b/g, "*Aadhaar*") // Aadhaar
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, "*PAN*") // PAN
    .replace(/\b\d{10}\b/g, "*Phone*"); // phone
}
