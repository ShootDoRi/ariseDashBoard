import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  extractSpreadsheetIdFromUrl,
  mapRows,
  mergeWeeklyHistory,
  normalizeSpreadsheetId,
  resolveSpreadsheetId,
  syncRows,
} from "../scripts/sync-core.js";

const config = {
  startRow: 2,
  weekLabel: "52주차",
  columnMapping: {
    "순번": 0,
    "인게임_닉": 0,
    "태그": 1,
    "길드레이드_점수": 2,
    "Rank": 3,
  },
  requiredFields: ["순번", "태그", "길드레이드_점수"],
  rank: {
    sourceField: "길드레이드_점수",
    targetField: "Rank",
    order: "desc",
    emptyRankValue: "",
  },
};

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test("extracts spreadsheet id from Google Sheet URL", () => {
  const sheetId = ["1AbCdEf", "GhIjKlMnOpQrStUvWxYz_12345"].join("");
  const url = "https://docs.google.com/spreadsheets/" + `d/${sheetId}/edit#gid=0`;

  assert.equal(extractSpreadsheetIdFromUrl(url), sheetId);
  assert.equal(extractSpreadsheetIdFromUrl(sheetId), "");
  assert.equal(extractSpreadsheetIdFromUrl(""), "");
});

test("ignores placeholder sheet ids and falls back to sheetId", () => {
  const fallbackSheetId = ["1Fallback", "ValidSheetIdForTest_12345"].join("");
  const placeholderUrl =
    "https://docs.google.com/spreadsheets/d/{YOUR_ARISE_GUILD_SHEET_ID}/edit";

  assert.equal(normalizeSpreadsheetId("{YOUR_ARISE_GUILD_SHEET_ID}"), "");
  assert.equal(normalizeSpreadsheetId("YOUR_ARISE_GUILD_SHEET_ID"), "");
  assert.equal(extractSpreadsheetIdFromUrl(placeholderUrl), "");
  assert.equal(
    resolveSpreadsheetId({
      sheetUrl: placeholderUrl,
      sheetId: fallbackSheetId,
    }),
    fallbackSheetId
  );
  assert.equal(
    resolveSpreadsheetId({
      sheetUrl: placeholderUrl,
      sheetId: "YOUR_ARISE_GUILD_SHEET_ID",
    }),
    ""
  );
});

test("maps four-column ARISE rows and removes empty or malformed rows", () => {
  const rows = [
    ["A-001", "KR-ALPHA", "154,200", "4"],
    ["", "", "", ""],
    ["A-002", "", "121,000", "2"],
    ["A-003", "KR-BRAVO", "188,910", "1"],
  ];

  const mapped = mapRows(rows, config);

  assert.equal(mapped.length, 2);
  assert.equal(mapped[0]["순번"], "A-001");
  assert.equal(mapped[0]["인게임_닉"], "A-001");
  assert.equal(mapped[0]["태그"], "KR-ALPHA");
  assert.equal(mapped[0]._originalRowNumber, 2);
  assert.equal(mapped[1]["인게임_닉"], "A-003");
  assert.equal(mapped[1]._originalRowNumber, 5);
});

test("recalculates rank from score and overwrites input rank", () => {
  const rows = [
    ["A-001", "KR-ALPHA", "154,200", "1"],
    ["A-002", "KR-BRAVO", "188,910", "99"],
    ["A-003", "KR-CHARLIE", "188,910", "12"],
    ["A-004", "KR-DELTA", "177,500", "3"],
  ];

  const mapped = mapRows(rows, config);

  assert.equal(mapped[0].Rank, "4");
  assert.equal(mapped[1].Rank, "1");
  assert.equal(mapped[2].Rank, "1");
  assert.equal(mapped[3].Rank, "3");
});

test("merges weekly history by tag and preserves old week keys", () => {
  const currentRows = mapRows(
    [
      ["A-002", "KR-BRAVO", "188,910", "99"],
      ["A-005", "KR-ECHO", "142,330", "5"],
    ],
    config
  );
  const historyRows = [
    {
      "순번": "OLD-002",
      "인게임_닉": "OLD-002",
      "태그": "KR-BRAVO",
      "50주차": "120,000",
      "51주차": "180,000",
    },
    {
      "순번": "A-004",
      "인게임_닉": "A-004",
      "태그": "KR-DELTA",
      "51주차": "177,500",
    },
  ];

  const merged = mergeWeeklyHistory(currentRows, historyRows, config);
  const bravo = merged.find((row) => row["태그"] === "KR-BRAVO");
  const delta = merged.find((row) => row["태그"] === "KR-DELTA");
  const echo = merged.find((row) => row["태그"] === "KR-ECHO");

  assert.equal(merged.length, 3);
  assert.equal(bravo["순번"], "A-002");
  assert.equal(bravo["인게임_닉"], "A-002");
  assert.equal(bravo["50주차"], "120,000");
  assert.equal(bravo["51주차"], "180,000");
  assert.equal(bravo["52주차"], "188,910");
  assert.equal(delta["51주차"], "177,500");
  assert.equal(echo["52주차"], "142,330");
});

test("writes current and weekly history sync outputs", () => {
  const dir = mkdtempSync(join(tmpdir(), "community-dashboard-"));
  const outputPath = join(dir, "sheet_data.json");
  const historyOutputPath = join(dir, "sheet_data_flow_final.json");

  try {
    const historySeed = [
      {
        "순번": "A-001",
        "인게임_닉": "A-001",
        "태그": "KR-ALPHA",
        "51주차": "130,000",
      },
    ];
    writeFileSync(historyOutputPath, `${JSON.stringify(historySeed, null, 2)}\n`, "utf8");

    const result = syncRows(
      [
        ["A-001", "KR-ALPHA", "154,200", "7"],
        ["A-002", "KR-BRAVO", "188,910", "99"],
      ],
      { ...config, outputPath, historyOutputPath }
    );
    const saved = JSON.parse(readFileSync(outputPath, "utf8"));
    const savedHistory = JSON.parse(readFileSync(historyOutputPath, "utf8"));
    const alphaHistory = savedHistory.find((row) => row["태그"] === "KR-ALPHA");

    assert.equal(result.data.length, 2);
    assert.equal(result.historyOutputPath, historyOutputPath);
    assert.equal(saved[0]["인게임_닉"], "A-001");
    assert.equal(saved[0].Rank, "2");
    assert.equal(saved[1].Rank, "1");
    assert.equal(alphaHistory["51주차"], "130,000");
    assert.equal(alphaHistory["52주차"], "154,200");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("keeps current-only sync behavior without weekly history config", () => {
  const dir = mkdtempSync(join(tmpdir(), "community-dashboard-"));
  const outputPath = join(dir, "sheet_data.json");

  try {
    const { weekLabel, ...currentOnlyConfig } = config;
    const result = syncRows(
      [["A-001", "KR-ALPHA", "154,200", "7"]],
      { ...currentOnlyConfig, outputPath }
    );
    const saved = JSON.parse(readFileSync(outputPath, "utf8"));

    assert.equal(result.data.length, 1);
    assert.equal(result.historyOutputPath, undefined);
    assert.equal(saved[0].Rank, "1");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
