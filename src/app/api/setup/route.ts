import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/setup
 * 初始化数据库：创建表（需先执行 prisma db push）+ 种子数据
 * 部署后首次访问执行
 */
export async function GET() {
  try {
    // 验证数据库连接
    await prisma.$connect();

    // 检查是否已有偏好设置
    const existing = await prisma.preference.findFirst();
    if (!existing) {
      await prisma.preference.create({
        data: {
          dietType: "none",
          avoidFoods: "",
          cuisines: "中餐",
          spiceLevel: 0,
          maxCookTime: 30,
          dishCount: 2,
          useLeftovers: true,
        },
      });
    }

    // 检查食材表是否可读写
    const ingredientCount = await prisma.ingredient.count();

    await prisma.$disconnect();

    return NextResponse.json({
      ok: true,
      message: "数据库初始化完成",
      stats: {
        hasPreferences: !!existing,
        ingredientCount,
        database: "postgresql",
      },
    });
  } catch (error) {
    console.error("Setup failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "数据库初始化失败，请确认 DATABASE_URL 配置正确，且已执行 `npx prisma db push`",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
