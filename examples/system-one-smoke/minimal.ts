import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const request = {
  model: "jev-latest",
  state: {
    message: "It is raining outside today.",
  },
  questions: {
    category: choice("Which category best describes the message?", {
      weather: "A statement about weather conditions.",
      finance: "A statement about money or markets.",
      other: "Neither weather nor finance.",
    }),
  },
} as const;

const client = new TypeSafeClient({ logLevel: "off" });

console.log("request.shape", JSON.stringify(request, null, 2));

const { data, response, requestId } = await client.systemOne(request).withResponse();

type Category = "weather" | "finance" | "other";
const typedAnswer: Category = data.answers.category.choice;

console.log(
  "http.meta",
  JSON.stringify(
    {
      status: response.status,
      requestId: requestId ?? null,
    },
    null,
    2,
  ),
);
console.log("response.rawJson", JSON.stringify(data, null, 2));
console.log(
  "answer.typed",
  JSON.stringify(
    {
      type: data.answers.category.type,
      choice: typedAnswer,
      confidence: data.answers.category.confidence,
      probabilities: data.answers.category.probabilities,
    },
    null,
    2,
  ),
);
