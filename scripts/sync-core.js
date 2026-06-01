import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

export function syncRows(rows, config) {
  const data = mapRows(rows, config);
  if (!config.outputPath) {
    throw new Error("outputPath is required.");
  }
  const outputPath = writeJsonFile(config.outputPath, data);
  return {
    data,
    outputPath,
  };
}
