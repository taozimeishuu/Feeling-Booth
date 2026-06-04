# 🏪 情绪便利店

一个 16:9 横屏互动网页 / 视觉小说项目。

**风格**：夜晚、便利店、暖黄色灯光、温柔、治愈、低压力、轻互动。

---

## 🚀 快速开始

### 1. 配置 API Key

```bash
cp .env.example .env
# 编辑 .env，填入你的 Qwen API Key
# QWEN_API_KEY=sk-your-api-key-here
```

API Key 获取地址：https://dashscope.console.aliyun.com/apiKey

### 2. 安装依赖

```bash
npm install
```

### 3. 启动后端服务

```bash
npm start
# 或: node server.js
```

### 4. 打开浏览器

```
http://localhost:8080
```

---

## 📁 项目结构

```
├── index.html              # 入口文件
├── server.js               # Express 后端（静态文件 + /api/chatroom）
├── package.json            # Node 依赖
├── .env.example            # 环境变量模板
├── setup.sh                # 素材复制脚本
├── material/               # 动画素材（webp）
├── assets/                 # 图片资源
│   ├── backgrounds/        # 9 张背景图
│   ├── sprites/            # 25 张店员立绘
│   └── items/              # 2 张商品图
├── css/
│   ├── main.css            # 布局、配色、对话框、小票
│   └── animations.css      # 浮动、眨眼、过渡动效
├── js/
│   ├── config.js           # 全局常量与图片映射
│   ├── state.js            # 游戏状态管理
│   ├── scenes.js           # 场景数据（21 个场景）
│   ├── scene-manager.js    # 场景加载与过渡
│   ├── animation-controller.js  # 角色浮动 + 眨眼
│   ├── dialog.js           # 对话框与打字机
│   ├── tts.js              # 店员语音合成
│   └── llm-mock.js         # 聊天模块（Qwen API + 本地降级）
└── README.md
```

---

## 🛠 API 接口

### POST /api/chatroom

前端发送：
```json
{
  "message": "用户本轮输入",
  "history": [
    {"role": "user", "content": "之前用户说的话"},
    {"role": "assistant", "content": "之前店员回复"}
  ],
  "emotion": "用户情绪",
  "product": {
    "name": "情绪商品名",
    "effect": "商品疗效"
  }
}
```

后端返回：
```json
{
  "reply": "店员回复内容"
}
```

---

## 🔧 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `QWEN_API_KEY` | 阿里云 DashScope API Key | 必填 |
| `QWEN_MODEL` | Qwen 模型名 | `qwen-max` |
| `PORT` | 服务端口 | `8080` |

---

## 🎮 操作方式

- **点击对话框**：快进 / 继续
- **点击选项按钮**：做出选择
- **休息区**：自由输入文字，和店员聊天
- **按回车**：发送聊天消息
- **🔊 按钮**：切换店员语音开关

---

## 💛 开发理念

- 无惩罚、无倒计时、无失败
- 所有选择都有效
- 文字温柔而有质感
- 尊重玩家的节奏
