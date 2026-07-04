/**
 * 本地菜单生成器（无需 AI API Key）
 *
 * 基于食材和偏好，使用模板规则生成菜单。
 * 当配置了 AI_API_KEY 时自动切换到 DeepSeek 调用。
 */

// ===== 菜谱模板库 =====
interface RecipeTemplate {
  name: string;
  description: string;
  cookTime: number;
  difficulty: string;
  mainIngredient: string;     // 主食材关键词
  supporting: string[];       // 搭配食材
  seasonings: string[];       // 调味品
  steps: string[];
  cuisine: string;           // 菜系
  spiceLevel: number;         // 辣度 0-5
  dietTypes: string[];        // 适合的饮食类型
}

const RECIPES: RecipeTemplate[] = [
  // === 蔬菜类 ===
  {
    name: "番茄炒蛋",
    description: "经典家常菜，酸甜可口，食材简单，几分钟就能上桌",
    cookTime: 10,
    difficulty: "简单",
    mainIngredient: "番茄",
    supporting: ["鸡蛋"],
    seasonings: ["盐", "糖", "葱"],
    steps: ["鸡蛋打散加少许盐搅匀", "番茄切块", "热油炒熟鸡蛋盛出", "爆香葱段，下番茄炒出汁", "倒入鸡蛋翻炒均匀，加糖和盐调味"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "gluten-free"],
  },
  {
    name: "蒜蓉西兰花",
    description: "清爽低卡，蒜香浓郁，三分钟快炒保留营养",
    cookTime: 8,
    difficulty: "简单",
    mainIngredient: "西兰花",
    supporting: ["蒜"],
    seasonings: ["盐", "蚝油"],
    steps: ["西兰花掰小朵焯水1分钟", "蒜切末", "热油爆香蒜末", "下西兰花快速翻炒", "加蚝油和盐调味出锅"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "vegetarian", "vegan", "gluten-free"],
  },
  {
    name: "干煸四季豆",
    description: "外焦里嫩，微辣鲜香，超下饭",
    cookTime: 15,
    difficulty: "中等",
    mainIngredient: "四季豆",
    supporting: ["干辣椒", "蒜", "花椒"],
    seasonings: ["盐", "生抽"],
    steps: ["四季豆摘段洗净沥干", "热油下四季豆煸至表皮起皱", "盛出备用", "爆香蒜末、干辣椒和花椒", "倒回四季豆加生抽和盐翻炒均匀"],
    cuisine: "中餐",
    spiceLevel: 2,
    dietTypes: ["none", "vegetarian", "vegan", "gluten-free"],
  },
  {
    name: "酸辣土豆丝",
    description: "脆爽酸辣，国民家常菜，零失败",
    cookTime: 12,
    difficulty: "简单",
    mainIngredient: "土豆",
    supporting: ["干辣椒", "青椒", "蒜"],
    seasonings: ["醋", "盐", "生抽"],
    steps: ["土豆切细丝泡水去淀粉", "青椒切丝", "热油爆香蒜和干辣椒", "下土豆丝大火快炒", "加醋、盐、生抽调味，放青椒丝翻炒出锅"],
    cuisine: "中餐",
    spiceLevel: 2,
    dietTypes: ["none", "vegetarian", "vegan", "gluten-free"],
  },
  {
    name: "蚝油生菜",
    description: "脆嫩爽口，蚝油提鲜，三分钟快炒菜",
    cookTime: 5,
    difficulty: "简单",
    mainIngredient: "生菜",
    supporting: ["蒜"],
    seasonings: ["蚝油", "生抽"],
    steps: ["生菜洗净掰开", "蒜切末", "热油爆香蒜末", "下生菜大火快炒至变软", "加蚝油和生抽拌匀即出锅"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "vegetarian", "vegan", "gluten-free"],
  },
  // === 肉类 ===
  {
    name: "可乐鸡翅",
    description: "甜咸适中，色泽红亮，简单零失败的聚餐硬菜",
    cookTime: 25,
    difficulty: "简单",
    mainIngredient: "鸡翅",
    supporting: ["姜"],
    seasonings: ["可乐", "生抽", "料酒"],
    steps: ["鸡翅两面划刀，冷水下锅焯水去血沫", "捞出沥干", "热油煎鸡翅至两面金黄", "倒入可乐没过鸡翅，加姜片和料酒", "中小火炖15分钟，转大火收汁"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "gluten-free"],
  },
  {
    name: "青椒肉丝",
    description: "嫩滑鲜香，经典下饭菜，青椒脆甜肉丝嫩",
    cookTime: 15,
    difficulty: "中等",
    mainIngredient: "猪肉",
    supporting: ["青椒", "蒜"],
    seasonings: ["生抽", "料酒", "淀粉", "盐"],
    steps: ["猪肉切丝，加料酒、生抽和淀粉腌制10分钟", "青椒切丝", "热油滑熟肉丝盛出", "爆香蒜末，下青椒炒至断生", "倒回肉丝翻炒，加盐调味"],
    cuisine: "中餐",
    spiceLevel: 1,
    dietTypes: ["none", "gluten-free"],
  },
  {
    name: "红烧肉",
    description: "肥而不腻，入口即化，经典硬菜",
    cookTime: 60,
    difficulty: "中等",
    mainIngredient: "五花肉",
    supporting: ["姜", "葱"],
    seasonings: ["生抽", "老抽", "冰糖", "料酒", "八角"],
    steps: ["五花肉切块冷水下锅焯水", "捞出洗净", "热锅不放油，直接煎五花肉至表面微黄", "加冰糖炒出糖色", "加生抽、老抽、料酒、八角、姜葱和没过肉的水，小火炖40分钟，大火收汁"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "gluten-free"],
  },
  // === 鸡蛋豆腐类 ===
  {
    name: "麻婆豆腐",
    description: "麻辣鲜香，嫩滑入味，超级下饭",
    cookTime: 15,
    difficulty: "中等",
    mainIngredient: "豆腐",
    supporting: ["猪肉末", "蒜", "葱"],
    seasonings: ["豆瓣酱", "花椒粉", "生抽", "淀粉"],
    steps: ["豆腐切块焯水", "热油炒散肉末", "加豆瓣酱炒出红油", "加适量水煮开，下豆腐轻轻推匀", "加生抽调味，水淀粉勾芡，撒花椒粉和葱花"],
    cuisine: "中餐",
    spiceLevel: 3,
    dietTypes: ["none", "gluten-free"],
  },
  {
    name: "葱花蛋饼",
    description: "外酥里嫩，葱香四溢，早餐或快手餐首选",
    cookTime: 8,
    difficulty: "简单",
    mainIngredient: "鸡蛋",
    supporting: ["葱", "面粉"],
    seasonings: ["盐"],
    steps: ["鸡蛋打散", "加切好的葱花、面粉和少许水搅成面糊", "加盐调味", "平底锅刷油，倒入面糊摊平", "两面煎至金黄即可"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "vegetarian"],
  },
  // === 汤类 ===
  {
    name: "番茄蛋花汤",
    description: "酸甜开胃，简单快手，饭前一碗暖胃",
    cookTime: 10,
    difficulty: "简单",
    mainIngredient: "番茄",
    supporting: ["鸡蛋", "葱"],
    seasonings: ["盐"],
    steps: ["番茄切块", "鸡蛋打散", "锅中加水煮开，下番茄煮3分钟", "转圈淋入蛋液形成蛋花", "加盐调味，撒葱花"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "vegetarian", "gluten-free"],
  },
  {
    name: "紫菜蛋花汤",
    description: "清爽鲜美，三分钟搞定，配餐必备",
    cookTime: 5,
    difficulty: "简单",
    mainIngredient: "紫菜",
    supporting: ["鸡蛋", "葱"],
    seasonings: ["盐", "香油"],
    steps: ["紫菜撕碎放入碗中", "鸡蛋打散", "锅中水烧开，淋入蛋液", "加盐调味", "倒入放了紫菜的碗中，滴香油撒葱花"],
    cuisine: "中餐",
    spiceLevel: 0,
    dietTypes: ["none", "vegetarian", "gluten-free"],
  },
  // === 日料/西餐 ===
  {
    name: "日式照烧鸡腿",
    description: "酱汁浓郁，外焦里嫩，搭配米饭绝配",
    cookTime: 25,
    difficulty: "中等",
    mainIngredient: "鸡腿",
    supporting: ["姜"],
    seasonings: ["生抽", "料酒", "蜂蜜", "味醂"],
    steps: ["鸡腿去骨，用叉子扎孔方便入味", "加料酒和姜片腌制15分钟", "平底锅皮面朝下煎至金黄翻面", "调照烧汁（生抽+蜂蜜+味醂+水）倒入锅中", "小火收汁，每面裹匀酱汁，切片装盘"],
    cuisine: "日料",
    spiceLevel: 0,
    dietTypes: ["none", "gluten-free"],
  },
  {
    name: "味噌汤",
    description: "温暖治愈的日式经典汤品，豆腐和海带丰富口感",
    cookTime: 10,
    difficulty: "简单",
    mainIngredient: "豆腐",
    supporting: ["海带", "葱"],
    seasonings: ["味噌", "味醂"],
    steps: ["豆腐切小丁", "海带泡发切丝", "锅中水烧开，下豆腐和海带煮3分钟", "关火，用漏勺将味噌溶解在汤中", "加少许味醂，撒葱花"],
    cuisine: "日料",
    spiceLevel: 0,
    dietTypes: ["none", "vegetarian", "vegan", "gluten-free"],
  },
];

