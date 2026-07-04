import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 验证创建食材的输入
const createSchema = z.object({
  name: z.string().min(1, "食材名称不能为空"),
  category: z.string().min(1, "分类不能为空"),
  quantity: z.string().min(1, "数量不能为空"),
  expiryAt: z.string().optional(),
});

/**
 * GET /api/ingredients
 * 获取所有食材列表
 */
export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, data: ingredients });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "获取食材列表失败" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ingredients
 * 添加新食材
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name: parsed.data.name,
        category: parsed.data.category,
        quantity: parsed.data.quantity,
        expiryAt: parsed.data.expiryAt
          ? new Date(parsed.data.expiryAt)
          : null,
      },
    });

    return NextResponse.json({ ok: true, data: ingredient }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "添加食材失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ingredients?id=xxx
 * 删除食材
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "缺少 id 参数" },
        { status: 400 }
      );
    }

    await prisma.ingredient.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "删除食材失败" },
      { status: 500 }
    );
  }
}
