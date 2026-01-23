const STOP_WORDS = new Set([
  "hello",
  "hi",
  "hey",
  "i",
  "am",
  "you",
  "your",
  "the",
  "a",
  "an",
  "and",
  "can",
  "how",
  "today",
]);

export function generateTitle(text: string): string {
  if (!text || typeof text !== "string") {
    return "New Chat";
  }

  // Normalize
  const cleaned = text
    .toLowerCase()
    .replace(/\n+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();

  const words = cleaned
    .split(" ")
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .slice(0, 5);

  if (words.length === 0) {
    return "New Chat";
  }

  // Title Case
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
