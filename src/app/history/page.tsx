"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";

interface MenuHistory {
  id: number;
  name: string;
  createdAt: string;
  menuItems: {
    id: number;
    mealName: string;
    cookTime: number;
    difficulty: string;
  }[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<MenuHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setHistory(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold mb-1">📋 历史菜单</h1>
        <p className="text-sm text-gray-400 mb-6">查看之前的 AI 推荐记录</p>

        {loading ? (
          <p className="text-gray-400 text-sm text-center py-8">加载中...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm">还没有生成过菜单</p>
            <p className="text-xs mt-1">去「生成菜单」页面试试</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{menu.name}</h3>
                  <span className="text-xs text-gray-400">
                    {new Date(menu.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {menu.menuItems.map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-1 bg-gray-50 rounded text-xs text-gray-600"
                    >
                      {item.mealName} · {item.cookTime}分钟
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
