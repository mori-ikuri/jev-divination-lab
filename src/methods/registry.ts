import type { MethodObservation } from "../contracts/daily-run.js";
import { FOUR_PILLARS_FICTIONAL_FIXTURE } from "../fixtures/four-pillars-fictional.js";
import { JYOTISH_FICTIONAL_FIXTURE } from "../fixtures/jyotish-fictional.js";
import { NINE_STAR_KI_FICTIONAL_FIXTURE } from "../fixtures/nine-star-ki-fictional.js";
import { NUMEROLOGY_FICTIONAL_FIXTURE } from "../fixtures/numerology-fictional.js";
import { SUKUYO_FICTIONAL_FIXTURE } from "../fixtures/sukuyo-fictional.js";
import { WESTERN_ASTROLOGY_FICTIONAL_FIXTURE } from "../fixtures/western-astrology-fictional.js";
import { ZI_WEI_DOU_SHU_FICTIONAL_FIXTURE } from "../fixtures/zi-wei-dou-shu-fictional.js";

export interface RegisteredMethod {
  readonly id: string;
  readonly displayName: string;
  readonly observation: MethodObservation;
}

export const DAILY_METHOD_REGISTRY: readonly RegisteredMethod[] = [
  {
    id: "western_astrology",
    displayName: "Western Astrology",
    observation: WESTERN_ASTROLOGY_FICTIONAL_FIXTURE,
  },
  {
    id: "four_pillars",
    displayName: "Four Pillars / BaZi",
    observation: FOUR_PILLARS_FICTIONAL_FIXTURE,
  },
  {
    id: "nine_star_ki",
    displayName: "Nine Star Ki",
    observation: NINE_STAR_KI_FICTIONAL_FIXTURE,
  },
  {
    id: "sukuyo",
    displayName: "Sukuyo",
    observation: SUKUYO_FICTIONAL_FIXTURE,
  },
  {
    id: "numerology",
    displayName: "Numerology",
    observation: NUMEROLOGY_FICTIONAL_FIXTURE,
  },
  {
    id: "jyotish",
    displayName: "Jyotish / Indian Astrology",
    observation: JYOTISH_FICTIONAL_FIXTURE,
  },
  {
    id: "zi_wei_dou_shu",
    displayName: "Zi Wei Dou Shu / 紫微斗数",
    observation: ZI_WEI_DOU_SHU_FICTIONAL_FIXTURE,
  },
] as const;

const registryById = new Map(
  DAILY_METHOD_REGISTRY.map((method) => [method.id, method]),
);

if (registryById.size !== DAILY_METHOD_REGISTRY.length) {
  throw new Error("Daily method registry contains duplicate method IDs.");
}
for (const method of DAILY_METHOD_REGISTRY) {
  if (method.id !== method.observation.methodId) {
    throw new Error(
      `Registry ID ${method.id} does not match fixture methodId ${method.observation.methodId}.`,
    );
  }
}

export function selectRegisteredMethods(
  requestedIds: readonly string[] = DAILY_METHOD_REGISTRY.map(
    (method) => method.id,
  ),
): readonly RegisteredMethod[] {
  if (requestedIds.length === 0) {
    throw new RangeError("At least one registered method ID is required.");
  }
  if (new Set(requestedIds).size !== requestedIds.length) {
    throw new Error("Requested method IDs must be unique.");
  }

  return requestedIds.map((id) => {
    const method = registryById.get(id);
    if (!method) {
      throw new Error(`Unknown method ID: ${id}.`);
    }
    return method;
  });
}
