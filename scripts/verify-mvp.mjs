import { spawn } from "node:child_process";
import net from "node:net";

const host = "127.0.0.1";
const basePort = 3201;

async function getAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 30; port += 1) {
    const available = await new Promise((resolve) => {
      const server = net.createServer();

      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port, host);
    });

    if (available) {
      return port;
    }
  }

  throw new Error("No available verification port found.");
}

async function waitForServer(baseUrl) {
  const deadline = Date.now() + 30_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);

      if (response.ok) {
        return;
      }

      lastError = new Error(`Server returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw lastError ?? new Error("Timed out waiting for dev server.");
}

function assertIncludes(body, expected, label) {
  if (!body.includes(expected)) {
    throw new Error(`${label} is missing expected text: ${expected}`);
  }
}

function assertTitle(body, expected, label) {
  assertIncludes(body, `<title>${expected}</title>`, label);
}

function assertH1(body, expected, label) {
  const h1Matches = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  const h1Texts = h1Matches.map((match) =>
    match[1]
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );

  if (h1Texts.length !== 1 || h1Texts[0] !== expected) {
    throw new Error(
      `${label} should have one h1 with text: ${expected}`,
    );
  }
}

function assertSingleH1(body, label) {
  const h1Matches = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];

  if (h1Matches.length !== 1) {
    throw new Error(`${label} should have exactly one h1`);
  }
}

function assertIncludesAny(body, expectedList, label) {
  if (!expectedList.some((expected) => body.includes(expected))) {
    throw new Error(
      `${label} is missing one of expected texts: ${expectedList.join(" | ")}`,
    );
  }
}

function assertExcludes(body, forbiddenList, label) {
  const found = forbiddenList.filter((forbidden) => body.includes(forbidden));

  if (found.length > 0) {
    throw new Error(`${label} includes forbidden text: ${found.join(" | ")}`);
  }
}

async function fetchPage(baseUrl, path, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`);
  const body = await response.text();

  if (response.status !== expectedStatus) {
    throw new Error(
      `${path} returned ${response.status}, expected ${expectedStatus}`,
    );
  }

  return body;
}

