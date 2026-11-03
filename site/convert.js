// Pure text conversion helpers. No DOM access, no network: safe to test in Node.

/** A character counts as a "letter" for alternation only if it has case. */
function isCased(ch) {
  return ch.toLowerCase() !== ch.toUpperCase();
}

export function toUpper(text) {
  return text.toUpperCase();
}

export function toLower(text) {
  return text.toLowerCase();
}

/**
 * Alternate the case of cased letters, continuing across words.
 * Spaces, digits, punctuation, emoji and caseless scripts are left as-is
 * and do not advance the pattern.
 *
 *   toAlternating("hello world")       -> "hElLo WoRlD"
 *   toAlternating("hello world", true) -> "HeLlO wOrLd"
 */
export function toAlternating(text, upperFirst = false) {
  let n = 0;
  let out = "";
  for (const ch of text) {
    if (isCased(ch)) {
      const upper = (n % 2 === 0) === upperFirst;
      out += upper ? ch.toUpperCase() : ch.toLowerCase();
      n++;
    } else {
      out += ch;
    }
  }
  return out;
}

export const toAlternatingLowerFirst = (text) => toAlternating(text, false);
export const toAlternatingUpperFirst = (text) => toAlternating(text, true);

const segmenter =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

/** Count user-perceived characters (an emoji family counts as 1). */
export function countChars(text) {
  if (!segmenter) return [...text].length;
  let n = 0;
  for (const _ of segmenter.segment(text)) n++;
  return n;
}

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}
