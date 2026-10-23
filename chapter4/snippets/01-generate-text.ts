// 第4章 4.2 AI SDKのコア機能 - 原稿 L42-57
// generateTextによる一括生成
import "dotenv/config";
import { generateText } from "ai";
import { haiku } from "./bedrock.js";

// Bedrock（Claude）を使ってテキスト回答を一括で生成
async function runGenerateText() {
  const { text } = await generateText({
    model: haiku,
    prompt: "AI SDKとは何ですか？",
  });
  console.log(await text);
}

export { haiku, runGenerateText };
