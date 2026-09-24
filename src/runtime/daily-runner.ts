import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { computeConsensus } from "../consensus/compute-consensus.js";
import type {
  DailyRun,
  JevNormalizedMethod,
  MethodObservation,
} from "../contracts/daily-run.js";
import { normalizeMethodObservation } from "../jev/normalize-method.js";
import { selectRegisteredMethods } from "../methods/registry.js";
import { assertPrivateOutputRoot } from "./private-output.js";
import { deriveExecutionDateKey } from "./run-date.js";

export interface DailyRunBuildInput {
  readonly observations: readonly MethodObservation[];
  readonly normalizedMethods: readonly JevNormalizedMethod[];
  readonly executionTimestamp: string;
  readonly executionTimezone: string;
}

export function buildDailyRun(input: DailyRunBuildInput): DailyRun {
  const {
    observations,
    normalizedMethods,
    executionTimestamp,
    executionTimezone,
  } = input;
  if (observations.length === 0) {
    throw new RangeError("Daily Run v0.2 requires at least one observation.");
  }
  if (observations.length !== normalizedMethods.length) {
    throw new Error("Observation and normalized-method counts must match.");
  }
  observations.forEach((observation, index) => {
    if (observation.methodId !== normalizedMethods[index].methodId) {
      throw new Error(
        `Observation methodId ${observation.methodId} does not match normalized methodId ${normalizedMethods[index].methodId} at index ${index}.`,
      );
    }
  });

  const consensus = computeConsensus(normalizedMethods);
  const executionDate = deriveExecutionDateKey({
    executionTimestamp,
    executionTimezone,
  });
  const runId = `daily-v0.2-${observations.length}-method-fictional-${executionTimestamp.replace(/[:.]/g, "-")}`;

  return {
    schemaVersion: "0.2",
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
}

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
          Object.entries(method.intradayDirections).map(([part, signal]) => [
            part,
            signal.value,
          ]),
        )
      : null,
    usage: method.rawResponse.usage,
  };
}

export async function runRegisteredDailyMethods(
  requestedIds?: readonly string[],
): Promise<{ readonly run: DailyRun; readonly outputPath: string }> {
  const configuredOutputRoot = process.env.DAILY_RUN_OUTPUT_ROOT;
  if (!configuredOutputRoot) {
    throw new Error(
      "DAILY_RUN_OUTPUT_ROOT is required and must point outside the repository.",
    );
  }
  const executionTimezone = process.env.DAILY_RUN_EXECUTION_TIMEZONE;
  if (!executionTimezone) {
    throw new Error(
      "DAILY_RUN_EXECUTION_TIMEZONE is required and must be an IANA timezone such as Asia/Tokyo.",
    );
  }

  const selectedMethods = selectRegisteredMethods(requestedIds);
  const observations = selectedMethods.map((method) => method.observation);
  const normalizedMethods: JevNormalizedMethod[] = [];
  for (const observation of observations) {
    normalizedMethods.push(await normalizeMethodObservation(observation));
  }

  const executionTimestamp = new Date().toISOString();
  const run = buildDailyRun({
    observations,
    normalizedMethods,
    executionTimestamp,
    executionTimezone,
  });
  const outputRoot = assertPrivateOutputRoot(
    resolve(process.cwd()),
    configuredOutputRoot,
  );
  const outputDirectory = resolve(outputRoot, run.executionDate);
  const outputPath = resolve(outputDirectory, `${run.runId}.json`);
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(run, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });

  console.log(
    JSON.stringify(
      {
        runId: run.runId,
        outputPath,
        executionTimestamp: run.executionTimestamp,
        executionDate: run.executionDate,
        executionTimezone: run.executionTimezone,
        targetDate: run.targetDate,
        targetTimezone: run.targetTimezone,
        methods: normalizedMethods.map(summarizeMethod),
        consensus: run.consensus,
      },
      null,
      2,
    ),
  );

  return { run, outputPath };
}
