import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  loadSyncConfig,
  mapRowsWithWarnings,
  readJsonFile,
  resolveSpreadsheetId,
  syncRows,
} from "./sync-core.js";

function parseArgs(argv) {
  const args = {
    config: process.env.COMMUNITY_DASHBOARD_CONFIG || "community-dashboard.config.json",
    input: undefined,
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--config" || arg === "-c") {
      args.config = argv[index + 1];
      index += 1;
    } else if (arg === "--input" || arg === "-i") {
      args.input = argv[index + 1];
      index += 1;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: npm run sync -- --config community-dashboard.config.json

Options:
  -c, --config <path>   Config JSON path. Defaults to community-dashboard.config.json.
  -i, --input <path>    Local JSON rows for offline/sample sync.
      --dry-run         Parse and map data without writing output.
  -h, --help            Show this help text.

Set GOOGLE_SHEETS_API_KEY when syncing directly from Google Sheets.`);
}

function formatSchemaWarning(warning) {
  const row = Number.isInteger(warning.rowNumber) ? ` row ${warning.rowNumber}` : "";
  return `Schema warning [${warning.code}]${row} field ${warning.field}`;
}

function printSchemaWarnings(warnings = []) {
  warnings.forEach((warning) => {
    console.error(formatSchemaWarning(warning));
  });
}

async function fetchGoogleSheetRows(config) {
  const apiKeyEnv = config.apiKeyEnv || "GOOGLE_SHEETS_API_KEY";
  const apiKey = process.env[apiKeyEnv];
  const spreadsheetId = resolveSpreadsheetId(config);

  if (!apiKey) {
    throw new Error(`Missing ${apiKeyEnv}. Add it to your shell or .env file before syncing Google Sheets.`);
  }
  if (!spreadsheetId || !config.range) {
    throw new Error("sheetUrl or sheetId, plus range, are required when no local input file is provided.");
  }

  const { google } = await import("googleapis");
  const sheets = google.sheets({ version: "v4", auth: apiKey });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: config.range,
  });

  return response.data.values || [];
}

export async function runSyncFromCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return { data: [], outputPath: null };
  }

  const configPath = resolve(args.config);
  if (!existsSync(configPath)) {
    throw new Error(`Config file not found: ${configPath}. Copy community-dashboard.config.example.json first.`);
  }

  const config = loadSyncConfig(configPath);
  const inputPath = args.input || config.inputPath;
  const rows = inputPath ? readJsonFile(resolve(inputPath)) : await fetchGoogleSheetRows(config);

  if (args.dryRun) {
    const { data, warnings } = mapRowsWithWarnings(rows, config);
    printSchemaWarnings(warnings);
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
    return { data, warnings, outputPath: null };
  }

  const result = syncRows(rows, config);
  printSchemaWarnings(result.warnings);
  console.log(`Synced ${result.data.length} rows for ${config.boardName || "community board"}.`);
  console.log(`Wrote ${result.outputPath}.`);
  if (result.historyOutputPath) {
    console.log(`Wrote ${result.historyOutputPath}.`);
  }
  return result;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSyncFromCli().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