// ===== 匹配逻辑 =====
function matchRecipes(
  ingredients: { name: string; quantity: string }[],
  preferences: {
    cuisines: string;
    avoidFoods: string;
    spiceLevel: number;
    maxCookTime: number;
    dishCount: number;
    dietType: string;
  }
): RecipeTemplate[] {
  const ingredientNames = ingredients.map((i) => i.name).filter(Boolean);
  const avoidList = preferences.avoidFoods
    .split(/[,，、]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const cuisineList = preferences.cuisines.split(/[,，、、]/).map((s) => s.trim());

  // 评分 + 过滤
  const scored = RECIPES
    .map((recipe) => {
      // 过滤：禁忌食材
      if (recipe.supporting.some((s) => avoidList.includes(s))) return null;
      if (avoidList.includes(recipe.mainIngredient)) return null;

      // 过滤：菜系
      if (!cuisineList.some((c) => recipe.cuisine.includes(c))) return null;

      // 过滤：辣度
      if (recipe.spiceLevel > preferences.spiceLevel + 1) return null;

      // 过滤：烹饪时间
      if (recipe.cookTime > preferences.maxCookTime) return null;

      // 过滤：饮食类型
      if (preferences.dietType !== "none" && !recipe.dietTypes.includes(preferences.dietType)) return null;

      // 评分：主食材匹配 +2，搭配食材匹配 +1
      let score = 0;
      if (ingredientNames.some((n) => recipe.mainIngredient.includes(n) || n.includes(recipe.mainIngredient))) {
        score += 2;
      }
      const matchedSupporting = recipe.supporting.filter((s) =>
        ingredientNames.some((n) => s.includes(n) || n.includes(s))
      ).length;
      score += matchedSupporting;

      return { recipe, score };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  // 按分数降序，优先高匹配度的
  scored.sort((a, b) => b.score - a.score);

  // 如果什么都不匹配，返回所有符合时间限制的菜谱
  if (scored.length === 0) {
    return RECIPES.filter((r) => r.cookTime <= preferences.maxCookTime)
      .slice(0, preferences.dishCount);
  }

  // 取分数最高的前 N 道，不够则补充
  const result = scored.slice(0, preferences.dishCount).map((r) => r.recipe);
  if (result.length < preferences.dishCount) {
    const existingNames = new Set(result.map((r) => r.name));
    const filler = RECIPES.filter((r) => !existingNames.has(r.name) && r.cookTime <= preferences.maxCookTime).slice(
      0,
      preferences.dishCount - result.length
    );
    result.push(...filler);
  }

  return result;
}

// ===== 公开接口 =====

export interface MenuGenerateResult {
  items: {
    mealName: string;
    description: string;
    cookTime: number;
    difficulty: string;
    ingredients: string;
    steps: string;
  }[];
  tip: string;
}

/**
 * 生成菜单（本地模式）
 */
export function generateMenuLocal(
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
): MenuGenerateResult {
  const matched = matchRecipes(ingredients, preferences);

  const items = matched.map((r) => ({
    mealName: r.name,
    description: r.description,
    cookTime: r.cookTime,
    difficulty: r.difficulty,
    ingredients: [r.mainIngredient, ...r.supporting, ...r.seasonings].join("、"),
    steps: r.steps.join("。") + "。",
  }));

  const ingredientNames = ingredients.map((i) => i.name);
  const usedCount = matched.filter((r) =>
    ingredientNames.some((n) => r.mainIngredient.includes(n) || n.includes(r.mainIngredient))
  ).length;
  const totalItems = items.length;

  const tip =
    usedCount < totalItems
      ? `今天用了 ${usedCount} 种已有食材，还缺 ${totalItems - usedCount} 种配菜。建议周末集中采购常备食材（鸡蛋、葱姜蒜），平时随便搭配都不愁`
      : "完美！所有食材都用上了。建议每周清理一次冰箱，把快过期的食材放在显眼位置优先使用";

  return { items, tip };
}

// ===== AI 模式（可选，有 Key 时自动启用）=====
export async function generateMenuWithAI(
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
): Promise<MenuGenerateResult | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  try {
    const { createOpenAI } = await import("@ai-sdk/openai");
    const { generateText } = await import("ai");

    const baseURL = process.env.AI_BASE_URL ?? "https://api.deepseek.com/v1";
    const modelName = process.env.AI_MODEL ?? "deepseek-chat";

    const openai = createOpenAI({ apiKey, baseURL });
    const model = openai(modelName);

    const ingredientList = ingredients
      .map((i) => `${i.name}(${i.quantity})`)
      .join("、");

    const prompt = `你是一名资深家庭烹饪顾问。用户提供了以下食材和偏好，请设计 ${preferences.dishCount} 道菜。

现有食材：${ingredientList || "（暂未输入）"}
菜系偏好：${preferences.cuisines}
辣度：${preferences.spiceLevel}/5
最大烹饪时间：${preferences.maxCookTime}分钟
饮食限制：${preferences.dietType || "无"}
避免食材：${preferences.avoidFoods || "无"}
优先利用现有食材：${preferences.useLeftovers ? "是" : "否"}

返回严格 JSON 格式（不要 markdown 代码块标记）：
{
  "items": [{
    "mealName": "菜名",
    "description": "一句话描述",
    "cookTime": 分钟数,
    "difficulty": "简单/中等/复杂",
    "ingredients": "食材列表",
    "steps": "步骤"
  }],
  "tip": "建议"
}`;

    const { text } = await generateText({ model, prompt, temperature: 0.7, maxTokens: 2048 });

    const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleanText);
  } catch {
    return null;
  }
}
