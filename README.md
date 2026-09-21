# Jev Divination Lab

Project started: 2026-09-21

Jev Divination Lab is a public research project exploring whether Jev / TypeSafe AI can normalize independently produced readings from multiple divination systems onto shared axes, then make their agreements and disagreements measurable for the same person and target period.

This initial commit establishes the project origin and preserves a minimal, reproducible Jev connectivity example. It does not implement divination logic or Daily Run workflows yet.

## Research direction

The planned research flow is:

1. Evaluate each divination system independently for the same fictional or explicitly authorized subject and period.
2. Use Jev to normalize the outputs onto a shared contract.
3. Compare agreements, disagreements, confidence, and uncertainty without erasing method-specific differences.

## Privacy and public-data boundary

This repository is public. It must contain only source code, documentation, and fictional fixtures.

Do not commit:

- API keys, tokens, credentials, or `.env` files
- real names, birth details, or other personally identifying information
- personal daily, weekly, monthly, or yearly run data
- private runtime output

Private runtime data belongs outside this repository. The local development convention is:

```text
D:\AI-Work\JevLab-Data\runs\
```

## Minimal Jev connectivity example

The example in [`examples/system-one-smoke/minimal.ts`](examples/system-one-smoke/minimal.ts) sends one non-personal weather-classification request through the official SDK.

Prerequisites:

- Node.js 20 or newer
- `TYPESAFE_API_KEY` provided through the process environment

Install, type-check, build, and run:

```powershell
npm install
npm run check
npm run build
npm run smoke
```

The smoke path is TypeScript -> `tsc` -> plain Node.js. It intentionally does not use `tsx` because `tsx` caused `os.userInfo()` / `uv_os_get_passwd` `ENOMEM` failures in the original Windows test environment.

Pinned and observed details:

- SDK: `@typesafe-ai/sdk@0.6.0`
- API operation: `POST https://api.typesafe.ai/v1/systemone`
- Requested model alias: `jev-latest`
- Model returned by the successful 2026-09-21 smoke run: `jev-1.13.0`

The API key is read by the SDK from the environment. It is never stored or printed by the example.

## Status

Daily Run v0.1 contains one complete fictional `western_astrology` vertical slice:

- a versioned shared contract and TypeScript types
- one synthetic observation fixture
- Jev normalization across 12 shared domains and readiness/risk axes
- preservation of the raw Jev response and token usage
- a deliberately limited one-method consensus baseline

It does not yet implement another divination method or a human-facing report.

Run the deterministic tests:

```powershell
npm test
```

Run the fictional live fixture while keeping runtime output outside this public repository:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\AI-Work\JevLab-Data\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:western
```

The runner refuses an output root located inside the repository and requires an explicit execution timezone. Runtime directories are keyed by the execution date in that timezone, while `targetDate` remains the date being evaluated. The full contract is documented in [`docs/daily-run-v0.1.md`](docs/daily-run-v0.1.md).

## License

[MIT](LICENSE)
