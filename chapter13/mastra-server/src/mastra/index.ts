// 第13章 13.1 Mastra Server検証用 - 最小構成のMastraプロジェクト
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { haiku } from "./bedrock";

// エージェントを定義
const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  instructions: "あなたは親切なアシスタントです。",
  model: haiku,
});

// Mastraインスタンスを作成
export const mastra = new Mastra({
  agents: { testAgent },
});
