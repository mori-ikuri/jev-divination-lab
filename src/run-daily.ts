import { runRegisteredDailyMethods } from "./runtime/daily-runner.js";

const requestedIds = process.argv.slice(2);
await runRegisteredDailyMethods(
  requestedIds.length > 0 ? requestedIds : undefined,
);
