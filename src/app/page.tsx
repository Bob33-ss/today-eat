"use client";

import Link from "next/link";
import Header from "@/components/header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-8">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            冰箱有什么，就吃什么
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            输入家中现有食材，AI 帮你搭配成餐。
            告别「做什么菜」的选择焦虑，减少食物浪费。
          </p>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-2 gap-3 mb-8">
          <Link
            href="/ingredients"
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-1">🥦</div>
            <div className="font-semibold text-sm">管理食材</div>
            <div className="text-xs text-gray-400">记录冰箱里有什么</div>
          </Link>

          <Link
            href="/preferences"
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-2xl mb-1">😋</div>
            <div className="font-semibold text-sm">口味偏好</div>
            <div className="text-xs text-gray-400">设置菜系与忌口</div>
          </Link>

          <Link
            href="/generate"
            className="col-span-2 bg-green-500 rounded-xl p-5 text-white hover:bg-green-600 transition-colors text-center"
          >
            <div className="text-3xl mb-1">🤖</div>
            <div className="font-bold text-lg">一键生成菜单</div>
            <div className="text-green-100 text-sm">
              AI 根据食材和偏好推荐今日菜谱
            </div>
          </Link>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-semibold text-gray-700 mb-3">怎么用</h2>
          <div className="space-y-3">
            {[
              { step: "1", title: "记录食材", desc: "把冰箱里的食材添加到列表中" },
              { step: "2", title: "设好偏好", desc: "告诉 AI 你爱吃什么、不吃什么" },
              { step: "3", title: "一键生成", desc: "AI 自动搭配，生成今日菜单" },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-300 mt-10">
          今日菜单 · 减少浪费 · 好好吃饭
        </p>
      </main>
    </>
  );
}
