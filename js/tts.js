/* ============================================
   情绪便利店 — tts.js
   店员语音：Qwen3-TTS-Flash 小野杏（Ono Anna）
   后端 /api/tts 代理，API Key 不暴露在前端
   ============================================ */

const TTS = {
  _enabled: true,
  _audio: null,           // 当前播放的 Audio
  _queue: [],             // 待播放文本队列
  _loading: false,        // 是否正在加载

  /** 朗读文本（仅店员台词） */
  speak(text, isNarrator = false) {
    if (!this._enabled || isNarrator || !text) return;
    this.stop();

    // 排队
    this._queue.push(text);
    if (this._queue.length === 1) {
      this._playNext();
    }
  },

  /** 播放队列中下一条 */
  async _playNext() {
    if (this._queue.length === 0 || !this._enabled) return;

    const text = this._queue[0];
    this._loading = true;

    try {
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);

      this._audio = new Audio(url);
      this._audio.onended = () => {
        URL.revokeObjectURL(url);
        this._audio = null;
        // 播放完毕，取下一条
        this._queue.shift();
        this._playNext();
      };

      this._audio.onerror = () => {
        URL.revokeObjectURL(url);
        this._audio = null;
        this._queue.shift();
        this._playNext();
      };

      this._audio.play().catch(() => {
        // 用户可能还没交互，浏览器阻止自动播放
        this._audio = null;
        this._queue.shift();
        this._playNext();
      });

    } catch (err) {
      console.warn('TTS fetch failed:', err.message);
      this._queue.shift();
      this._playNext();
    }

    this._loading = false;
  },

  /** 停止朗读 */
  stop() {
    if (this._audio) {
      this._audio.pause();
      this._audio = null;
    }
    this._queue = [];
    this._loading = false;
  },

  /** 切换开关 */
  toggle() {
    this._enabled = !this._enabled;
    if (!this._enabled) this.stop();
    return this._enabled;
  },

  /** 初始化（兼容旧接口） */
  init() {
    console.log('🎙️ TTS: Qwen3-TTS-Flash 小野杏 (Ono Anna)');
  },

  get enabled() {
    return this._enabled;
  }
};

window.TTS = TTS;
