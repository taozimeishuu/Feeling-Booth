/* ============================================
   情绪便利店 — animation-controller.js
   角色浮动 + 眨眼控制
   普通场景：两帧眨眼（open → closed → open）
   休息室场景：三帧眨眼（open → half → closed → half → open）
   ============================================ */

const AnimationController = {
  _blinkTimer: null,
  _eyeState: 'open',      // 'open' | 'half' | 'closed'
  _spriteEl: null,
  _floatEnabled: true,
  _isRestMode: false,

  /** 初始化 */
  init() {
    this._spriteEl = document.getElementById('sprite-layer');
    if (!this._spriteEl) {
      console.warn('AnimationController: #sprite-layer 未找到');
      return;
    }
    this.startFloating();
    this.startBlinking();
  },

  /** 获取当前立绘路径 */
  getSpritePath(expression, eyeState) {
    // 休息室模式使用三帧图
    if (this._isRestMode && CONFIG.restSprites) {
      const sprites = CONFIG.restSprites;
      return sprites[eyeState] || sprites.open;
    }

    // 普通模式
    const sprites = CONFIG.characterSprites[expression];
    if (!sprites) {
      // 如果没有该表情，尝试 fallback 到 welcome
      const fallback = CONFIG.characterSprites.welcome;
      if (fallback) return fallback[eyeState] || fallback.open;
      return '';
    }
    return sprites[eyeState] || sprites.open;
  },

  /** 更新立绘（表情 + 眼状态） */
  updateSprite(expression) {
    if (!this._spriteEl) return;
    if (!expression) {
      // 休息模式下仍显示立绘（使用 restSprites）
      if (this._isRestMode) {
        const path = this.getSpritePath('rest', this._eyeState);
        if (path) {
          this._spriteEl.src = path;
          this._spriteEl.style.opacity = '1';
        }
        return;
      }
      // 非休息模式且无 expression → 隐藏立绘
      this._spriteEl.style.opacity = '0';
      return;
    }

    GameState.setExpression(expression);
    const path = this.getSpritePath(expression, this._eyeState);
    if (path) {
      this._spriteEl.src = path;
      this._spriteEl.style.opacity = '1';
    }
  },

  /** 设置休息室模式 */
  setRestMode(on) {
    this._isRestMode = !!on;
    GameState.setRestMode(on);
    // 重置眼状态
    this._eyeState = 'open';
    // 立即刷新立绘
    this._refreshSprite();
  },

  /** 切换睁眼/闭眼状态 */
  _setEyeState(state) {
    if (!this._spriteEl) return;
    this._eyeState = state;
    this._refreshSprite();
  },

  /** 刷新立绘图片 */
  _refreshSprite() {
    if (!this._spriteEl) return;
    const path = this.getSpritePath(GameState.currentExpression, this._eyeState);
    if (path) {
      this._spriteEl.src = path;
    }
  },

  /** 立绘入场动画（从右侧轻微滑入） */
  playEnterAnimation() {
    if (!this._spriteEl) return;
    this._spriteEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    this._spriteEl.style.opacity = '0';
    this._spriteEl.style.transform = 'translateX(12px)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._spriteEl.style.opacity = '1';
        this._spriteEl.style.transform = 'translateX(0)';
        // 恢复 float 动画
        setTimeout(() => {
          if (this._floatEnabled) {
            this._spriteEl.classList.add('sprite-floating');
          }
        }, 350);
      });
    });
  },

  /** 开启浮动 */
  startFloating() {
    if (!this._spriteEl) return;
    this._floatEnabled = true;
    this._spriteEl.classList.add('sprite-floating');
  },

  /** 停止浮动 */
  stopFloating() {
    if (!this._spriteEl) return;
    this._floatEnabled = false;
    this._spriteEl.classList.remove('sprite-floating');
  },

  /** 开启随机眨眼 */
  startBlinking() {
    this.stopBlinking();
    this._scheduleNextBlink();
  },

  /** 停止随机眨眼 */
  stopBlinking() {
    if (this._blinkTimer) {
      clearTimeout(this._blinkTimer);
      this._blinkTimer = null;
    }
    GameState.isBlinking = false;
  },

  /** 安排下一次眨眼 */
  _scheduleNextBlink() {
    const delay = CONFIG.BLINK_MIN_INTERVAL_MS +
      Math.random() * (CONFIG.BLINK_MAX_INTERVAL_MS - CONFIG.BLINK_MIN_INTERVAL_MS);

    this._blinkTimer = setTimeout(() => {
      this._doBlink();
    }, delay);
  },

  /** 执行眨眼 */
  _doBlink() {
    if (GameState.isTransitioning) {
      this._scheduleNextBlink();
      return;
    }

    const doubleBlink = Math.random() < CONFIG.DOUBLE_BLINK_CHANCE;
    GameState.isBlinking = true;

    if (this._isRestMode) {
      // ---- 休息室三帧眨眼：open → half → closed → half → open ----
      this._setEyeState('half');

      setTimeout(() => {
        this._setEyeState('closed');

        setTimeout(() => {
          this._setEyeState('half');

          setTimeout(() => {
            this._setEyeState('open');
            GameState.isBlinking = false;

            if (doubleBlink) {
              setTimeout(() => this._doRestBlinkQuick(), CONFIG.DOUBLE_BLINK_GAP_MS);
            } else {
              this._scheduleNextBlink();
            }
          }, CONFIG.REST_BLINK_HALF_DURATION_MS);
        }, CONFIG.REST_BLINK_CLOSED_DURATION_MS);
      }, CONFIG.REST_BLINK_HALF_DURATION_MS);

    } else {
      // ---- 普通两帧眨眼：open → closed → open ----
      this._setEyeState('closed');

      setTimeout(() => {
        this._setEyeState('open');
        GameState.isBlinking = false;

        if (doubleBlink) {
          setTimeout(() => {
            GameState.isBlinking = true;
            this._setEyeState('closed');

            setTimeout(() => {
              this._setEyeState('open');
              GameState.isBlinking = false;
              this._scheduleNextBlink();
            }, CONFIG.BLINK_CLOSED_DURATION_MS);
          }, CONFIG.DOUBLE_BLINK_GAP_MS);
        } else {
          this._scheduleNextBlink();
        }
      }, CONFIG.BLINK_CLOSED_DURATION_MS);
    }
  },

  /** 休息室快速三帧眨眼（用于双眨的第二下） */
  _doRestBlinkQuick() {
    if (GameState.isTransitioning) {
      this._scheduleNextBlink();
      return;
    }
    GameState.isBlinking = true;
    this._setEyeState('half');

    setTimeout(() => {
      this._setEyeState('closed');

      setTimeout(() => {
        this._setEyeState('half');

        setTimeout(() => {
          this._setEyeState('open');
          GameState.isBlinking = false;
          this._scheduleNextBlink();
        }, CONFIG.REST_BLINK_HALF_DURATION_MS);
      }, CONFIG.REST_BLINK_CLOSED_DURATION_MS);
    }, CONFIG.REST_BLINK_HALF_DURATION_MS);
  },

  /** 销毁 */
  destroy() {
    this.stopBlinking();
    this.stopFloating();
    this._spriteEl = null;
  }
};

window.AnimationController = AnimationController;
