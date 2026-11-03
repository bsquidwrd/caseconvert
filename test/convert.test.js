import { test } from "node:test";
import assert from "node:assert/strict";
import {
  toUpper,
  toLower,
  toAlternatingLowerFirst as altLower,
  toAlternatingUpperFirst as altUpper,
  countChars,
  countWords,
} from "../site/convert.js";

test("upper and lower case", () => {
  assert.equal(toUpper("Hello, World! 123"), "HELLO, WORLD! 123");
  assert.equal(toLower("Hello, World! 123"), "hello, world! 123");
});

test("alternating: single word", () => {
  assert.equal(altLower("testing"), "tEsTiNg");
  assert.equal(altUpper("testing"), "TeStInG");
});

test("alternating: continues across words", () => {
  assert.equal(altLower("hello world"), "hElLo WoRlD");
  assert.equal(altUpper("hello world"), "HeLlO wOrLd");
});

test("alternating: ignores input casing", () => {
  assert.equal(altLower("TESTING"), "tEsTiNg");
  assert.equal(altUpper("tEsTiNg"), "TeStInG");
});

test("alternating: punctuation, digits and newlines don't advance the pattern", () => {
  assert.equal(altLower("a1b, c!\nd"), "a1B, c!\nD");
  assert.equal(altLower("don't stop"), "dOn'T sToP");
});

test("alternating: emoji are untouched and don't advance the pattern", () => {
  assert.equal(altLower("ab👨‍👩‍👧cd"), "aB👨‍👩‍👧cD");
});

test("alternating: caseless scripts don't advance the pattern", () => {
  assert.equal(altLower("ab漢字cd"), "aB漢字cD");
});

test("accented and non-Latin letters", () => {
  assert.equal(toUpper("crème brûlée"), "CRÈME BRÛLÉE");
  assert.equal(altLower("éàü"), "éÀü");
  assert.equal(altLower("привет"), "пРиВеТ");
  assert.equal(altUpper("αβγ"), "ΑβΓ");
});

test("combining marks stay attached and don't advance the pattern", () => {
  // "e" + U+0301 COMBINING ACUTE ACCENT
  assert.equal(altLower("éa"), "éA");
});

test("German sharp s uppercases to SS", () => {
  assert.equal(toUpper("straße"), "STRASSE");
  assert.equal(toLower("STRASSE"), "strasse");
});

test("locale-independent (no Turkish dotless i surprises)", () => {
  assert.equal(toUpper("istanbul"), "ISTANBUL");
  assert.equal(toLower("I"), "i");
});

test("empty and whitespace-only input", () => {
  for (const fn of [toUpper, toLower, altLower, altUpper]) {
    assert.equal(fn(""), "");
    assert.equal(fn("  \n\t"), "  \n\t");
  }
});

test("countChars counts graphemes", () => {
  assert.equal(countChars(""), 0);
  assert.equal(countChars("abc"), 3);
  assert.equal(countChars("👨‍👩‍👧"), 1);
  assert.equal(countChars("é"), 1);
});

test("countWords splits on any whitespace", () => {
  assert.equal(countWords(""), 0);
  assert.equal(countWords("   "), 0);
  assert.equal(countWords("one"), 1);
  assert.equal(countWords("  one two\nthree\tfour  "), 4);
});
