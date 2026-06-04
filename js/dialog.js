/* ============================================
   情绪便利店 — dialog.js
   对话框渲染、打字机效果、选项按钮
   支持：旁白/店员区分、饮品选项卡、普通按钮
   ============================================ */

const Dialog = {
  _textEl: null,
  _choicesEl: null,
  _hintEl: null,
  _boxEl: null,
  _typingTimer: null,
  _typingResolve: null,
  _currentFullText: '',
  _clickResolve: null,

  /** 初始化 */
  init() {
    this._textEl = document.getElementById('dialog-text');
    this._choicesEl = document.getElementById('dialog-choices');
    this._hintEl = document.getElementById('dialog-continue-hint');
    this._boxEl = document.getElementById('dialog-box');

    // 点击对话框跳过打字机
    if (this._boxEl) {
      this._boxEl.addEventListener('click', (e) => {
        if (e.target.closest('.choice-btn')) return;
        if (e.target.closest('.drink-tab')) return;
        if (e.target.closest('#chat-input-row')) return;

        if (GameState.isTyping) {
          this.skipTypewriter();
        }
      });
    }
  },

  /** 显示打字机文本 */
  showText(text, speed = CONFIG.TYPEWRITER_SPEED_MS) {
    return new Promise((resolve) => {
      if (!this._textEl) { resolve(); return; }

      this.clearChoices();
      this.hideHint();
      this._currentFullText = text;
      this._textEl.textContent = '';
      GameState.isTyping = true;

      let index = 0;
      const type = () => {
        if (index < text.length) {
          this._textEl.textContent += text.charAt(index);
          index++;
          // 遇到换行符稍微停顿
          const charDelay = text.charAt(index - 1) === '\n' ? speed * 3 : speed;
          this._typingTimer = setTimeout(type, charDelay);
        } else {
          GameState.isTyping = false;
          this._typingResolve = null;
          this.showHint();
          resolve();
        }
      };

      this._typingResolve = resolve;
      type();
    });
  },

  /** 跳过打字机 */
  skipTypewriter() {
    if (this._typingTimer) {
      clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
    if (this._textEl && this._currentFullText) {
      this._textEl.textContent = this._currentFullText;
    }
    GameState.isTyping = false;
    this.showHint();

    if (this._typingResolve) {
      const r = this._typingResolve;
      this._typingResolve = null;
      r();
    }
  },

  /** 按顺序播放对话框 */
  async showSequence(dialogArray) {
    if (!dialogArray || dialogArray.length === 0) return;

    for (let i = 0; i < dialogArray.length; i++) {
      const line = dialogArray[i];
      const isNarrator = line.speaker === 'narrator';

      // 旁白用斜体样式
      if (isNarrator && this._textEl) {
        this._textEl.style.fontStyle = 'italic';
        this._textEl.style.opacity = '0.85';
      } else if (this._textEl) {
        this._textEl.style.fontStyle = 'normal';
        this._textEl.style.opacity = '1';
      }

      await this.showText(line.text);
      GameState.addChat(line.speaker, line.text);

      // 等待用户点击继续（最后一条如果有选项则不等）
      if (i < dialogArray.length - 1 || !this._hasPendingChoices()) {
        await this._waitForClick();
      }
    }
  },

  /** 等待用户点击对话框 */
  _waitForClick() {
    return new Promise((resolve) => {
      this._clickResolve = resolve;
      const handler = (e) => {
        if (e.target.closest('.choice-btn')) return;
        if (e.target.closest('.drink-tab')) return;
        this._boxEl.removeEventListener('click', handler);
        this._clickResolve = null;
        resolve();
      };
      this._boxEl.addEventListener('click', handler);
    });
  },

  _hasPendingChoices() {
    return false; // 由 SceneManager 控制
  },

  // ==========================================
  // 饮品选项卡（Scene 05 专用）
  // ==========================================
  showDrinkChoices(drinkChoices, onSelect) {
    if (!this._choicesEl) return;

    this._choicesEl.innerHTML = '';
    this.hideHint();

    drinkChoices.forEach((drink) => {
      const tab = document.createElement('button');
      tab.className = 'choice-btn drink-tab';
      tab.innerHTML = `<span class="drink-tab-label">${drink.text}</span><span class="drink-tab-hint">${drink.hint}</span>`;
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        GameState.addChat('player', drink.text);
        if (onSelect) onSelect(drink);
      });
      this._choicesEl.appendChild(tab);
    });

    this._choicesEl.classList.add('visible');
    this._choicesEl.classList.add('drink-choices');
  },

  // ==========================================
  // 普通选项按钮
  // ==========================================
  showChoices(choices, onSelect) {
    if (!this._choicesEl) return;
    if (!choices || choices.length === 0) return;

    this._choicesEl.innerHTML = '';
    this._choicesEl.classList.remove('drink-choices');
    this.hideHint();

    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        GameState.addChat('player', choice.text);
        if (onSelect) onSelect(choice, index);
      });
      this._choicesEl.appendChild(btn);
    });

    this._choicesEl.classList.add('visible');
  },

  /** 清除选项 */
  clearChoices() {
    if (!this._choicesEl) return;
    this._choicesEl.classList.remove('visible');
    this._choicesEl.classList.remove('drink-choices');
    this._choicesEl.innerHTML = '';
  },

  /** 显示继续提示 */
  showHint() {
    if (this._hintEl) {
      this._hintEl.classList.add('visible');
    }
  },

  /** 隐藏继续提示 */
  hideHint() {
    if (this._hintEl) {
      this._hintEl.classList.remove('visible');
    }
  },

  /** 对话框淡入动画 */
  playEnterAnimation() {
    if (!this._boxEl) return;
    this._boxEl.style.opacity = '0';
    this._boxEl.style.transform = 'translateX(-50%) translateY(16px)';
    this._boxEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._boxEl.style.opacity = '1';
        this._boxEl.style.transform = 'translateX(-50%) translateY(0)';
      });
    });
  },

  /** 清除对话框 */
  clear() {
    if (this._textEl) {
      this._textEl.textContent = '';
      this._textEl.style.fontStyle = 'normal';
      this._textEl.style.opacity = '1';
      this._currentFullText = '';
    }
    this.clearChoices();
    this.hideHint();

    if (this._typingTimer) {
      clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
    GameState.isTyping = false;
    if (this._typingResolve) {
      this._typingResolve();
      this._typingResolve = null;
    }
    if (this._clickResolve) {
      this._clickResolve();
      this._clickResolve = null;
    }
  },

  /** 隐藏对话框 */
  hide() {
    if (this._boxEl) {
      this._boxEl.style.display = 'none';
    }
  },

  /** 显示对话框 */
  show() {
    if (this._boxEl) {
      this._boxEl.style.display = '';
    }
  }
};

window.Dialog = Dialog;
