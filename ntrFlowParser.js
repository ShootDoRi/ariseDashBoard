import { google } from "googleapis";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SPREADSHEET_ID = "1_8Ynu49HQd8DvP9G1d2QZlyjdgDpty9DZIulDHFGWb8";
const RANGE1 = "2025-07-23!A5:M51"; // 48주차
const RANGE2 = "2025-07-16!A5:M50"; // 47주차
const RANGE3 = "2025-07-09!A5:M54"; // 47주차
const RANGE4 = "2025-07-02!A5:M54"; // 46주차
const RANGE5 = "2025-06-25!A5:M54"; // 45주차
const RANGE6 = "2025-06-18!A5:M54"; // 44주차
const RANGE7 = "2025-06-11!A5:M54"; // 43주차
const RANGE8 = "2025-06-04!A5:M54"; // 42주차
const API_KEY = "AIzaSyCjMpvOtzX2IY6DIHL7rfbWlJ7pZwuEcYM";

const COLUMN_MAPPING = {
  순번: 0,
  인게임_닉: 1,
  태그: 2,
  직위: 3,
  배틀클래스: 4,
  레이드_점수: 10,
  레이드_격노: 12,
};

async function fetchSheetRange(sheets, range, weekLabel) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];
  return rows.map((row, idx) => {
    const obj = {};
    Object.entries(COLUMN_MAPPING).forEach(([field, colIdx]) => {
      if (field === "레이드_격노") {
        obj[weekLabel] = row[colIdx] || "";
      } else {
        obj[field] = row[colIdx] || "";
      }
    });
    obj._originalRowNumber = 5 + idx;
    return obj;
  });
}

async function fetchSheetData() {
  console.log("=== 구글 시트 데이터 가져오기 시작 ===");
  const sheets = google.sheets({ version: "v4", auth: API_KEY });

  // 각 주차별 데이터 가져오기
  const [data8, data7, data6, data5, data4, data3, data2, data1] =
    await Promise.all([
      fetchSheetRange(sheets, RANGE8, "42주차"),
      fetchSheetRange(sheets, RANGE7, "43주차"),
      fetchSheetRange(sheets, RANGE6, "44주차"),
      fetchSheetRange(sheets, RANGE5, "45주차"),
      fetchSheetRange(sheets, RANGE4, "46주차"),
      fetchSheetRange(sheets, RANGE3, "47주차"),
      fetchSheetRange(sheets, RANGE2, "48주차"),
      fetchSheetRange(sheets, RANGE1, "49주차"),
    ]);

  // 모든 데이터 합치기 (주차별로)
  const allData = [
    ...data8,
    ...data7,
    ...data6,
    ...data5,
    ...data4,
    ...data3,
    ...data2,
    ...data1,
  ];

  // 태그 기준으로 병합 (최신 데이터가 마지막에 오도록)
  // 태그 정규화 함수 추가 (병합 기준을 통일)
  function normalizeTag(tag) {
    return (tag || "").replace(/[#\s]/g, "").toUpperCase();
  }

  // 병합 부분 수정
  const mergedMap = new Map();
  allData.forEach((item) => {
    const tag = normalizeTag(item["태그"]);
    if (!tag) return;
    if (!mergedMap.has(tag)) {
      mergedMap.set(tag, { ...item, 태그: tag }); // 태그도 정규화해서 저장
    } else {
      mergedMap.set(tag, { ...mergedMap.get(tag), ...item, 태그: tag });
    }
  });
  const mergedList = Array.from(mergedMap.values());

  // 저장
  const jsonDir = join(__dirname, "src", "json/ntr");
  try {
    mkdirSync(jsonDir, { recursive: true });
  } catch (e) {}
  const outputFile = join(jsonDir, "ntr_merged.json");
  writeFileSync(outputFile, JSON.stringify(mergedList, null, 2), "utf8");
  console.log(`✅ 병합된 데이터가 ${outputFile}에 저장되었습니다.`);
  return mergedList;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  fetchSheetData()
    .then(() => console.log("\n✅ 스크립트 완료"))
    .catch((error) => console.error("\n❌ 스크립트 실행 중 오류:", error));
}

// 함수 실행 추가
fetchSheetData();

export default { fetchSheetData };
