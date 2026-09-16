# 图片资源目录

```
images/
├── covers/          # 梗封面图（建议 800x450 或 4:3）
├── avatars/         # 用户头像
└── illustrations/   # 空状态、404 等插画（当前已内置 NeoBrutalism 风格 SVG）
```

## 使用方式

1. 把图片放进对应目录，例如 `covers/ke-mu-san.jpg`；
2. 在 `src/data/memes.ts` 里给对应梗补上 `coverImage` 字段：

```ts
import keMuSan from '@/assets/images/covers/ke-mu-san.jpg';

{
  id: 9,
  title: '科目三',
  cover: 'linear-gradient(135deg, #00CEC9, #6C5CE7)',
  coverImage: keMuSan,   // 有图时优先渲染图片
  coverEmoji: '💃',
  // ...
}
```

`MemeCover` 组件会自动处理降级：`coverImage` 存在时渲染 `<img>`，
图片加载失败或字段为空时自动回退到 `cover` 渐变 + `coverEmoji`。

`covers/example-cover.svg` 是一张封面模板，可以直接替换成真实图片。

> 注意：所有图片请通过 `import` 引入（Vite 会处理打包与哈希），不要写绝对路径。