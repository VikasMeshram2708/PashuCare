import { env } from "@/app/env";
import { createDeepSeek } from "@ai-sdk/deepseek";

export const deepseek = createDeepSeek({
  apiKey: env.DEEPSEEK_API_KEY,
});
