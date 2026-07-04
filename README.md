# 今日菜单 (Today Eat)

冰箱有什么，就吃什么。输入食材 → AI 生成菜单，减少食物浪费与选择焦虑。

## 技术栈

- **框架**: Next.js 16 + TypeScript (App Router)
- **数据库**: Prisma + PostgreSQL (Supabase)
- **AI**: DeepSeek API（OpenAI 兼容接口）
- **样式**: Tailwind CSS v4
- **部署**: Vercel

## 核心功能

| 功能 | 说明 |
|------|------|
| 食材管理 | 记录冰箱中的食材名称、数量、分类、保质期 |
| 口味偏好 | 设置菜系偏好、辣度、烹饪时长、饮食限制 |
| AI 菜单生成 | 选择食材 → AI 搭配 → 输出菜谱（含步骤） |
| 历史记录 | 查看之前生成的菜单 |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 填入 DATABASE_URL、DIRECT_URL、AI_API_KEY

# 3. 初始化数据库
npm run db:push
npm run db:seed

# 4. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 环境变量

| 变量 | 用途 | 获取方式 |
|------|------|----------|
| `DATABASE_URL` | PostgreSQL 连接串（连接池模式） | Supabase Database Settings |
| `DIRECT_URL` | PostgreSQL 连接串（直连模式） | Supabase Database Settings |
| `AI_API_KEY` | DeepSeek API Key | https://platform.deepseek.com |
| `AI_BASE_URL` | AI 接口地址（可选，默认 DeepSeek） | |
| `AI_MODEL` | AI 模型名（可选，默认 deepseek-chat） | |

## 部署 (Vercel)

1. 推送代码到 GitHub
2. 在 Vercel 导入仓库
3. 添加上述环境变量
4. 部署完成后访问 `https://域名/api/setup` 初始化数据库

## 目录结构

```
src/
├── app/
│   ├── api/
│   │   ├── generate-menu/   # AI 菜单生成 API
│   │   ├── ingredients/     # 食材 CRUD API
│   │   ├── preferences/     # 偏好设置 API
│   │   ├── history/         # 历史菜单 API
│   │   └── setup/           # 数据库初始化
│   ├── generate/            # 一键生成菜单页
│   ├── ingredients/         # 食材管理页
│   ├── preferences/         # 偏好设置页
│   ├── history/             # 历史记录页
│   ├── page.tsx             # 首页
│   └── layout.tsx           # 根布局
├── components/              # UI 组件
├── lib/                     # 工具库
└── types/                   # 类型定义
```

## 商业模式

- **免费版**: 基础食材管理 + AI 菜单生成
- **高级订阅**: 营养分析、批量周计划生成、食材过期提醒、购物清单导出
