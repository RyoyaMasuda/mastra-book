import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

// AWS_PROFILE（例: oic）や環境変数の認証情報を自動で解決する
const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION ?? "ap-northeast-1",
  credentialProvider: fromNodeProviderChain(),
});

// 軽量・高速（旧 Gemini Flash 相当）
export const haiku = bedrock("global.anthropic.claude-haiku-5-5");
// 高性能（旧 Gemini Pro 相当）
export const sonnet = bedrock("global.anthropic.claude-sonnet-5-5");

// Stability AI の画像モデルは東京リージョンに無いため、米国リージョンを使う
const imageClient = new BedrockRuntimeClient({
  region: process.env.AWS_IMAGE_REGION ?? "us-west-2",
  credentials: fromNodeProviderChain(),
});

// 画像を生成して base64 を返す（生成できなければ undefined）
export async function generateImage(modelId: string, prompt: string) {
  const res = await imageClient.send(
    new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        aspect_ratio: "1:1",
        output_format: "png",
      }),
    }),
  );
  const json = JSON.parse(new TextDecoder().decode(res.body));
  if (json.finish_reasons?.[0]) throw new Error(json.finish_reasons[0]);
  return json.images?.[0] as string | undefined;
}
