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
    assertIncludes(home, "오늘 부동산판에서 봐야 할 이슈", "home");
    assertIncludes(home, "샘플 데이터", "home");
    assertIncludes(home, "DB/OpenAI 미연동", "home");

    const filtered = await fetchPage(
      baseUrl,
      "/?category=%EC%A0%95%EC%B1%85&region=%EC%A0%84%EA%B5%AD",
    );
    assertIncludes(filtered, "filter-chip-active", "filtered home");
    assertIncludes(filtered, "대출 규제 완화 기대감", "filtered home");

    const briefing = await fetchPage(baseUrl, "/briefing");
    assertIncludes(briefing, "오늘의 부동산 이슈 10개", "briefing");
    assertIncludes(briefing, "MVP 구조 검증용 데모 콘텐츠", "briefing");

    const detail = await fetchPage(baseUrl, "/links/policy-loan-rule-watch");
    assertIncludes(detail, "3줄 요약", "detail");
    assertIncludes(detail, "왜 중요한가", "detail");
    assertIncludes(detail, "영향 대상", "detail");
    assertIncludes(detail, "실제 기사, 투자 조언", "detail");

    const submit = await fetchPage(baseUrl, "/submit");
    assertIncludes(submit, "링크 제출 데모", "submit");
    assertIncludes(submit, "실제 저장", "submit");

    const missing = await fetchPage(
      baseUrl,
      "/links/not-existing-id",
      404,
    );
    assertIncludes(missing, "이슈를 찾을 수 없습니다", "not-found");

    console.log(`MVP route smoke passed at ${baseUrl}`);
  } catch (error) {
    console.error(serverOutput);
    throw error;
  } finally {
    server.kill("SIGTERM");
  }
}

await main();
