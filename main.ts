import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Setup: the familiar office grievance.
const SETUP = "The printer only jams for people with a deadline, ";
// Kicker: the "evidence" that the printer is doing it on purpose.
const KICKER = "which is how we know it can read the calendar.";
const ENTRY = SETUP + KICKER;

// Spec (program/v1): 1-199 code points, a single line, not whitespace-only.
const MIN_CODE_POINTS = 1;
const MAX_CODE_POINTS = 199;
// Any character that could start a new line: LF, VT, FF, CR, NEL, LS, PS.
const LINE_BREAK = /[\n\v\f\r\u0085\u2028\u2029]/u;

function validate(text: string): void {
  const length = [...text].length; // count code points, not UTF-16 units
  if (length < MIN_CODE_POINTS || length > MAX_CODE_POINTS) {
    throw new Error(
      `entry must be ${MIN_CODE_POINTS}-${MAX_CODE_POINTS} code points, got ${length}`,
    );
  }
  if (LINE_BREAK.test(text)) {
    throw new Error("entry must be a single line (no line breaks)");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be empty or whitespace-only");
  }
}

validate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
// Exactly one line: the entry plus a single trailing newline.
writeFileSync(join(outDir, "entry.txt"), ENTRY + "\n", "utf8");
