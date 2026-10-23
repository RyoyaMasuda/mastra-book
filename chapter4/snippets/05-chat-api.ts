// 第4章 4.3 AI SDK UIの紹介（APIサーバー側） - 原稿 L302-318
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { haiku } from "./bedrock.js";

export async function POST(req: Request) {
  // クライアントから送信されたメッセージ履歴を取得
  const { messages }: { messages: UIMessage[] } = await req.json();
  // AI SDKのstreamTextでストリーミングレスポンスを生成
  const result = streamText({
    model: haiku,
    system: "You are a helpful assistant.",
    messages: await convertToModelMessages(messages),
  });
  // useChatフックが解釈できる形式に変換して返す
  return result.toUIMessageStreamResponse();
}
