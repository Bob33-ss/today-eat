"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import PreferenceSelector from "@/components/preference-selector";
import type { Preference, PreferenceInput } from "@/types";

const DEFAULT_PREF: PreferenceInput = {
  dietType: "none",
  avoidFoods: "",
  cuisines: "中餐",
  spiceLevel: 0,
  maxCookTime: 30,
  dishCount: 2,
  useLeftovers: true,
};

export default function PreferencesPage() {
  const [pref, setPref] = useState<PreferenceInput>(DEFAULT_PREF);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/preferences")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data) {
          setPref({
            dietType: json.data.dietType,
            avoidFoods: json.data.avoidFoods,
            cuisines: json.data.cuisines,
            spiceLevel: json.data.spiceLevel,
            maxCookTime: json.data.maxCookTime,
            dishCount: json.data.dishCount,
            useLeftovers: json.data.useLeftovers,
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pref),
      });
      const json = await res.json();
      if (json.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error("Failed to save preferences", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 pt-6">
          <p className="text-gray-400 text-sm text-center py-8">加载中...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-6">
        <h1 className="text-xl font-bold mb-1">😋 口味偏好</h1>
        <p className="text-sm text-gray-400 mb-6">
          告诉 AI 你喜欢吃什么，生成菜单时会参考你的选择
        </p>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <PreferenceSelector value={pref} onChange={setPref} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : saved ? "✅ 已保存" : "保存偏好设置"}
        </button>
      </main>
    </>
  );
}
