import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/history
 * 获取历史生成的菜单列表
 */
export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        menuItems: {
          select: {
            id: true,
            mealName: true,
            cookTime: true,
            difficulty: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, data: menus });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "获取历史菜单失败" },
      { status: 500 }
    );
  }
}
