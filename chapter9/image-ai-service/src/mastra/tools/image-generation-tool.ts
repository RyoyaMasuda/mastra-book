import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { PLAN_IMAGE_MODELS, type Plan } from "../../lib/plans";
import { generateImage } from "../../lib/bedrock";

export const imageGenerationTool = createTool({
  id: "image-generation-tool",
  description:
    "Generate an image from a text prompt using " +
    "Stability AI on Amazon Bedrock. Write the prompt in English.",
  inputSchema: z.object({
    prompt: z.string().describe("Text description of the image to generate (in English)"),
  }),
  outputSchema: z.object({
    imageUrl: z.string().optional().describe("URL path to the generated image"),
    error: z
      .string()
      .optional()
      .describe("Error message if image generation failed"),
  }),
  execute: async (inputData, context) => {
    try {
      // RuntimeContextからプランを取得（未設定時は"free"）
      const plan =
        (context?.requestContext?.get("plan") as Plan | undefined) ?? "free";
      const imageModel = PLAN_IMAGE_MODELS[plan];

      // Bedrock（Stability AI）で画像を生成し、base64で受け取る
      const base64 = await generateImage(imageModel, inputData.prompt);
      if (!base64) {
        return {
          error:
            "画像が生成されませんでした。" + "別のプロンプトをお試しください。",
        };
      }

      const uuid = crypto.randomUUID();
      const outputDir = path.join(process.cwd(), "public", "generated-images");
      fs.mkdirSync(outputDir, { recursive: true });
      const filePath = path.join(outputDir, `${uuid}.png`);
      fs.writeFileSync(filePath, Buffer.from(base64, "base64"));

      return { imageUrl: `/generated-images/${uuid}.png` };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: `画像生成に失敗しました: ${message}` };
    }
  },
});
