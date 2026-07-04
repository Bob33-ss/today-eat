import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAIClient, buildMenuPrompt } from "@/lib/ai";
import { generateText } from "ai";
import { z } from "zod";
import type { MenuResult } from "@/types";

const generateSchema = z.object({
  ingredientIds: z.array(z.number()).optional(),
});

/**
 * POST /api/generate-menu
 * 根据食材和偏好生成菜单
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "参数错误" },
        { status: 400 }
      );
    }

    // 1. 获取食材列表
    let ingredients: { name: string; quantity: string }[] = [];
    if (parsed.data.ingredientIds && parsed.data.ingredientIds.length > 0) {
      const records = await prisma.ingredient.findMany({
        where: { id: { in: parsed.data.ingredientIds } },
      });
      ingredients = records.map((r) => ({ name: r.name, quantity: r.quantity }));
    }

    // 2. 获取偏好
    const preference = await prisma.preference.findFirst({
      orderBy: { id: "asc" },
    });

    if (!preference) {
      return NextResponse.json(
        { ok: false, error: "请先在偏好设置页面设置口味偏好" },
        { status: 400 }
      );
    }

    // 3. 调 AI 生成菜单
    const prompt = buildMenuPrompt(ingredients, {
      cuisines: preference.cuisines,
      avoidFoods: preference.avoidFoods,
      spiceLevel: preference.spiceLevel,
      maxCookTime: preference.maxCookTime,
      dishCount: preference.dishCount,
      useLeftovers: preference.useLeftovers,
      dietType: preference.dietType,
    });

    const model = getAIClient();
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 2048,
    });

    // 4. 解析 AI 返回的 JSON
    let menuResult: MenuResult;
    try {
      // 清理可能的 markdown 代码块标记
      const cleanText = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      menuResult = JSON.parse(cleanText);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "AI 返回格式异常，请重试",
          raw: text.substring(0, 500),
        },
        { status: 500 }
      );
    }

    // 5. 保存菜单到数据库
    const menu = await prisma.menu.create({
      data: {
        name: `${new Date().getMonth() + 1}月${new Date().getDate()}日菜单`,
        menuItems: {
          create: menuResult.items.map((item) => ({
            mealName: item.mealName,
            description: item.description,
            cookTime: item.cookTime,
            difficulty: item.difficulty,
            ingredients: item.ingredients,
            steps: item.steps,
          })),
        },
      },
      include: { menuItems: true },
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: menu.id,
        name: menu.name,
        items: menu.menuItems,
        tip: menuResult.tip ?? null,
        createdAt: menu.createdAt,
      },
    });
  } catch (error) {
    console.error("Generate menu failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "AI 服务调用失败，请确认 AI_API_KEY 配置正确",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
