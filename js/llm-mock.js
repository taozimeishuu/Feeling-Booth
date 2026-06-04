/* ============================================
   情绪便利店 — llm-mock.js
   聊天模块：优先调用后端 /api/chatroom（Qwen）
   后端不可用时降级为本地预设回复
   ============================================ */

const LLM = {
  /** 发送消息 */
  async sendMessage(userText, chatHistory) {
    // 构建符合后端格式的历史记录
    const history = chatHistory
      .filter(m => m.role === 'player' || m.role === 'clerk')
      .map(m => ({
        role: m.role === 'clerk' ? 'assistant' : 'user',
        content: m.text
      }));

    // 尝试调用后端 Qwen API
    try {
      const reply = await this._callBackend(userText, history);
      if (reply) return reply;
    } catch (err) {
      console.warn('⚠️ 后端 API 不可用，使用本地回复:', err.message);
    }

    // 降级：本地 mock 回复
    return this._getLocalResponse(userText, chatHistory);
  },

  /** 调用后端 /api/chatroom */
  async _callBackend(userText, history) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const resp = await fetch('/api/chatroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: history.slice(-20),   // 最近 20 轮
          emotion: GameState.selectedDrinkDesc || '',
          product: {
            name: GameState.selectedDrink || '',
            effect: GameState.selectedDrinkDesc || ''
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!resp.ok) return null;

      const data = await resp.json();
      return data.reply || null;

    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  },

  /** 调用真实 LLM API（旧版兼容） */
  async _callRealAPI(userText, chatHistory) {
    return null; // 已迁移到 _callBackend
  },

  // ==========================================
  // 本地预设回复（降级用）
  // ==========================================
  _getLocalResponse(userText, chatHistory) {
    const t = userText;

    // ---- 疲惫 / 累 ----
    if (/累|疲惫|困|乏|没力气|没电|低电量/.test(t)) {
      return this._pick([
        '累了就坐下来歇一歇吧。不用急着好起来，先让自己的呼吸慢一点。',
        '嗯，感觉到了。那就先什么都不做，在这里安静地坐一会儿。',
        '辛苦了一天吧。来，深呼吸——这里很安全，不用撑着了。',
        '低电量的时候，最需要的不是充电宝，而是一个可以不用说话的地方。'
      ]);
    }

    // ---- 难过 / 伤心 ----
    if (/难过|伤心|哭|不开心|低落|沮丧|委屈/.test(t)) {
      return this._pick([
        '难过的情绪也是情绪，不用急着赶它走。它可能只是想被你看见。',
        '嗯……我在这里陪你。不需要说什么，就这样待一会儿也可以。',
        '心里下雨的时候，不用撑着伞跑。慢慢走，雨总会停的。',
        '委屈的感觉，有时候比难过更不好受。谢谢你愿意说出来。'
      ]);
    }

    // ---- 焦虑 / 不安 ----
    if (/焦虑|担心|不安|慌|紧张|压力|怕/.test(t)) {
      return this._pick([
        '心里很慌的时候，先把手放在桌子上，感觉一下它的温度。不用马上想明白。',
        '焦虑不是你的错。它只是身体在说：我需要一点安全感。',
        '不用一下子把所有事情都想清楚。先把眼前的这一小步走好。',
        '紧张的时候，试着慢慢吐一口气——对，就这样。不用一次就放松下来。'
      ]);
    }

    // ---- 孤独 ----
    if (/孤独|一个人|寂寞|没人/.test(t)) {
      return this._pick([
        '一个人走夜路是会有点冷。但你看，便利店的灯还亮着呢。',
        '孤独和"一个人"不是一回事。而且现在，我也在这里。',
        '我懂那种感觉。不过至少今晚，我们可以一起坐一小会儿。'
      ]);
    }

    // ---- 迷茫 / 未来 ----
    if (/迷茫|未来|不确定|方向|不知道.*怎么办/.test(t)) {
      return this._pick([
        '看不到方向的时候，不用硬往前走。停下来看看周围也可以。',
        '未来确实让人不安。但不用急着看那么远，先把今晚过好，就已经很好了。',
        '迷茫也没关系。每个人都有自己的节奏，走慢一点没人会催你。'
      ]);
    }

    // ---- 开心 / 好事 ----
    if (/开心|高兴|好|棒|幸福|快乐|笑|好消息/.test(t)) {
      return this._pick([
        '真好～开心的时刻值得被记住。要不要给自己一个小小的奖励？',
        '看你开心，我也觉得暖暖的。',
        '那太好了。能听到你分享开心的事，是今天店里最好的消息。'
      ]);
    }

    // ---- 感谢 ----
    if (/谢谢|感谢|多谢|thanks|thank/.test(t)) {
      return this._pick([
        '不用谢。你能来，对我来说就是最好的事了。',
        '客气啦。你愿意走进来，我已经很高兴了。',
      ]);
    }

    // ---- 告别 ----
    if (/再见|拜拜|走|bye|晚安|离开/.test(t)) {
      return this._pick([
        '路上小心。下次想来的时候，这里都亮着灯。',
        '晚安。回去的路上慢一点，对自己好一点。',
        '拜拜～不一定要等到难过的时候才来，只是想坐坐也可以。'
      ]);
    }

    // ---- 问候 ----
    if (/你好|嗨|hello|hi|嘿|在吗/.test(t)) {
      return this._pick([
        '嗨。今晚过得怎么样？不用着急回答，慢慢想。',
        '你好呀。欢迎光临。随便坐，随便聊。',
        '嗯，我在。一直都在。'
      ]);
    }

    // ---- 关于食物/饮品 ----
    if (/好喝|好吃|热饮|饮品|食物|味道|烫/.test(t)) {
      return this._pick([
        '慢慢喝，小心烫。让温度从手心慢慢传到心里。',
        '不用急着吃完。在这里，吃东西不是为了完成任务。',
        '合你口味就好。有时候一杯对味的饮品，比什么都管用。'
      ]);
    }

    // ---- 自我怀疑 / 不够好 ----
    if (/不够好|不行|失败|做不好|没用|差劲/.test(t)) {
      return this._pick([
        '你已经很努力了。就算今天什么都没做成，能走到这里就已经很了不起。',
        '不是每一天都一定要很棒。有些日子，只是"过完了"就已经值得被肯定了。',
        '能承认自己不太好，其实是很有力量的一件事。不用急着变好。'
      ]);
    }

    // ---- 工作/学习压力 ----
    if (/工作|上班|加班|学习|考试|作业|老板|同事/.test(t)) {
      return this._pick([
        '下了班就把工作留在门外吧。这里只有暖光和热饮。',
        '不管那些事今天有没有解决，你现在都可以先放一下。',
        '学习和工作很辛苦吧。给自己倒杯水，慢慢喝一口。'
      ]);
    }

    // ---- 关系/人际 ----
    if (/朋友|家人|父母|恋爱|分手|吵架|关系/.test(t)) {
      return this._pick([
        '人和人之间有时候是会有些难。不用急着解决，先让自己的心稳下来。',
        '关系里的情绪，往往是最不好说的。谢谢你愿意跟我聊聊。',
        '有时候啊，能把自己的感受说出来，就已经是一种照顾自己的方式了。'
      ]);
    }

    // ---- 沉默 / 不知道说什么 ----
    if (/不知道说什么|不想说|没什么|随便|……|\.{3,}/.test(t)) {
      return this._pick([
        '没关系。不想说话的时候，我们就安静坐一会儿。',
        '不用勉强自己开口。我在旁边，这样陪着你就很好。',
        '沉默也很好。有时候最好的陪伴，就是什么都不说。'
      ]);
    }

    // ---- 默认温暖回复 ----
    return this._pick([
      '嗯，我听到了。有时候说出来本身，就是一种小小的治愈。',
      '谢谢你愿意跟我分享这些。不管是什么，我都认真在听。',
      '每个人都有属于自己的节奏。不用着急，慢慢来。',
      '今天的你，已经走了很远的路了。真的。',
      '不管发生什么，这家小店会一直亮着灯。',
      '你做得很好。虽然你自己可能不觉得，但在我看来已经很棒了。',
      '有时候停下脚步，喝一杯热饮，就已经是在照顾自己了。',
      '不用想太多。有些时候，不想也没有关系。',
      '你不需要变得更好才值得被温柔对待。现在的你就值得。',
      '如果今天有什么不顺利的，那也不是你的错。',
      '在这里，你可以只是你。不用扮演任何人。'
    ]);
  },

  _pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};

window.LLM = LLM;
