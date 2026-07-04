// ===== 食材 =====
export interface IngredientInput {
  name: string;
  category: string;
  quantity: string;
  expiryAt?: string;
}

export interface Ingredient extends IngredientInput {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// ===== 偏好 =====
export interface PreferenceInput {
  dietType: string;
  avoidFoods: string;
  cuisines: string;
  spiceLevel: number;
  maxCookTime: number;
  dishCount: number;
  useLeftovers: boolean;
}

export interface Preference extends PreferenceInput {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// ===== 菜单 =====
export interface MenuItemResult {
  mealName: string;
  description: string;
  cookTime: number;
  difficulty: string;
  ingredients: string;
  steps: string;
}

export interface MenuResult {
  name: string;
  items: MenuItemResult[];
  tip?: string;
}

// ===== API =====
export interface GenerateRequest {
  ingredients: { id: number; name: string; quantity: string }[];
  preferences: PreferenceInput;
}

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}
