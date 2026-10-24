import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { fromNodeProviderChain } from "@aws-sdk/credential-providers";

// AWS_PROFILE（例: oic）や環境変数の認証情報を自動で解決する
const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION ?? "ap-northeast-1",
  credentialProvider: fromNodeProviderChain(),
});

// Claude 5.5 は temperature 非対応（400エラー）。Mastra のプロセッサ等が
// temperature: 0 を内部で付けるため、送信前に取り除く
type Model = ReturnType<typeof bedrock>;
function withoutTemperature(model: Model): Model {
  return new Proxy(model, {
    get(target, prop) {
      if (prop === "doGenerate" || prop === "doStream") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (options: any) => (target as any)[prop]({ ...options, temperature: undefined });
      }
      return Reflect.get(target, prop, target);
    },
  });
}

// 軽量・高速（旧 Gemini Flash 相当）
export const haiku = withoutTemperature(
  bedrock("global.anthropic.claude-haiku-5-5"),
);
// 高性能（旧 Gemini Pro 相当）
export const sonnet = withoutTemperature(
  bedrock("global.anthropic.claude-sonnet-5-5"),
);
// 埋め込み（1536次元）
export const embedder = bedrock.embedding("cohere.embed-v4:0");
