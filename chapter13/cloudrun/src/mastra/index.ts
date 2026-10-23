// 第13章 13.5 Cloud Runへのデプロイ - mastra build の標準HonoサーバーをDocker化する最小構成
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { bedrock } from "@ai-sdk/amazon-bedrock";

// エージェントを定義
const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  instructions: "あなたは親切なアシスタントです。",
  model: bedrock("global.anthropic.claude-haiku-5-5"),
});

// Mastraインスタンスを作成
export const mastra = new Mastra({
  agents: { testAgent },
});
