# 抽象梗百科 · NEO-BRUTALISM EDITION

把原来的单文件 HTML 原型（`抽象梗百科-NeoBrutalism版.html`）重构为工程化前端项目：
组件拆分、类型完整、状态可持久化，视觉仍然是**亮黄主色 + 粗黑边框 + 硬阴影 + 零圆角 + 超粗字体**的新粗野主义风格。

## 在线演示

<https://zhaoxhqct.github.io/abstract-meme-encyclopedia/>

推送到 `main` 后由 GitHub Actions（见 `.github/workflows/deploy.yml`）自动构建并发布到 GitHub Pages。
因为是 SPA，构建时会把 `index.html` 复制一份为 `404.html` 兜住深链，所以直接打开 `…/meme/1` 这类地址也能正常渲染（HTTP 状态码仍是 404，仅用于演示）。

## 数据与免责说明

- `src/data/memes.ts` 是演示用的示例数据：正文、简介、时间与数字为示例文本，用于展示界面与交互。
- 其中涉及真实人物（含已故者）的条目属于玩梗/地狱笑话记录，描述梗本身的用法与语境，不代表当事人言论，也不作为事实陈述。
- 引用他人言论前请自行核对来源；需要严肃考据时，请替换为你自己核实过的内容。

## 技术栈

| 层级 | 选型 |
| --- | --- |
| 构建 | Vite 5 |
| 框架 | React 18 + TypeScript（`strict`，无 `any`） |
| 样式 | TailwindCSS 3（自定义 nb 主题）+ 少量自定义 CSS |
| 路由 | React Router v6 |
| 状态 | Zustand（+ `persist` 持久化到 localStorage） |
| 动画 | Framer Motion |
| 数据 | 本地 Mock 数据 + localStorage |

没有引入任何 UI 组件库，也没有用 CSS-in-JS，所有组件手写。

## 运行方式

```bash
cd meme-encyclopedia
npm install
npm run dev        # 开发服务器，默认 http://localhost:5173
```

其它脚本：

```bash
npm run typecheck  # tsc --noEmit，检查类型
npm run build      # 先类型检查，再打包到 dist/
npm run preview    # 预览打包产物
```

## 页面路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页：轮播 + 分类筛选 + 热门梗 + 最新发布 + 热度榜 / 梗知识侧栏 |
| `/explore` | 探索页：分类 + 关键词 + 排序（筛选条件同步到 URL，如 `/explore?sort=hot`） |
| `/meme/:id` | 详情页：封面 + 元信息 + 操作栏 + 正文 + 评论区 + 数据统计 / 相关推荐 |
| `/publish` | 发布页：表单 + 实时预览 + 投稿须知（需登录） |
| `/publish/:id` | 编辑页：复用发布页组件，仅作者可编辑，可删除、可设为私密 |
| `/profile` | 个人主页：资料头部 + 我发布的 / 我点赞的 / 我收藏的 |
| `/search?q=` | 搜索页：搜索历史、热门搜索词、结果列表 |
| `/category/:id` | 分类专属页：每个分类有独立主题色 |
| `/404` 及未匹配路由 | 404 页面 |

## 目录结构

```
meme-encyclopedia/
├── public/                     # favicon 等无需构建的静态文件
├── src/
│   ├── assets/images/          # 封面图（covers/）、头像（avatars/）、插画（illustrations/）
│   ├── components/
│   │   ├── auth/               # LoginModal
│   │   ├── comment/            # CommentInput / CommentList / CommentSection
│   │   ├── layout/             # Navbar / Footer / Layout / PageContainer
│   │   ├── meme/               # MemeCover / MemeCard / MemeGrid / Carousel / RankList ...
│   │   ├── profile/            # ProfileHeader / ProfileEditModal
│   │   └── ui/                 # Button / Card / Tag / Badge / Modal / Toast / Skeleton ...
│   ├── data/memes.ts           # Mock 数据（12 条梗、分类、评论、封面预设、演示用户）
│   ├── hooks/                  # useMeme / useAuth / useToast / useSearchHistory / useLoading
│   ├── pages/                  # 9 个页面组件
│   ├── store/                  # useMemeStore / useUserStore / useUiStore
│   ├── types/index.ts          # 全局类型定义
│   ├── utils/                  # cn / format / meme（筛选排序）/ image（压缩上传）
│   ├── App.tsx                 # 路由表
│   ├── main.tsx                # 入口
│   └── index.css               # Tailwind 入口 + 主题工具类
├── index.html
├── tailwind.config.js          # nb 主题：颜色 / 阴影 / 边框宽度 / 动画
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## 数据与持久化

- 首次打开时，`useMemeStore` 会把 `src/data/memes.ts` 里的 Mock 数据写入 localStorage（键名 `nb-meme-encyclopedia`）。
- 登录状态、点赞、收藏、个人资料保存在 `nb-user-store`；搜索历史保存在 `nb-search-history`。
- 发布 / 编辑 / 删除梗、发表评论、点赞都会即时写回 store，刷新不丢失。
- 想恢复初始数据：个人主页 →「♻️ 重置数据」。

## 图片资源策略

- 视觉默认用 **CSS 渐变 + emoji** 占位，不依赖外部图片，离线也能跑。
- `MemeCover` 是唯一的封面组件，渲染优先级：`coverImage` 真实图片 → 加载失败或未配置时降级为 `cover` 渐变 + `coverEmoji`，所以图片 404 时页面也不会崩。
- 发布页的「封面风格」支持上传本地图片，图片会先在 canvas 里等比压缩（最长边 900px、JPEG 0.82）再存成 dataURL，避免原图撑爆 localStorage。
- 替换真实图片：把图片放进 `src/assets/images/covers/`，在 `src/data/memes.ts` 对应数据里补上 `coverImage` 字段即可，组件代码不用改。

## 在原型基础上新增的能力

- **工程化**：原型里的 `innerHTML` 渲染拆成 40+ 个带 JSDoc 的组件，数据、筛选、格式化逻辑抽到 hooks 与 utils。
- **动效**：页面切换入场、卡片错峰入场、点赞爱心爆炸粒子、轮播进度条与滑动缩放、按钮 hover 位移 + 阴影放大。
- **空状态与加载态**：每个列表页都有插画空状态；首页 / 探索页有保持粗黑边条纹风格的骨架屏。
- **可访问性**：语义化标签、`aria-pressed` / `aria-expanded` / `aria-current`、统一的 `:focus-visible` 描边、键盘可操作的弹窗（ESC 关闭）。
- **评论系统**：二级回复、评论点赞、删除自己的评论。
- **梗管理**：发布后可编辑、可删除、可设为私密（私密梗只在作者个人主页出现）。
- **搜索增强**：独立搜索路由，含搜索历史（最多 8 条）与热门搜索词。
- **分类页**：每个分类有独立主题色与分类导航。
- **个人资料**：可改用户名、头像（emoji 预设或上传图片）、简介、邮箱。
- **数据统计**：详情页展示 mock 的浏览趋势柱状图。

## 仍未实现（保留为后续项）

- 暗黑模式切换（原型未涉及，需要为 nb 主题补一套深色变量）
- 分享卡片生成图片（当前只做复制链接）
- 通知中心 `/notifications`、收藏夹分组
- 真实后端接口：目前所有写操作都停留在本地 localStorage

## 说明

- Mock 数据中的梗内容来自原型原型文本，仅用于演示。
- 依赖版本：React 18.3、React Router 6.27、Zustand 4.5、Framer Motion 11、Tailwind 3.4、Vite 5.4、TypeScript 5.6。
