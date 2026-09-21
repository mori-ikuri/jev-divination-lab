export interface RunDateInputs {
  readonly executionTimestamp: string;
  readonly executionTimezone: string;
}

export function deriveExecutionDateKey(inputs: RunDateInputs): string {
  const instant = new Date(inputs.executionTimestamp);
  if (Number.isNaN(instant.getTime())) {
    throw new RangeError(`Invalid execution timestamp: ${inputs.executionTimestamp}`);
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: inputs.executionTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  if (!values.year || !values.month || !values.day) {
    throw new Error("Could not derive execution date parts.");
  }

  return `${values.year}-${values.month}-${values.day}`;
}
