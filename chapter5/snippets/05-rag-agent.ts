// 第5章 5.5 検索ツールの組み込みとエージェントの実行
// chapter5/rag-agent/src/mastra/agents/rag-agent.ts
import { Agent } from "@mastra/core/agent";
import { createVectorQueryTool } from "@mastra/rag";
import { LIBSQL_PROMPT } from "@mastra/libsql";
import { haiku } from "./bedrock";
import { embedder } from "./bedrock";

const ragTool = createVectorQueryTool({
  vectorStoreName: "libSqlVector",
  indexName: "company_docs",
  model: embedder,
  enableFilter: true,
  description:
    "社内ドキュメント（FAQ、運用マニュアル、オンボーディングガイド）から関連情報を検索します",
});

export const ragAgent = new Agent({
  id: "rag-agent",
  name: "社内ドキュメント検索エージェント",
  instructions: `あなたは社内ドキュメントに基づいて質問に回答するアシスタントです。
ユーザーの質問に対して、必ずベクトル検索ツールを使って関連情報を検索してから回答してください。
検索結果に含まれる情報のみに基づいて回答し、情報が見つからない場合はその旨を正直に伝えてください。
回答の根拠となったドキュメントのソース情報も可能な限り含めてください。
${LIBSQL_PROMPT}`,
  model: haiku,
  tools: { ragTool },
});
