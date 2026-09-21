import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { computeConsensus } from "./consensus/compute-consensus.js";
import type { DailyRun, JevNormalizedMethod } from "./contracts/daily-run.js";
import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "./fixtures/four-pillars-fictional.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "./fixtures/western-astrology-fictional.js";
import { normalizeMethodObservation } from "./jev/normalize-method.js";
import { assertPrivateOutputRoot } from "./runtime/private-output.js";
import { deriveExecutionDateKey } from "./runtime/run-date.js";

function summarizeMethod(method: JevNormalizedMethod): object {
  return {
    methodId: method.methodId,
    requestedModel: method.requestedModel,
    returnedModel: method.rawResponse.model,
    httpStatus: method.transport.httpStatus,
    rawAnswerCount: Object.keys(method.rawResponse.answers).length,
    domains: Object.fromEntries(
      Object.entries(method.domains).map(([domain, signal]) => [
        domain,
        {
          direction: signal.direction.value,
          relevance: signal.relevance.value,
        },
      ]),
    ),
    primarySignal: method.primarySignal.value,
    bestFocus: method.bestFocus.value,
    cautionFocus: method.cautionFocus.value,
    decisionReadiness: method.decisionReadiness.value,
    actionReadiness: method.actionReadiness.value,
    socialOpenness: method.socialOpenness.value,
    changeReadiness: method.changeReadiness.value,
    riskLevel: method.riskLevel.value,
    hasIntradayTimingSignal: method.hasIntradayTimingSignal.value,
    intradayDirections: method.intradayDirections
      ? Object.fromEntries(
          Object.entries(method.intradayDirections).map(([part, signal]) => [part, signal.value]),
        )
      : null,
    usage: method.rawResponse.usage,
  };
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

  const repositoryRoot = resolve(process.cwd());
  const outputRoot = assertPrivateOutputRoot(repositoryRoot, configuredOutputRoot);
  const observations = [
    WESTERN_ASTROLOGY_FICTIONAL_FIXTURE,
    FOUR_PILLARS_FICTIONAL_FIXTURE,
  ] as const;

  // Execute separately so each method retains its own raw response, confidence,
  // probabilities, model, and usage evidence.
  const normalizedMethods: JevNormalizedMethod[] = [];
  for (const observation of observations) {
    normalizedMethods.push(await normalizeMethodObservation(observation));
  }

  const consensus = computeConsensus(normalizedMethods);
  const executionTimestamp = new Date().toISOString();
  const executionDate = deriveExecutionDateKey({ executionTimestamp, executionTimezone });
  const runId = `daily-v0.1-two-method-fictional-${executionTimestamp.replace(/[:.]/g, "-")}`;
  const run: DailyRun = {
    schemaVersion: "0.1",
    runId,
    executionTimestamp,
    executionDate,
    executionTimezone,
    targetDate: observations[0].targetDate,
    targetTimezone: observations[0].targetTimezone,
    subject: observations[0].subject,
    observations,
    normalizedMethods,
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
        methods: normalizedMethods.map(summarizeMethod),
        consensus: {
          status: consensus.status,
          methodCount: consensus.methodCount,
          sourceMethods: consensus.sourceMethods,
          domains: consensus.domains,
          primarySignal: consensus.primarySignal,
          bestFocus: consensus.bestFocus,
          cautionFocus: consensus.cautionFocus,
          decisionReadiness: consensus.decisionReadiness,
          actionReadiness: consensus.actionReadiness,
          socialOpenness: consensus.socialOpenness,
          changeReadiness: consensus.changeReadiness,
          riskLevel: consensus.riskLevel,
          hasIntradayTimingSignal: consensus.hasIntradayTimingSignal,
          disagreementClassifications: consensus.disagreementClassifications,
          evidenceConfidenceMean: consensus.evidenceConfidenceMean,
          limitations: consensus.limitations,
        },
      },
      null,
      2,
    ),
  );
}

await main();
