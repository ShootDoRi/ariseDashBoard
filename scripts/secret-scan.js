import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([".git", "node_modules", "dist", "dist-ssr"]);
const ignoredFiles = new Set(["package-lock.json", "yarn.lock"]);
const patterns = [
  { name: "Google API key", regex: /AIza[0-9A-Za-z_-]{35}/g },
  {
    name: "Google Sheets URL",
    regex: /docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]+/g,
  },
  {
    name: "Hardcoded spreadsheet id",
    regex: /\b(?:SPREADSHEET_ID|spreadsheetId|sheetId)\b\s*[:=]\s*["']1[A-Za-z0-9_-]{20,}["']/g,
  },
];

function listFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      return ignoredDirs.has(entry) ? [] : listFiles(fullPath);
    }
    return ignoredFiles.has(entry) ? [] : [fullPath];
  });
}

const findings = [];
for (const file of listFiles(root)) {
  const content = readFileSync(file, "utf8");
  for (const pattern of patterns) {
    const matches = content.match(pattern.regex);
    if (matches) {
      findings.push(`${relative(root, file)}: ${pattern.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Secret scan failed:");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exitCode = 1;
} else {
  console.log("Secret scan passed.");
}
