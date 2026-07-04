"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import MenuCard from "@/components/menu-card";
import type { Ingredient } from "@/types";

interface MenuResult {
  id: number;
  name: string;
  items: {
    id: number;
    mealName: string;
    description: string;
    cookTime: number;
    difficulty: string;
    ingredients: string;
    steps: string;
  }[];
  tip: string | null;
  createdAt: string;
}

export default function GeneratePage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<MenuResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ingredients")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setIngredients(json.data);
          setSelectedIds(new Set(json.data.map((i: Ingredient) => i.id)));
        }
      })
      .catch(console.error);
  }, []);

  const toggleIngredient = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredientIds: Array.from(selectedIds),
        }),
      });
      const json = await res.json();

      if (json.ok) {
        setResult(json.data);
      } else {
        setError(json.error || "生成失败，请重试");
      }
    } catch (e) {
      setError("网络错误，请检查连接");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold mb-1">🤖 一键生成菜单</h1>
        <p className="text-sm text-gray-400 mb-6">
          选择要用的食材，AI 帮你配成一顿饭
        </p>

        {/* 食材选择 */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            选择食材（{selectedIds.size} 种已选）
          </h2>
          {ingredients.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              还没有食材，先去{" "}
              <a href="/ingredients" className="text-green-500 underline">
                添加食材
              </a>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleIngredient(item.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedIds.has(item.id)
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {item.name} {item.quantity}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
          disabled={generating || ingredients.length === 0}
          className="w-full py-4 bg-green-500 text-white rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 mb-6"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-pulse">AI 思考中...</span>
            </span>
          ) : (
            "✨ 一键生成菜单"
          )}
        </button>

        {/* 错误 */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 结果 */}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">🍽️ {result.name}</h2>
            </div>

            <div className="space-y-3 mb-4">
              {result.items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>

            {result.tip && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-700">
                💡 {result.tip}
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
