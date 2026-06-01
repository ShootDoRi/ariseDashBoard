import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { mapRows, syncRows } from "../scripts/sync-core.js";

const config = {
  startRow: 2,
  columnMapping: {
    "순번": 0,
    "인게임_닉": 1,
    "태그": 2,
    "직위": 3,
    "배틀클래스": 4,
    "길드레이드_점수": 5,
    "격노": 6,
  },
  requiredFields: ["순번", "인게임_닉"],
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

test("maps configured columns and removes empty or malformed rows", () => {
  const rows = [
    ["1", "Member Alpha", "CM-1001", "Maintainer", "82", "154,200", "152"],
    ["", "", "", "", "", "", ""],
    ["2", "", "CM-1002", "Member", "77", "121,000", "138"],
    ["3", "Member Bravo", "CM-1003", "Member", "79", "188,910", "161"],
  ];

  const mapped = mapRows(rows, config);

  assert.equal(mapped.length, 2);
  assert.equal(mapped[0]["인게임_닉"], "Member Alpha");
  assert.equal(mapped[0]._originalRowNumber, 2);
  assert.equal(mapped[1]["인게임_닉"], "Member Bravo");
  assert.equal(mapped[1]._originalRowNumber, 5);
});

test("calculates competition ranks from configured score field", () => {
  const rows = [
    ["1", "Member Alpha", "CM-1001", "Maintainer", "82", "154,200", "152"],
    ["2", "Member Bravo", "CM-1002", "Member", "79", "188,910", "161"],
    ["3", "Member Charlie", "CM-1003", "Member", "77", "188,910", "161"],
    ["4", "Member Delta", "CM-1004", "Member", "74", "", ""],
  ];

  const mapped = mapRows(rows, config);

  assert.equal(mapped[0].Rank, "3");
  assert.equal(mapped[1].Rank, "1");
  assert.equal(mapped[2].Rank, "1");
  assert.equal(mapped[3].Rank, "");
});

test("writes anonymized sample sync output", () => {
  const dir = mkdtempSync(join(tmpdir(), "community-dashboard-"));
  const outputPath = join(dir, "sheet_data.json");

  try {
    const result = syncRows(
      [["1", "Member Alpha", "CM-1001", "Maintainer", "82", "154,200", "152"]],
      { ...config, outputPath }
    );
    const saved = JSON.parse(readFileSync(outputPath, "utf8"));

    assert.equal(result.data.length, 1);
    assert.equal(saved[0]["인게임_닉"], "Member Alpha");
    assert.equal(saved[0].Rank, "1");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
