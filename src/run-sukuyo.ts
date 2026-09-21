import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { computeConsensus } from "./consensus/compute-consensus.js";
import type { DailyRun } from "./contracts/daily-run.js";
import { SUKUYO_FICTIONAL_FIXTURE } from "./fixtures/sukuyo-fictional.js";
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

  const outputRoot = assertPrivateOutputRoot(resolve(process.cwd()), configuredOutputRoot);
  const normalized = await normalizeMethodObservation(SUKUYO_FICTIONAL_FIXTURE);
  const consensus = computeConsensus([normalized]);
  const executionTimestamp = new Date().toISOString();
  const executionDate = deriveExecutionDateKey({ executionTimestamp, executionTimezone });
  const runId = `daily-v0.1-sukuyo-fictional-${executionTimestamp.replace(/[:.]/g, "-")}`;
  const run: DailyRun = {
    schemaVersion: "0.1",
    runId,
    executionTimestamp,
    executionDate,
    executionTimezone,
    targetDate: SUKUYO_FICTIONAL_FIXTURE.targetDate,
    targetTimezone: SUKUYO_FICTIONAL_FIXTURE.targetTimezone,
    subject: SUKUYO_FICTIONAL_FIXTURE.subject,
    observations: [SUKUYO_FICTIONAL_FIXTURE],
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
        targetDate: run.targetDate,
        methodId: normalized.methodId,
        requestedModel: normalized.requestedModel,
        returnedModel: normalized.rawResponse.model,
        httpStatus: normalized.transport.httpStatus,
        rawAnswerCount: Object.keys(normalized.rawResponse.answers).length,
        domains: Object.fromEntries(
          Object.entries(normalized.domains).map(([domain, signal]) => [
            domain,
            { direction: signal.direction.value, relevance: signal.relevance.value },
          ]),
        ),
        primarySignal: normalized.primarySignal.value,
        bestFocus: normalized.bestFocus.value,
        cautionFocus: normalized.cautionFocus.value,
        decisionReadiness: normalized.decisionReadiness.value,
        actionReadiness: normalized.actionReadiness.value,
        socialOpenness: normalized.socialOpenness.value,
        changeReadiness: normalized.changeReadiness.value,
        riskLevel: normalized.riskLevel.value,
        hasIntradayTimingSignal: normalized.hasIntradayTimingSignal.value,
        usage: normalized.rawResponse.usage,
      },
      null,
      2,
    ),
  );
}

await main();
