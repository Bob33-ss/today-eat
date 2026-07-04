"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import IngredientInput from "@/components/ingredient-input";
import type { Ingredient } from "@/types";

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIngredients = async () => {
    try {
      const res = await fetch("/api/ingredients");
      const json = await res.json();
      if (json.ok) setIngredients(json.data);
    } catch (e) {
      console.error("Failed to fetch ingredients", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleAdd = async (name: string, category: string, quantity: string) => {
    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, quantity }),
      });
      const json = await res.json();
      if (json.ok) {
        setIngredients((prev) => [json.data, ...prev]);
      }
    } catch (e) {
      console.error("Failed to add ingredient", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/ingredients?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.ok) {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (e) {
      console.error("Failed to delete ingredient", e);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold mb-4">🥦 我的食材</h1>

        {/* Input */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6 shadow-sm">
          <IngredientInput onAdd={handleAdd} />
        </div>

        {/* List */}
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">加载中...</p>
        ) : ingredients.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🧊</div>
            <p className="text-sm">冰箱空空如也</p>
            <p className="text-xs mt-1">添加食材来开始吧</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-50 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-sm">{item.name}</span>
                  <span className="text-gray-400 text-sm ml-2">
                    {item.quantity}
                  </span>
                  <span className="text-xs text-gray-300 ml-2">
                    {item.category}
                  </span>
                  {item.expiryAt && (
                    <span className="text-xs text-orange-400 ml-2">
                      过期: {new Date(item.expiryAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-300 hover:text-red-400 text-sm transition-colors"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
