import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
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
