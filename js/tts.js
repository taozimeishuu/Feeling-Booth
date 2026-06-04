/* ============================================
   情绪便利店 — tts.js
   店员语音合成（Web Speech API）
   音色定位：暖奶茶音色
   温柔中低音 / 轻微气声 / 慢速自然 / 微笑感
   ============================================ */

const TTS = {
  _enabled: true,
  _synth: null,
  _voice: null,
  _speaking: false,

  /** 音色参数 — 暖奶茶音色 */
  _params: {
    rate: 0.82,      // 语速：慢半拍，给用户呼吸空间
    pitch: 0.82,     // 音高：中低音，温暖沉稳，不尖不嗲
    volume: 0.68     // 音量：中低，像在安静夜晚轻声说话
  },

  /** 初始化 */
  init() {
    if (!('speechSynthesis' in window)) {
      console.warn('🔇 TTS: 浏览器不支持语音合成');
      this._enabled = false;
      return;
    }

    this._synth = window.speechSynthesis;
    this._selectVoice();

    if (!this._voice) {
      console.warn('🔇 TTS: 未找到合适的中文女声，使用系统默认');
    }

    console.log(
      '🎙️ TTS 已就绪 |',
      '声音:', this._voice ? this._voice.name : '系统默认',
      '| 语速:', this._params.rate,
      '| 音高:', this._params.pitch,
      '| 音量:', this._params.volume
    );
  },

  /** 选择最合适的中文女声 — 优先暖柔声线 */
  _selectVoice() {
    if (!this._synth) return;

    const voices = this._synth.getVoices();

    // 优先级：温暖度 > 语言匹配
    // Sinji（zh-HK）声线通常比 Tingting 更柔，优先尝试
    const prefs = [
      'Sinji',             // macOS zh-HK 女声 — 声线偏柔，接近暖奶茶
      'Tingting',          // macOS zh-CN 女声 — 清晰温和
      'Ting-Ting',         // 另一种写法
      'Meijia',            // macOS zh-TW 女声 — 台湾腔轻柔
      'Mei-jia',
      'zh-HK',
      'zh-TW-female',
      'zh-CN-female',
      'cmn-CN-female'
    ];

    for (const pref of prefs) {
      const v = voices.find(v =>
        v.name.includes(pref) ||
        (v.lang.startsWith('zh') && v.name.toLowerCase().includes(pref.toLowerCase()))
      );
      if (v) { this._voice = v; return; }
    }

    // 兜底：任意中文女声
    const zhFemale = voices.find(v =>
      v.lang.startsWith('zh') &&
      (v.name.includes('female') || v.name.includes('woman') || v.name.includes('girl'))
    );
    if (zhFemale) { this._voice = zhFemale; return; }

    // 任意中文
    const anyZh = voices.find(v => v.lang.startsWith('zh'));
    if (anyZh) { this._voice = anyZh; return; }

    // 系统默认
    this._voice = voices[0] || null;
  },

  /** 朗读文本（仅店员台词，不读旁白） */
  speak(text, isNarrator = false) {
    if (!this._enabled || !this._synth || isNarrator) return;

    this.stop();

    // 清理文本：换行替换为逗号，句号后加停顿
    const clean = text
      .replace(/\n/g, '，')
      .replace(/。/g, '。 ')
      .replace(/、/g, '，');

    const utter = new SpeechSynthesisUtterance(clean);
    utter.voice = this._voice;
    utter.rate = this._params.rate;
    utter.pitch = this._params.pitch;
    utter.volume = this._params.volume;
    utter.lang = this._voice ? this._voice.lang : 'zh-CN';

    this._speaking = true;

    utter.onend = () => {
      this._speaking = false;
    };

    utter.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.warn('TTS error:', e.error);
      }
      this._speaking = false;
    };

    this._synth.speak(utter);
  },

  /** 停止朗读 */
  stop() {
    if (this._synth && this._speaking) {
      this._synth.cancel();
      this._speaking = false;
    }
  },

  /** 切换开关 */
  toggle() {
    this._enabled = !this._enabled;
    if (!this._enabled) this.stop();
    return this._enabled;
  },

  get enabled() {
    return this._enabled;
  }
};

window.TTS = TTS;
