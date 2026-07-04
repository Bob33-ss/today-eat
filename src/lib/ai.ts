import { createOpenAI } from "@ai-sdk/openai";

export function getAIClient() {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL ?? "https://api.deepseek.com/v1";
  const model = process.env.AI_MODEL ?? "deepseek-chat";

  if (!apiKey) {
    throw new Error("AI_API_KEY 未配置，请在 .env 中设置");
  }

  const openai = createOpenAI({
    apiKey,
    baseURL,
  });

  return openai(model);
}

/**
 * 生成菜单 prompt
 */
export function buildMenuPrompt(
  ingredients: { name: string; quantity: string }[],
  preferences: {
    cuisines: string;
    avoidFoods: string;
    spiceLevel: number;
    maxCookTime: number;
    dishCount: number;
    useLeftovers: boolean;
    dietType: string;
  }
): string {
  const ingredientList = ingredients
    .map((i) => `${i.name}(${i.quantity})`)
    .join("、");

  return `你是一名资深家庭烹饪顾问。用户提供了以下食材和偏好，请设计 ${preferences.dishCount} 道菜。

## 现有食材
${ingredientList || "（暂未输入食材，请推荐常见家常菜）"}

## 用户偏好
- 菜系偏好：${preferences.cuisines}
- 辣度（0-5）：${preferences.spiceLevel}
- 最大烹饪时间：${preferences.maxCookTime} 分钟
- 饮食类型：${preferences.dietType || "无特殊限制"}
- 避免食材：${preferences.avoidFoods || "无"}
- 优先利用现有食材：${preferences.useLeftovers ? "是" : "否"}

## 输出要求
返回 JSON，格式：
{
  "items": [
    {
      "mealName": "菜名",
      "description": "一句话描述这道菜的特点(突出食材利用和口味)",
      "cookTime": 烹饪分钟数,
      "difficulty": "简单/中等/复杂",
      "ingredients": "所需食材列表（逗号分隔）",
      "steps": "简要步骤（3-5步，每步用句号分隔）"
    }
  ],
  "tip": "一条针对冰箱管理的建议或下顿搭配提示"
}

要求：
- 优先使用用户现有食材，不足部分建议补充
- 每道菜烹饪时间不超过 ${preferences.maxCookTime} 分钟
- 菜名简洁易懂，贴近家常菜风格
- 不要包含 markdown 代码块标记，直接返回 JSON`;
}
