# 🏪 情绪便利店

一个 16:9 横屏互动网页 / 视觉小说项目。

**风格**：夜晚、便利店、暖黄色灯光、温柔、治愈、低压力、轻互动。

---

## 🚀 快速开始

1. **确保图片素材已就位**
   ```bash
   bash setup.sh
   ```

2. **用浏览器打开**
   ```
   双击 index.html 即可
   ```

3. **如果图片不对**
   编辑 `asset-map.json`，把每个 `source` 字段改成正确的 UUID 文件名，再运行一次 `bash setup.sh`。

---

## 📁 项目结构

```
├── index.html              # 入口文件
├── asset-map.json          # 图片映射配置（可编辑）
├── setup.sh                # 素材重命名脚本
├── assets/                 # 整理后的图片（由 setup.sh 生成）
│   ├── backgrounds/        # 8 张背景图
│   ├── sprites/            # 12 张店员立绘
│   └── items/              # 2 张商品图
├── css/
│   ├── main.css            # 布局、配色、对话框
│   └── animations.css      # 浮动、眨眼、过渡动效
├── js/
│   ├── config.js           # 全局常量
│   ├── state.js            # 游戏状态管理
│   ├── scenes.js           # 场景数据（剧情内容）
│   ├── scene-manager.js    # 场景加载与过渡
│   ├── animation-controller.js  # 角色动效
│   ├── dialog.js           # 对话框与打字机
│   └── llm-mock.js         # LLM 占位（Part 2 替换为真实 API）
└── README.md
```

---

## 🎮 操作方式

- **点击对话框**：快进 / 继续
- **点击选项按钮**：做出选择
- **休息区**：自由输入文字，和店员聊天
- **按回车**：发送聊天消息

---

## 🛠 修改图片映射

打开 `asset-map.json`，每个条目都有一个 `hint` 字段描述图片内容。找到对应的 UUID 文件，更新 `source` 字段，然后运行：

```bash
bash setup.sh
```

---

## 🧩 Part 2 接入 LLM

在 `js/config.js` 中设置：

```javascript
LLM_API_ENDPOINT: 'https://your-api.com/chat'
```

API 期望的请求格式见 `js/llm-mock.js` 中的 `_callRealAPI` 方法注释。

---

## 📝 添加新场景

在 `js/scenes.js` 的 `SCENES` 数组中添加对象：

```javascript
{
  id: 'my_scene',           // 唯一 ID
  background: 'bg_inside',  // 背景 key
  expression: 'smile',      // 店员表情
  dialog: [                 // 对话框序列
    { speaker: 'clerk', text: '你好。' }
  ],
  choices: [                // 选项（可选）
    { text: '下一步', nextScene: 'other_scene', action() { /* 回调 */ } }
  ],
  onEnter() { /* 入场回调 */ }
}
```

---

## 💛 开发理念

- 无惩罚、无倒计时、无失败
- 所有选择都有效
- 文字温柔而有质感
- 尊重玩家的节奏
