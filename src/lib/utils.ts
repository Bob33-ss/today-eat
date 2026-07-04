/**
 * 简易 cn 函数（条件 class 合并）
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 食材分类列表
 */
export const INGREDIENT_CATEGORIES = [
  "蔬菜",
  "肉类",
  "海鲜",
  "豆制品",
  "蛋奶",
  "主食",
  "调味品",
  "其他",
] as const;

/**
 * 菜系列表
 */
export const CUISINE_OPTIONS = [
  "中餐",
  "西餐",
  "日料",
  "韩餐",
  "东南亚",
  "轻食",
] as const;
