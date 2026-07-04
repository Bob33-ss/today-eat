import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateMenuLocal, generateMenuWithAI } from "@/lib/ai";
import { z } from "zod";

const generateSchema = z.object({
  ingredientIds: z.array(z.number()).optional(),
});

/**
 * POST /api/generate-menu
 * 根据食材和偏好生成菜单
 * - 有 AI_API_KEY → 调 DeepSeek
 * - 无 Key → 本地模板匹配（无需外部服务）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "参数错误" }, { status: 400 });
    }

    // 1. 获取食材
    let ingredients: { name: string; quantity: string }[] = [];
    if (parsed.data.ingredientIds && parsed.data.ingredientIds.length > 0) {
      const records = await prisma.ingredient.findMany({
        where: { id: { in: parsed.data.ingredientIds } },
      });
      ingredients = records.map((r) => ({ name: r.name, quantity: r.quantity }));
    }

    // 2. 获取偏好
    const preference = await prisma.preference.findFirst({ orderBy: { id: "asc" } });
    if (!preference) {
      return NextResponse.json(
        { ok: false, error: "请先在偏好设置页面设置口味偏好" },
        { status: 400 }
      );
    }

    // 3. 尝试 AI 模式，失败则回退本地
    let menuResult = await generateMenuWithAI(ingredients, {
      cuisines: preference.cuisines,
      avoidFoods: preference.avoidFoods,
      spiceLevel: preference.spiceLevel,
      maxCookTime: preference.maxCookTime,
      dishCount: preference.dishCount,
      useLeftovers: preference.useLeftovers,
      dietType: preference.dietType,
    });

    if (!menuResult) {
      // 本地模式
      menuResult = generateMenuLocal(ingredients, {
        cuisines: preference.cuisines,
        avoidFoods: preference.avoidFoods,
        spiceLevel: preference.spiceLevel,
        maxCookTime: preference.maxCookTime,
        dishCount: preference.dishCount,
        useLeftovers: preference.useLeftovers,
        dietType: preference.dietType,
      });
    }

    // 4. 保存菜单到数据库
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
      { ok: false, error: "生成菜单失败", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
