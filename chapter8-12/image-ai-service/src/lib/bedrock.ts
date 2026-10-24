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
