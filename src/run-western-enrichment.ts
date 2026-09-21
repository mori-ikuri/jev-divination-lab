import { readFile, mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";

import type { JevNormalizedMethod } from "./contracts/daily-run.js";
import { compareWesternEnrichment } from "./experiments/compare-western-enrichment.js";
import { WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE } from "./fixtures/western-astrology-enriched-fictional.js";
import { normalizeMethodObservation } from "./jev/normalize-method.js";
import { assertPrivateOutputRoot } from "./runtime/private-output.js";
import { deriveExecutionDateKey } from "./runtime/run-date.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readWesternBaseline(value: unknown): JevNormalizedMethod {
  if (!isRecord(value) || !Array.isArray(value.normalizedMethods)) {
    throw new Error("Baseline file must contain a normalizedMethods array.");
  }
  const method = value.normalizedMethods.find(
    (candidate) => isRecord(candidate) && candidate.methodId === "western_astrology",
  );
  if (!method) {
    throw new Error("Baseline file does not contain western_astrology normalization.");
  }
  if (!isRecord(method.domains) || !isRecord(method.rawResponse)) {
    throw new Error("Baseline western_astrology result is missing domains or rawResponse.");
  }
  return method as unknown as JevNormalizedMethod;
}

async function main(): Promise<void> {
  const configuredOutputRoot = process.env.DAILY_RUN_OUTPUT_ROOT;
  if (!configuredOutputRoot) {
    throw new Error("DAILY_RUN_OUTPUT_ROOT is required and must point outside the repository.");
  }
  const executionTimezone = process.env.DAILY_RUN_EXECUTION_TIMEZONE;
  if (!executionTimezone) {
    throw new Error(
      "DAILY_RUN_EXECUTION_TIMEZONE is required and must be an IANA timezone such as Asia/Tokyo.",
    );
  }
  const configuredBaselinePath = process.env.DAILY_RUN_BASELINE_PATH;
  if (!configuredBaselinePath) {
    throw new Error(
      "DAILY_RUN_BASELINE_PATH is required and must point to a private Daily Run JSON artifact.",
    );
  }

  const repositoryRoot = resolve(process.cwd());
  const outputRoot = assertPrivateOutputRoot(repositoryRoot, configuredOutputRoot);
  const baselinePath = resolve(configuredBaselinePath);
  assertPrivateOutputRoot(repositoryRoot, dirname(baselinePath));

  const baselineDocument = JSON.parse(await readFile(baselinePath, "utf8")) as unknown;
  const baselineMethod = readWesternBaseline(baselineDocument);
  const experimentalMethod = await normalizeMethodObservation(
    WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE,
  );
  const comparison = compareWesternEnrichment(baselineMethod, experimentalMethod);

  const executionTimestamp = new Date().toISOString();
  const executionDate = deriveExecutionDateKey({ executionTimestamp, executionTimezone });
  const experimentId = `western-enrichment-v0.1-${executionTimestamp.replace(/[:.]/g, "-")}`;
  const artifact = {
    schemaVersion: "western-enrichment-v0.1",
    experimentId,
    executionTimestamp,
    executionDate,
    executionTimezone,
    baselineSourceFile: basename(baselinePath),
    baselineMethod,
    experimentalObservation: WESTERN_ASTROLOGY_ENRICHED_FICTIONAL_FIXTURE,
    experimentalMethod,
    comparison,
  } as const;

  const outputDirectory = resolve(outputRoot, executionDate);
  const outputPath = resolve(outputDirectory, `${experimentId}.json`);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });

  console.log(
    JSON.stringify(
      {
        experimentId,
        outputPath,
        baselineSourceFile: artifact.baselineSourceFile,
        returnedModel: experimentalMethod.rawResponse.model,
        httpStatus: experimentalMethod.transport.httpStatus,
        comparison,
      },
      null,
      2,
    ),
  );
}

await main();
