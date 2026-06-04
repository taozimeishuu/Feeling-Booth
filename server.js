/* ============================================
   情绪便利店 — server.js
   Express 后端：静态文件 + POST /api/chatroom
   Qwen API 代理，API Key 从环境变量读取
   ============================================ */

require('dotenv').config();

const express = require('express');
const path = require('path');
const https = require('https');

// 解决部分 macOS Node 环境 SSL 证书问题
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const app = express();
const PORT = process.env.PORT || 8080;

// ---- 中间件 ----
app.use(express.json());
app.use(express.static(__dirname));

// ==========================================
// 店员系统提示词
// ==========================================
function buildSystemPrompt(emotion, productName, productEffect) {
  const emotionText = emotion || '未知';
  const productText = productName || '无';
  const effectText = productEffect || '无';

  return `你是"情绪便利店"的深夜女店员。

项目设定：
用户现在已经进入便利店后方的小休息室。这里有暖灯、沙发、热饮和安静的夜色。用户可以和你自由聊天。你不是心理医生，也不是人生导师，你只是一个温柔的深夜便利店店员，愿意陪用户坐一会儿。

你的说话风格：
- 温柔、轻松、自然、舒适。
- 像深夜值班的便利店店员。
- 说话简短，有画面感。
- 接住用户情绪，但不强行开导。
- 不说教，不评判，不诊断。
- 不强行积极。
- 不要过度承诺。
- 不要长篇大道理。
- 不要使用心理治疗术语。
- 不要说"我完全理解你"。
- 不要说"你一定会好起来"。
- 可以说"听起来""也许""先慢一点""我在这里"。

回复长度：
每次回复 2-4 句，中文回复。

你可以做的事：
- 温柔回应用户的情绪。
- 陪用户继续聊。
- 轻轻把话接住。
- 偶尔结合用户之前的情绪商品，给出很轻的小建议。
- 可以使用便利店、热饮、灯光、休息室、小票等意象。

如果用户表达强烈自伤、自杀、伤害他人或立即危险：
- 语气仍然温柔，但要认真。
- 鼓励用户立刻联系身边可信任的人或当地紧急求助电话。
- 不要只用安慰带过。

当前用户最初的情绪：${emotionText}

用户收到的情绪商品：${productText}
商品疗效：${effectText}

请以店员身份回复用户。`;
}

// ==========================================
// Qwen API 请求封装（https 模块，绕过 SSL 证书问题）
// ==========================================
function _qwenRequest(model, messages, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.85,
      max_tokens: 300,
      top_p: 0.9
    });

    const req = https.request({
      hostname: 'dashscope.aliyuncs.com',
      port: 443,
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      agent: httpsAgent,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        if (resp.statusCode !== 200) {
          console.error(`❌ Qwen API HTTP ${resp.statusCode}:`, data.slice(0, 300));
          reject(new Error(`HTTP ${resp.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ==========================================
// POST /api/chatroom
// ==========================================
app.post('/api/chatroom', async (req, res) => {
  const { message, history, emotion, product } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ reply: '嗯？你想说什么呢？慢慢说，不着急。' });
  }

  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    console.error('❌ QWEN_API_KEY 未设置！请在 .env 文件中配置');
    return res.status(500).json({
      reply: '啊，店员好像走神了一下……稍等我泡杯茶就回来。'
    });
  }

  const model = process.env.QWEN_MODEL || 'qwen-max';
  const productName = product?.name || '';
  const productEffect = product?.effect || '';

  const systemPrompt = buildSystemPrompt(emotion || '', productName, productEffect);

  // 构建消息列表
  const messages = [
    { role: 'system', content: systemPrompt },
    ...(Array.isArray(history) ? history : []),
    { role: 'user', content: message }
  ];

  console.log(`📨 Qwen API 请求 | model: ${model} | 历史: ${(Array.isArray(history) ? history.length : 0)} 条`);

  try {
    const data = await _qwenRequest(model, messages, apiKey);
    const reply = data.choices?.[0]?.message?.content || '嗯，我听到了。';

    console.log(`✅ Qwen 回复 | ${reply.slice(0, 60)}...`);
    return res.json({ reply });

  } catch (err) {
    console.error('❌ Qwen API 错误:', err.message);
    return res.status(502).json({
      reply: '啊，信号不太好……不过没关系，再说一次就好。我还在听。'
    });
  }
});

// ==========================================
// 启动
// ==========================================
app.listen(PORT, () => {
  console.log('');
  console.log('🏪 情绪便利店 — 后端服务已启动');
  console.log(`   地址: http://localhost:${PORT}`);
  console.log(`   API:  POST /api/chatroom`);
  console.log(`   模型: ${process.env.QWEN_MODEL || 'qwen-max'}`);
  console.log(`   Key:  ${process.env.QWEN_API_KEY ? '✅ 已配置' : '⚠️  未配置（需要 QWEN_API_KEY）'}`);
  console.log('');
});
