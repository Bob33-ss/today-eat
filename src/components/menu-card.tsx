"use client";

interface MenuItem {
  mealName: string;
  description: string;
  cookTime: number;
  difficulty: string;
  ingredients: string;
  steps: string;
}

interface Props {
  item: MenuItem;
}

export default function MenuCard({ item }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-lg text-gray-900">
          {item.mealName}
        </h3>
        <div className="flex gap-2 text-xs">
          <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
            {item.cookTime}分钟
          </span>
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {item.difficulty}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{item.description}</p>

      <div className="text-sm mb-3">
        <span className="text-gray-400 text-xs">食材：</span>
        <span className="text-gray-700">{item.ingredients}</span>
      </div>

      <details className="text-sm">
        <summary className="text-green-600 cursor-pointer hover:text-green-700">
          查看步骤
        </summary>
        <p className="mt-2 text-gray-600 whitespace-pre-line">{item.steps}</p>
      </details>
    </div>
  );
}
