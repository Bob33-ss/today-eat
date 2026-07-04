import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  dietType: z.string().optional(),
  avoidFoods: z.string().optional(),
  cuisines: z.string().optional(),
  spiceLevel: z.number().min(0).max(5).optional(),
  maxCookTime: z.number().min(5).max(120).optional(),
  dishCount: z.number().min(1).max(6).optional(),
  useLeftovers: z.boolean().optional(),
});

/**
 * GET /api/preferences
 * 获取偏好设置（单条记录）
 */
export async function GET() {
  try {
    let pref = await prisma.preference.findFirst({ orderBy: { id: "asc" } });

    // 没有则创建默认
    if (!pref) {
      pref = await prisma.preference.create({
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

    return NextResponse.json({ ok: true, data: pref });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "获取偏好设置失败" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/preferences
 * 更新偏好设置
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const existing = await prisma.preference.findFirst({
      orderBy: { id: "asc" },
    });

    if (!existing) {
      // 没有则创建
      const created = await prisma.preference.create({
        data: {
          dietType: "none",
          avoidFoods: "",
          cuisines: "中餐",
          spiceLevel: 0,
          maxCookTime: 30,
          dishCount: 2,
          useLeftovers: true,
          ...parsed.data,
        },
      });
      return NextResponse.json({ ok: true, data: created });
    }

    const updated = await prisma.preference.update({
      where: { id: existing.id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "更新偏好设置失败" },
      { status: 500 }
    );
  }
}
