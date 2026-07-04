import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 创建默认偏好设置
  await prisma.preference.upsert({
    where: { id: 1 },
    update: {},
    create: {
      dietType: "none",
      avoidFoods: "",
      cuisines: "中餐",
      spiceLevel: 0,
      maxCookTime: 30,
      dishCount: 2,
      useLeftovers: true,
    },
  });

  console.log("✅ 数据库初始化完成: 默认偏好已创建");
}

main()
  .catch((e) => {
    console.error("❌ 种子数据失败:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
