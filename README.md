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
D:\Ikuri\02-Lab\Data\jev-divination-lab\runs\
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

Daily Run v0.2 contains all eight planned fictional method slices:
`western_astrology`, `four_pillars` (BaZi), `nine_star_ki`, `sukuyo`,
`numerology`, `jyotish`, `zi_wei_dou_shu`, and `sanmeigaku`.

- a versioned shared contract and TypeScript types
- separate synthetic observation fixtures with method-specific facts and interpretations
- Jev normalization across 12 shared domains and readiness/risk axes
- preservation of each raw Jev response, confidence, probabilities, and token usage
- a registry-driven runner and unweighted consensus for any positive method count
- explicit agreement, disagreement, tie, insufficient-coverage, and outlier-candidate evidence

All eight planned Daily Run methods are now registered. Tarot, I Ching, Rune,
and other draw- or selection-based methods are outside the v0.2 target because this phase requires reproducible fixed inputs.
Deterministic generators remain a later phase; current public method observations
are explicit fictional fixtures.

It does not use real user data, historical-accuracy weighting, or a human-facing report.

Run the deterministic tests:

```powershell
npm test
```

Run the fictional live fixture while keeping runtime output outside this public repository:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:western
```

Run both fictional methods and generate the two-method comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare
```

Run all three fictional methods and generate the three-method comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:three
```

Run the fictional Sukuyo fixture alone:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:sukuyo
```

Run all four fictional methods and generate the four-method comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:four
```

Run the original five registered fictional methods and generate the five-method comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:five
```

Run the fictional Jyotish fixture alone:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:jyotish
```

Run all six registered fictional methods and generate the v0.2 comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:six
```

Run the fictional Zi Wei Dou Shu fixture alone:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:zi-wei-dou-shu
```

Run all seven registered fictional methods and generate the v0.2 comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:seven
```

Run the fictional Sanmeigaku fixture alone:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:sanmeigaku
```

Run all eight registered fictional methods and generate the complete v0.2 comparison:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
npm run daily:compare:eight
```

Run the Western Astrology input-quality experiment against an existing private baseline artifact:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
$env:DAILY_RUN_BASELINE_PATH = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs\2026-09-21\daily-v0.1-four-method-fictional-<timestamp>.json'
npm run daily:western:enrichment
```

The experiment keeps the original Western fixture unchanged, normalizes a separate enriched fictional chart, and stores the per-domain coverage, confidence, and token-usage comparison outside the repository.

Run the Four Pillars input-quality experiment against an existing private baseline artifact:

```powershell
$env:DAILY_RUN_OUTPUT_ROOT = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs'
$env:DAILY_RUN_EXECUTION_TIMEZONE = 'Asia/Tokyo'
$env:DAILY_RUN_BASELINE_PATH = 'D:\Ikuri\02-Lab\Data\jev-divination-lab\runs\2026-09-21\daily-v0.1-four-method-fictional-<timestamp>.json'
npm run daily:four-pillars:enrichment
```

The experiment keeps the original Four Pillars fixture unchanged, normalizes a separate enriched fictional chart, and stores the per-domain coverage, confidence, and token-usage comparison outside the repository.

The runner refuses an output root located inside the repository and requires an explicit execution timezone. Runtime directories are keyed by the execution date in that timezone, while `targetDate` remains the date being evaluated. The current contract is documented in [`docs/daily-run-v0.2.md`](docs/daily-run-v0.2.md); v0.1 remains as historical documentation.

## License

[MIT](LICENSE)
