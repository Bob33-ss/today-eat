"use client";

import type { PreferenceInput } from "@/types";
import { CUISINE_OPTIONS } from "@/lib/utils";

interface Props {
  value: PreferenceInput;
  onChange: (value: PreferenceInput) => void;
}

export default function PreferenceSelector({ value, onChange }: Props) {
  const update = (key: keyof PreferenceInput, val: string | number | boolean) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="space-y-4">
      {/* 菜系偏好 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          偏好的菜系
        </label>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => update("cuisines", c)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                value.cuisines === c
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 辣度 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          辣度：{value.spiceLevel === 0 ? "不辣" : `${value.spiceLevel}分辣`}
        </label>
        <input
          type="range"
          min={0}
          max={5}
          value={value.spiceLevel}
          onChange={(e) => update("spiceLevel", Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>不辣</span>
          <span>微辣</span>
          <span>中辣</span>
          <span>特辣</span>
        </div>
      </div>

      {/* 烹饪时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          最长烹饪时间：{value.maxCookTime} 分钟
        </label>
        <div className="flex gap-2">
          {[15, 30, 60].map((t) => (
            <button
              key={t}
              onClick={() => update("maxCookTime", t)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                value.maxCookTime === t
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {t}分钟
            </button>
          ))}
        </div>
      </div>

      {/* 菜品数量 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          每餐菜数：{value.dishCount} 道
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => update("dishCount", n)}
              className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                value.dishCount === n
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {n} 道
            </button>
          ))}
        </div>
      </div>

      {/* 饮食限制 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          饮食限制
        </label>
        <select
          value={value.dietType}
          onChange={(e) => update("dietType", e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
        >
          <option value="none">无特殊限制</option>
          <option value="vegetarian">素食（蛋奶）</option>
          <option value="vegan">纯素</option>
          <option value="gluten-free">无麸质</option>
        </select>
      </div>

      {/* 避免食材 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          避免的食材（逗号分隔）
        </label>
        <input
          type="text"
          value={value.avoidFoods}
          onChange={(e) => update("avoidFoods", e.target.value)}
          placeholder="香菜、芹菜、胡萝卜"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* 利用剩菜 */}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={value.useLeftovers}
          onChange={(e) => update("useLeftovers", e.target.checked)}
          className="rounded border-gray-300"
        />
        优先利用现有食材（剩菜友好模式）
      </label>
    </div>
  );
}
