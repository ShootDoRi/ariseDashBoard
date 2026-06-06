import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function loadSyncConfig(configPath) {
  const resolvedPath = resolve(configPath);
  const config = readJsonFile(resolvedPath);
  return {
    ...config,
    configPath: resolvedPath,
  };
}

export function getCell(row, selector) {
  if (row == null) return "";
  const value = Array.isArray(row) ? row[selector] : row[selector];
  return value == null ? "" : String(value).trim();
}

export function parseScore(value) {
  if (value == null || value === "") return Number.NaN;
  return Number(String(value).replace(/,/g, ""));
}

export function normalizeSpreadsheetId(value) {
  if (!value) return "";

  const id = String(value).trim();
  if (!id || /[{}]/.test(id) || id.toUpperCase().includes("YOUR_")) {
    return "";
  }
  return id;
}

export function extractSpreadsheetIdFromUrl(sheetUrl) {
  if (!sheetUrl) return "";

  const value = String(sheetUrl).trim();
  const matchPath = (path) => {
    const match = path.match(/\/spreadsheets\/d\/([^/?#]+)/);
    return match ? normalizeSpreadsheetId(decodeURIComponent(match[1])) : "";
  };

  try {
    const url = new URL(value);
    return matchPath(url.pathname);
  } catch {
    return matchPath(value);
  }
}

export function resolveSpreadsheetId(config = {}) {
  return extractSpreadsheetIdFromUrl(config.sheetUrl) || normalizeSpreadsheetId(config.sheetId);
}

export function isMappedRowEmpty(row, fields) {
  return fields.every((field) => String(row[field] ?? "").trim() === "");
}

export function hasRequiredFields(row, requiredFields) {
  return requiredFields.every((field) => String(row[field] ?? "").trim() !== "");
}

export function applyRanking(rows, rankConfig = {}) {
  if (!rankConfig.sourceField) return rows;

  const targetField = rankConfig.targetField || "Rank";
  const order = rankConfig.order === "asc" ? 1 : -1;
  const rankedRows = rows.map((row) => ({ ...row }));
  const sortable = rankedRows
    .map((row, index) => ({
      row,
      index,
      value: parseScore(row[rankConfig.sourceField]),
    }))
    .filter((entry) => !Number.isNaN(entry.value));

  sortable.sort((a, b) => {
    const diff = (a.value - b.value) * order;
    return diff === 0 ? a.index - b.index : diff;
  });

  let previousValue;
  let currentRank = 0;
  sortable.forEach((entry, position) => {
    if (previousValue !== entry.value) {
      currentRank = position + 1;
      previousValue = entry.value;
    }
    entry.row[targetField] = String(currentRank);
  });

  if (rankConfig.emptyRankValue !== undefined) {
    rankedRows.forEach((row) => {
      if (Number.isNaN(parseScore(row[rankConfig.sourceField]))) {
        row[targetField] = rankConfig.emptyRankValue;
      }
    });
  }

  return rankedRows;
}

export function mapRows(rows, config) {
  const columnMapping = config.columnMapping || {};
  const fields = Object.keys(columnMapping);

  if (fields.length === 0) {
    throw new Error("columnMapping must define at least one output field.");
  }

  const requiredFields = config.requiredFields || [fields[0]];
  const startRow = Number(config.startRow || 1);
  const mappedRows = rows.map((row, index) => {
    const mapped = {};
    fields.forEach((field) => {
      mapped[field] = getCell(row, columnMapping[field]);
    });
    mapped._originalRowNumber = startRow + index;
    return mapped;
  });

  const validRows = mappedRows.filter((row) => {
    if (config.skipEmptyRows !== false && isMappedRowEmpty(row, fields)) {
      return false;
    }
    return hasRequiredFields(row, requiredFields);
  });

  return applyRanking(validRows, config.rank);
}

export function writeJsonFile(filePath, data) {
  const resolvedPath = resolve(filePath);
  mkdirSync(dirname(resolvedPath), { recursive: true });
  writeFileSync(resolvedPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return resolvedPath;
}

export function mergeWeeklyHistory(currentRows, historyRows = [], config = {}) {
  const weekLabel = String(config.weekLabel || "").trim();
  if (!weekLabel) return historyRows;

  const scoreField = config.rank?.sourceField || "길드레이드_점수";
  const unkeyedRows = [];
  const byTag = new Map();

  historyRows.forEach((row) => {
    const tag = String(row?.["태그"] ?? "").trim();
    if (tag) {
      byTag.set(tag, { ...row });
    } else {
      unkeyedRows.push({ ...row });
    }
  });

  currentRows.forEach((row) => {
    const tag = String(row?.["태그"] ?? "").trim();
    if (!tag) return;

    const previous = byTag.get(tag) || {};
    const next = { ...previous };
    ["순번", "인게임_닉", "태그"].forEach((field) => {
      if (row[field] !== undefined && row[field] !== null && String(row[field]).trim() !== "") {
        next[field] = row[field];
      }
    });
    next[weekLabel] = row[scoreField] ?? "";
    byTag.set(tag, next);
  });

  return [...unkeyedRows, ...byTag.values()];
}

export function syncRows(rows, config) {
  const data = mapRows(rows, config);
  if (!config.outputPath) {
    throw new Error("outputPath is required.");
  }
  const outputPath = writeJsonFile(config.outputPath, data);
  const result = {
    data,
    outputPath,
  };

  if (config.weekLabel && config.historyOutputPath) {
    const resolvedHistoryPath = resolve(config.historyOutputPath);
    const historyRows = existsSync(resolvedHistoryPath) ? readJsonFile(resolvedHistoryPath) : [];
    const historyData = mergeWeeklyHistory(data, historyRows, config);
    result.historyOutputPath = writeJsonFile(resolvedHistoryPath, historyData);
    result.historyData = historyData;
  }

  return result;
}
