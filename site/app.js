import {
  toUpper,
  toLower,
  toAlternatingLowerFirst,
  toAlternatingUpperFirst,
  countChars,
  countWords,
} from "./convert.js";

const converters = {
  upper: toUpper,
  lower: toLower,
  "alt-lower": toAlternatingLowerFirst,
  "alt-upper": toAlternatingUpperFirst,
};

const input = document.getElementById("text");
const counts = document.getElementById("counts");
const status = document.getElementById("status");
const copyButton = document.getElementById("copy");
const clearButton = document.getElementById("clear");

const plural = (n, word) => `${n.toLocaleString()} ${word}${n === 1 ? "" : "s"}`;

function updateCounts() {
  const text = input.value;
  counts.textContent = `${plural(countChars(text), "character")} · ${plural(countWords(text), "word")}`;
}

// Remember how the last button press happened, so mouse users get undo support
// while touch users don't get the on-screen keyboard popped open on every tap.
let lastPointerType = "";
document.addEventListener("pointerdown", (e) => {
  lastPointerType = e.pointerType;
});

// Keep the textarea focused (and its selection visible) when clicking buttons.
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("mousedown", (e) => e.preventDefault());
});

/**
 * Replace input.value[start:end] with `text`. Goes through the browser's editing
 * pipeline when possible so Ctrl/Cmd+Z can undo it.
 */
function replaceRange(start, end, text, useUndo) {
  let done = false;
  if (useUndo) {
    input.focus();
    input.setSelectionRange(start, end);
    done = text
      ? document.execCommand("insertText", false, text)
      : document.execCommand("delete", false);
  }
  if (!done) {
    input.setRangeText(text, start, end, "end");
  }
}

function convert(kind, event) {
  const fn = converters[kind];
  const value = input.value;
  if (!fn || !value) return;

  const { selectionStart, selectionEnd } = input;
  const hasSelection = selectionStart !== selectionEnd;
  const start = hasSelection ? selectionStart : 0;
  const end = hasSelection ? selectionEnd : value.length;

  const original = value.slice(start, end);
  const converted = fn(original);
  if (converted === original) return;

  const viaMouse = lastPointerType === "mouse" && event.detail > 0;
  const useUndo = viaMouse || document.activeElement === input;
  replaceRange(start, end, converted, useUndo);

  if (hasSelection) {
    input.setSelectionRange(start, start + converted.length);
  } else {
    const caret = Math.min(selectionStart, input.value.length);
    input.setSelectionRange(caret, caret);
  }
  updateCounts();
}

document.querySelectorAll("[data-case]").forEach((button) => {
  button.addEventListener("click", (e) => convert(button.dataset.case, e));
});

let statusTimer;
function announce(message) {
  status.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    status.textContent = "";
    copyButton.textContent = "Copy";
  }, 1500);
}

function flashCopied(label) {
  copyButton.textContent = label;
  announce(label);
}

copyButton.addEventListener("click", async () => {
  const text = input.value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    flashCopied("Copied!");
  } catch {
    // Fallback for browsers without the async clipboard API.
    const { selectionStart, selectionEnd } = input;
    input.select();
    const ok = document.execCommand("copy");
    input.setSelectionRange(selectionStart, selectionEnd);
    flashCopied(ok ? "Copied!" : "Copy failed");
  }
});

clearButton.addEventListener("click", () => {
  if (!input.value) return;
  replaceRange(0, input.value.length, "", true);
  updateCounts();
  announce("Cleared");
});

input.addEventListener("input", updateCounts);
updateCounts();
