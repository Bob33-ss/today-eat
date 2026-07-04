"use client";

import { useState } from "react";
import { INGREDIENT_CATEGORIES } from "@/lib/utils";

interface Props {
  onAdd: (name: string, category: string, quantity: string) => void;
}

export default function IngredientInput({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("蔬菜");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !quantity.trim()) return;
    onAdd(name.trim(), category, quantity.trim());
    setName("");
    setQuantity("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
      <div className="flex-1 min-w-[120px]">
        <label className="block text-xs text-gray-500 mb-1">食材</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="番茄"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="w-24">
        <label className="block text-xs text-gray-500 mb-1">数量</label>
        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="2个"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="w-24">
        <label className="block text-xs text-gray-500 mb-1">分类</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        >
          {INGREDIENT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
      >
        + 添加
      </button>
    </form>
  );
}
