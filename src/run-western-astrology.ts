import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import type { DailyRun } from "./contracts/daily-run.js";
import { computeConsensus } from "./consensus/compute-consensus.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "./fixtures/western-astrology-fictional.js";
import { normalizeMethodObservation } from "./jev/normalize-method.js";
import { assertPrivateOutputRoot } from "./runtime/private-output.js";
import { deriveExecutionDateKey } from "./runtime/run-date.js";

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

  const repositoryRoot = resolve(process.cwd());
  const outputRoot = assertPrivateOutputRoot(repositoryRoot, configuredOutputRoot);

  const normalized = await normalizeMethodObservation(WESTERN_ASTROLOGY_FICTIONAL_FIXTURE);
  const consensus = computeConsensus([normalized]);
  const executionTimestamp = new Date().toISOString();
  const executionDate = deriveExecutionDateKey({
    executionTimestamp,
    executionTimezone,
  });
  const runId = `daily-v0.1-western-fictional-${executionTimestamp.replace(/[:.]/g, "-")}`;
  const run: DailyRun = {
    schemaVersion: "0.1",
    runId,
    executionTimestamp,
    executionDate,
    executionTimezone,
    targetDate: WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.targetDate,
    targetTimezone: WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.targetTimezone,
    subject: WESTERN_ASTROLOGY_FICTIONAL_FIXTURE.subject,
    observations: [WESTERN_ASTROLOGY_FICTIONAL_FIXTURE],
    normalizedMethods: [normalized],
    consensus,
  };

  const outputDirectory = resolve(outputRoot, executionDate);
  const outputPath = resolve(outputDirectory, `${runId}.json`);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(run, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });

  console.log(
    JSON.stringify(
      {
        runId,
        outputPath,
        executionTimestamp,
        executionDate,
        executionTimezone,
        targetDate: run.targetDate,
        targetTimezone: run.targetTimezone,
        methodId: normalized.methodId,
        requestedModel: normalized.requestedModel,
        returnedModel: normalized.rawResponse.model,
        httpStatus: normalized.transport.httpStatus,
        domains: Object.fromEntries(
          Object.entries(normalized.domains).map(([domain, signal]) => [
            domain,
            {
              direction: signal.direction.value,
              relevance: signal.relevance.value,
            },
          ]),
        ),
        primarySignal: consensus.primarySignal,
        bestFocus: consensus.bestFocus,
        cautionFocus: consensus.cautionFocus,
        decisionReadiness: consensus.decisionReadiness,
        actionReadiness: consensus.actionReadiness,
        socialOpenness: consensus.socialOpenness,
        changeReadiness: consensus.changeReadiness,
        riskLevel: consensus.riskLevel,
        hasIntradayTimingSignal: consensus.hasIntradayTimingSignal,
        intradayDirections: consensus.intradayDirections ?? null,
        evidenceConfidenceMean: consensus.evidenceConfidenceMean,
        usage: normalized.rawResponse.usage,
      },
      null,
      2,
    ),
  );
}

await main();
