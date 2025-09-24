import { google } from "googleapis";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// ES 모듈에서 __filename, __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 구글 시트 정보
//const SPREADSHEET_ID = "1yWA5vk9WyQJeRscy7gaatfkZXFBerLwI93IlWIN9WZs";
//1XYHDDyck67QiJ21eSPK0KJzgOWJv3LevmbXeo4ULDI8
//1_8Ynu49HQd8DvP9G1d2QZlyjdgDpty9DZIulDHFGWb8
//const SPREADSHEET_ID = "1jchqeRaDaxtwSv86vTPKJgwKzt6yyV5_A8WBEgmxIGM";
const SPREADSHEET_ID = "1_8Ynu49HQd8DvP9G1d2QZlyjdgDpty9DZIulDHFGWb8";
const RANGE = "2025-09-25 (업데이트중)!A5:N54"; // A9부터 J58까지 (9행부터 데이터)
const API_KEY = "AIzaSyCjMpvOtzX2IY6DIHL7rfbWlJ7pZwuEcYM";

// 컬럼 매핑 정의 (9번째 행부터 데이터로 처리)
const COLUMN_MAPPING = {
  순번: 0, // A열
  인게임_닉: 1, // B열
  태그: 2,
  직위: 3, // E열
  배틀클래스: 4, // F열
  길드레이드_점수: 10, // O열
  격노: 12, // P열
  //Rank: 8,
};

async function fetchSheetData() {
  console.log("=== 구글 시트 데이터 가져오기 시작 ===");
  console.log("SPREADSHEET_ID:", SPREADSHEET_ID);
  console.log("RANGE:", RANGE);
  console.log("API_KEY 앞 10글자:", API_KEY.substring(0, 10) + "...");

  try {
    console.log("Google Sheets API 클라이언트 생성 중...");

    // Google Sheets API 클라이언트 생성
    const sheets = google.sheets({
      version: "v4",
      auth: API_KEY,
    });

    console.log("API 요청 전송 중...");

    // 시트 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    console.log("API 응답 받음");
    console.log("응답 상태:", response.status);

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      console.log("❌ 데이터가 없습니다.");
      return;
    }

    console.log(`✅ ${rows.length}개의 행을 가져왔습니다.`);
    console.log("9번째 행부터 모든 데이터를 처리합니다.");

    // 9번째 행부터 모든 행을 데이터로 처리 (헤더 없음)
    const dataRows = rows; // 모든 행을 데이터로 처리

    console.log(`데이터 행 수: ${dataRows.length}`);

    // 지정된 컬럼들만 추출하여 JSON 객체로 변환
    /* const extractedData = dataRows.map((row, index) => {
      const obj = {};

      // 각 필드별로 지정된 컬럼에서 데이터 추출
      Object.entries(COLUMN_MAPPING).forEach(([fieldName, columnIndex]) => {
        obj[fieldName] = row[columnIndex] || "";
      });

      // 원본 행 번호 추가 (9번째 행부터 시작)
      obj._originalRowNumber = 9 + index;

      return obj;
    }); */
    const extractedData = dataRows.map((row, index) => {
      const obj = {};

      // 각 필드별로 지정된 컬럼에서 데이터 추출
      Object.entries(COLUMN_MAPPING).forEach(([fieldName, columnIndex]) => {
        let value = row[columnIndex] || "";
        // 인게임_닉이 🇬🇴🇷🇦🇳🇮 이면 GORANI로 치환
        if (fieldName === "인게임_닉" && value === "🇬🇴🇷🇦🇳🇮") {
          value = "GORANI";
        }
        obj[fieldName] = value;
      });

      // 원본 행 번호 추가 (9번째 행부터 시작)
      obj._originalRowNumber = 9 + index;

      return obj;
    });

    console.log("데이터 추출 완료, 총 행 수:", extractedData.length);

    // 빈 행 제거 (순번이 비어있는 행 제거)
    const cleanData = extractedData.filter((row) => {
      return row["순번"] && row["순번"].toString().trim() !== "";
    });

    console.log(`유효한 데이터: ${cleanData.length}개 행`);

    if (cleanData.length === 0) {
      console.log("❌ 유효한 데이터가 없습니다.");
      console.log("원본 데이터 샘플:", JSON.stringify(extractedData.slice(0, 3), null, 2));
      return;
    }

    // 길드레이드_점수 기준으로 Rank 계산 및 추가
    const dataWithRank = cleanData
      .map((row) => ({
        ...row,
        길드레이드_점수: Number(row["길드레이드_점수"]?.toString().replace(/,/g, "") || 0),
      }))
      .sort((a, b) => b.길드레이드_점수 - a.길드레이드_점수) // 내림차순 정렬
      .map((row, index) => ({
        ...row,
        Rank: index + 1, // 1등부터 시작
        길드레이드_점수: row.길드레이드_점수.toLocaleString(), // 다시 콤마 포맷으로 변환
      }))
      .sort((a, b) => Number(a.순번) - Number(b.순번)); // 원래 순번 순서로 재정렬

    console.log("Rank 계산 완료");

    // src/json 폴더 생성 (없으면 생성)
    const jsonDir = join(__dirname, "src", "json/ntr");
    try {
      mkdirSync(jsonDir, { recursive: true });
      console.log("📁 디렉토리 생성/확인 완료:", jsonDir);
    } catch (dirError) {
      console.warn("디렉토리 생성 중 경고:", dirError.message);
    }

    // JSON 파일로 저장
    const outputFile = join(jsonDir, "sheet_data.json");
    console.log("저장할 파일 경로:", outputFile);

    try {
      //writeFileSync(outputFile, JSON.stringify(cleanData, null, 2), "utf8");
      writeFileSync(outputFile, JSON.stringify(dataWithRank, null, 2), "utf8");
      console.log(`✅ 데이터가 ${outputFile}에 저장되었습니다.`);
    } catch (writeError) {
      console.error("❌ 파일 저장 중 오류:", writeError.message);
      return;
    }

    // 콘솔에 처음 3개 행 출력
    console.log("\n=== 처음 3개 행 미리보기 ===");
    console.log(JSON.stringify(dataWithRank.slice(0, 3), null, 2));

    console.log("\n=== 통계 ===");
    console.log(`총 행 수: ${dataWithRank.length}`);
    console.log(`추출된 필드: ${Object.keys(COLUMN_MAPPING).join(", ")}`);
    console.log(`첫 번째 데이터의 원본 행 번호: ${dataWithRank.length > 0 ? dataWithRank[0]._originalRowNumber : "N/A"}`);

    return dataWithRank;
  } catch (error) {
    console.error("❌ 오류 발생:");
    console.error("오류 메시지:", error.message);
    console.error("오류 코드:", error.code);

    if (error.code === 403) {
      console.error("\n🔑 API 키 관련 문제:");
      console.error("1. API 키가 유효하지 않거나 권한이 없습니다.");
      console.error("2. Google Cloud Console에서 API 키를 확인하세요.");
    } else if (error.code === 400) {
      console.error("\n📝 요청 관련 문제:");
      console.error("1. 시트 ID가 올바른지 확인하세요.");
      console.error("2. 범위(A9:P58)가 올바른지 확인하세요.");
    }
  }
}

// ES 모듈에서 메인 스크립트 확인
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("스크립트 시작...");
  fetchSheetData()
    .then(() => {
      console.log("\n✅ 스크립트 완료");
    })
    .catch((error) => {
      console.error("\n❌ 스크립트 실행 중 오류:", error);
    });
}

// 함수 실행 추가
fetchSheetData();

export default { fetchSheetData };
