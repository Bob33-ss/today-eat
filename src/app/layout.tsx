import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今日菜单 — 冰箱有什么就吃什么",
  description: "输入食材，AI 帮你生成菜单。减少食物浪费，告别选择焦虑。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen pb-20">{children}</body>
    </html>
  );
}
