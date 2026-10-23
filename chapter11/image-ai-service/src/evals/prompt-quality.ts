import { runEvals } from "@mastra/core/evals";
import { createAnswerRelevancyScorer } from "@mastra/evals/scorers/prebuilt";

import { imageSupportAgent } from "../mastra/agents/image-support-agent";
import { haiku } from "../lib/bedrock";

const relevancyScorer = createAnswerRelevancyScorer({
  model: haiku,
});

(async () => {
  await runEvals({
    data: [
      { input: "画像生成AIとはどのような技術ですか？" },
      { input: "このサービスの使い方を教えてください" },
    ],
    scorers: [relevancyScorer],
    target: imageSupportAgent,
    onItemComplete: ({ scorerResults }) => {
      console.log({
        relevancy: scorerResults[relevancyScorer.id].score,
        relevancyReason: scorerResults[relevancyScorer.id].reason,
      });
    },
  });
})();
