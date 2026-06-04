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

  /** 音色参数 */
  _params: {
    rate: 0.88,      // 语速：比日常略慢
    pitch: 0.95,     // 音高：中低音，偏暖
    volume: 0.75     // 音量：中低
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

    // 如果没找到合适声音，禁用
    if (!this._voice) {
      console.warn('🔇 TTS: 未找到合适的中文女声');
      // 保持 enabled，用默认声音试试
    }

    console.log(
      '🎙️ TTS 已就绪 |',
      '声音:', this._voice ? this._voice.name : '系统默认',
      '| 语速:', this._params.rate,
      '| 音高:', this._params.pitch
    );
  },

  /** 选择最合适的中文女声 */
  _selectVoice() {
    if (!this._synth) return;

    const voices = this._synth.getVoices();

    // macOS/iOS 中文女声优先级（暖奶茶方向挑选）
    const prefs = [
      'Tingting',          // macOS zh-CN 女声 — 比较接近
      'Ting-Ting',         // 另一种写法
      'Sinji',             // macOS zh-HK 女声
      'Meijia',            // macOS zh-TW 女声
      'zh-CN-female',
      'cmn-CN-female'
    ];

    // 第一轮：匹配偏好列表
    for (const pref of prefs) {
      const v = voices.find(v =>
        v.name.includes(pref) ||
        (v.lang.startsWith('zh') && v.name.toLowerCase().includes(pref.toLowerCase()))
      );
      if (v) { this._voice = v; return; }
    }

    // 第二轮：任意 zh-CN 女声
    const zhFemale = voices.find(v =>
      v.lang.startsWith('zh-CN') && v.name.toLowerCase().includes('female')
    );
    if (zhFemale) { this._voice = zhFemale; return; }

    // 第三轮：任意中文女声
    const anyZhFemale = voices.find(v =>
      v.lang.startsWith('zh') &&
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('woman') ||
       v.name.toLowerCase().includes('girl'))
    );
    if (anyZhFemale) { this._voice = anyZhFemale; return; }

    // 第四轮：任意中文声音
    const anyZh = voices.find(v => v.lang.startsWith('zh'));
    if (anyZh) { this._voice = anyZh; return; }

    // 兜底：系统默认
    this._voice = voices[0] || null;
  },

  /** 朗读文本（仅店员台词，不读旁白） */
  speak(text, isNarrator = false) {
    if (!this._enabled || !this._synth || isNarrator) return;

    this.stop();

    // 清理文本：去掉换行符用于朗读，但保留停顿
    const clean = text.replace(/\n/g, '，');

    const utter = new SpeechSynthesisUtterance(clean);
    utter.voice = this._voice;
    utter.rate = this._params.rate;
    utter.pitch = this._params.pitch;
    utter.volume = this._params.volume;
    utter.lang = 'zh-CN';

    this._speaking = true;

    utter.onend = () => {
      this._speaking = false;
    };

    utter.onerror = (e) => {
      // 'interrupted' 是正常的（用户点了继续）
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

  /** 是否启用 */
  get enabled() {
    return this._enabled;
  }
};

window.TTS = TTS;