async function main() {
  const port = await getAvailablePort(basePort);
  const baseUrl = `http://${host}:${port}`;
  const publicForbiddenTerms = [
    "DB 연결",
    "환경변수",
    "Supabase",
    "실제 저장 지원",
    "Latest Links",
    "필터 결과",
    "집집 샘플 브리프",
    "부동산 레이더",
    "Budongsan Radar",
    "RADAR",
    "레이더 점수",
    "시장 온도",
    "신호 테이프",
    "MVP",
    "중요도 높음 ·",
    "중요도 보통 ·",
    "중요도 낮음 ·",
  ];
  const server = spawn(
    "npm",
    ["run", "start", "--", "--hostname", host, "--port", String(port)],
    {
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let serverOutput = "";

  server.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer(baseUrl);

    const home = await fetchPage(baseUrl, "/");
    assertTitle(home, "집집", "home");
    assertSingleH1(home, "home");
    assertIncludes(home, "집집", "home");
    assertIncludes(home, "오늘의 시장지도", "home");
    assertIncludes(home, "뉴스가 어디를 흔드는지 먼저 봅니다", "home");
    assertIncludes(home, "오늘의 판세", "home");
    assertIncludes(home, "실제 수집", "home");
    assertIncludes(home, "지금 뜨는 이슈", "home");
    assertIncludes(home, "강한 신호", "home");
    assertIncludes(home, "전체 이슈", "home");
    assertIncludes(home, "중요도", "home");
    assertIncludes(home, "오늘의 집픽", "home");
    assertIncludes(home, "내 상황별 영향", "home");
    assertIncludes(home, "지역 흐름", "home");
    assertIncludes(home, "이슈 압력", "home");
    assertIncludes(home, "오늘 볼 이슈", "home");
    assertIncludes(home, "꼭 보기", "home");
    assertIncludes(home, "세입자가 오늘 볼 것", "home");
    assertIncludes(home, "전세 안전 체크", "home");
    assertExcludes(home, publicForbiddenTerms, "home");

    const filtered = await fetchPage(
      baseUrl,
      "/?category=%EC%A0%95%EC%B1%85&region=%EC%A0%84%EA%B5%AD",
    );
    assertIncludes(filtered, "filter-chip-active", "filtered home");
    assertIncludes(filtered, "관심 기준", "filtered home");

    const emptyFiltered = await fetchPage(
      baseUrl,
      "/?category=%EA%B2%BD%EB%A7%A4&region=%EC%84%9C%EC%9A%B8",
    );
    assertIncludes(emptyFiltered, "아직 맞는 이슈가 없습니다", "empty filtered home");
    assertIncludes(emptyFiltered, "전체 보기", "empty filtered home");
    assertExcludes(emptyFiltered, publicForbiddenTerms, "empty filtered home");

    const briefing = await fetchPage(baseUrl, "/briefing");
    assertTitle(briefing, "집집 브리프 | 집집", "briefing");
    assertH1(briefing, "오늘 볼 부동산 이슈만 모았습니다", "briefing");
    assertIncludes(briefing, "집집 브리프", "briefing");
    assertIncludes(briefing, "오늘 볼 부동산 이슈만 모았습니다", "briefing");
    assertExcludes(briefing, publicForbiddenTerms, "briefing");

    const detail = await fetchPage(baseUrl, "/links/policy-loan-rule-watch");
    assertTitle(detail, "대출 완화 기대, 월상환액 먼저 | 집집", "detail");
    assertH1(detail, "대출 완화 기대, 월상환액 먼저", "detail");
    assertIncludes(detail, "집집 해석", "detail");
    assertIncludes(detail, "먼저 볼 3줄", "detail");
    assertIncludes(detail, "왜 중요한가", "detail");
    assertIncludes(detail, "공식 근거", "detail");
    assertIncludes(detail, "근거 데이터", "detail");
    assertIncludes(detail, "아직 모르는 것", "detail");
    assertIncludes(detail, "영향 대상", "detail");
    assertIncludes(detail, "다음에 볼 것", "detail");
    assertIncludes(detail, "원문 열기", "detail");
    assertIncludes(detail, "지역 브리프", "detail");
    assertIncludesAny(
      detail,
      ["실제 기사, 투자 조언", "투자 조언, 매수/매도 추천이 아닙니다"],
      "detail",
    );
    assertExcludes(detail, publicForbiddenTerms, "detail");

    const region = await fetchPage(baseUrl, "/regions/seoul");
    assertTitle(region, "서울 집값 뉴스 브리프 | 집집", "region");
    assertH1(region, "서울 집값 뉴스 브리프", "region");
    assertIncludes(region, "지역 브리프", "region");
    assertIncludes(region, "내 상황별 영향", "region");
    assertIncludes(region, "단지 맥락", "region");
    assertIncludes(region, "전세 안전 체크", "region");
    assertExcludes(region, publicForbiddenTerms, "region");

    const complex = await fetchPage(baseUrl, "/complexes/seoul-sample-core");
    assertTitle(complex, "서울 핵심입지 표본 단지 단지 브리프 | 집집", "complex");
    assertH1(complex, "서울 핵심입지 표본 단지 단지 브리프", "complex");
    assertIncludes(complex, "전세 안전 체크", "complex");
    assertIncludes(complex, "집집 단지 모델", "complex");
    assertIncludes(complex, "연결된 이슈", "complex");
    assertExcludes(complex, publicForbiddenTerms, "complex");

    const jeonseCheck = await fetchPage(baseUrl, "/tools/jeonse-check");
    assertTitle(jeonseCheck, "전세 안전 체크 | 집집", "jeonse check");
    assertH1(jeonseCheck, "전세 안전 체크", "jeonse check");
    assertIncludes(jeonseCheck, "보증보험 가능성", "jeonse check");
    assertIncludes(jeonseCheck, "선순위 채권", "jeonse check");
    assertIncludes(jeonseCheck, "지역별 전세 관점", "jeonse check");
    assertExcludes(jeonseCheck, publicForbiddenTerms, "jeonse check");

    const submit = await fetchPage(baseUrl, "/submit");
    assertTitle(submit, "이슈 제보 | 집집", "submit");
    assertH1(submit, "같이 볼 부동산 링크를 보내주세요", "submit");
    assertIncludes(submit, "같이 볼 부동산 링크를 보내주세요", "submit");
    assertIncludes(submit, "링크 정보", "submit");
    assertIncludes(submit, "제보에 필요한 것", "submit");
    assertIncludes(submit, "로그인 후 제보하기", "submit");
    assertIncludes(submit, "제보 기준", "submit");
    assertExcludes(submit, publicForbiddenTerms, "submit");

    const login = await fetchPage(baseUrl, "/login");
    assertTitle(login, "집집", "login");
    assertH1(login, "저장한 브리프를 이어서 봅니다", "login");
    assertIncludes(login, "저장한 브리프를 이어서 봅니다", "login");
    assertIncludes(login, "이메일로 로그인", "login");
    assertIncludes(login, "브리프 이어보기", "login");
    assertIncludes(login, "로그인하면", "login");
    assertExcludes(login, publicForbiddenTerms, "login");

    const admin = await fetchPage(baseUrl, "/admin");
    assertTitle(admin, "운영 큐 | 집집", "admin");
    assertH1(admin, "집집 운영 큐", "admin");
    assertIncludes(admin, "집집 운영 큐", "admin");
    assertIncludes(admin, "운영자", "admin");
    assertExcludes(admin, publicForbiddenTerms, "admin");

    const missing = await fetchPage(
      baseUrl,
      "/links/not-existing-id",
      404,
    );
    assertIncludes(missing, "이슈를 찾을 수 없습니다", "not-found");
    assertIncludes(missing, "집집 브리프로 이동", "not-found");
    assertExcludes(missing, publicForbiddenTerms, "not-found");

    console.log(`Jipjip route smoke passed at ${baseUrl}`);
  } catch (error) {
    console.error(serverOutput);
    throw error;
  } finally {
    server.kill("SIGTERM");
  }
}

await main();
