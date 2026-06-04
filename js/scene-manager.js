/* ============================================
   情绪便利店 — scene-manager.js
   场景加载、过渡动画、聊天模式、小票、加热等
   过渡顺序：背景淡入 0.4s → 立绘滑入 0.3s → 对话框淡入 0.2s → 按钮 0.2s
   ============================================ */

const SceneManager = {
  _bgEl: null,
  _spriteEl: null,
  _overlayEl: null,
  _itemEl: null,
  _chatAreaEl: null,
  _chatMessagesEl: null,
  _chatInputEl: null,
  _chatSendBtn: null,
  _chatBackBtn: null,
  _dialogBoxEl: null,
  _heatingTextEl: null,
  _receiptEl: null,
  _isChatMode: false,

  /** 初始化 */
  init() {
    this._bgEl = document.getElementById('bg-layer');
    this._spriteEl = document.getElementById('sprite-layer');
    this._overlayEl = document.getElementById('overlay');
    this._itemEl = document.getElementById('item-display');
    this._chatAreaEl = document.getElementById('chat-area');
    this._chatMessagesEl = document.getElementById('chat-messages');
    this._chatInputEl = document.getElementById('chat-input');
    this._chatSendBtn = document.getElementById('chat-send-btn');
    this._chatBackBtn = document.getElementById('chat-back-btn');
    this._dialogBoxEl = document.getElementById('dialog-box');
    this._heatingTextEl = document.getElementById('heating-text');
    this._receiptEl = document.getElementById('receipt-modal');

    // 聊天事件
    if (this._chatSendBtn) {
      this._chatSendBtn.addEventListener('click', () => this._handleChatSend());
    }
    if (this._chatBackBtn) {
      this._chatBackBtn.addEventListener('click', () => {
        this.exitChatMode();
        this.loadScene('scene_19');
      });
    }
    if (this._chatInputEl) {
      this._chatInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this._handleChatSend();
        }
      });
    }
  },

  /** 查找场景 */
  _findScene(sceneId) {
    const scene = SCENES.find(s => s.id === sceneId);
    if (!scene) {
      console.warn(`SceneManager: 场景 "${sceneId}" 未找到`);
      return SCENES[0];
    }
    return scene;
  },

  /** 主入口：加载场景 */
  async loadScene(sceneId) {
    if (GameState.isTransitioning) return;

    const scene = this._findScene(sceneId);
    if (!scene) return;

    // 退出聊天模式
    if (this._isChatMode && !scene.isChatMode) {
      this.exitChatMode();
    }

    // 隐藏小票
    if (this._receiptEl) {
      this._receiptEl.classList.remove('visible');
    }

    await this._transition(scene);
  },

  /** 完整场景过渡 */
  async _transition(scene) {
    GameState.isTransitioning = true;

    // ---- 0. 遮罩淡入 ----
    await this._fadeOverlay(true, CONFIG.OVERLAY_DURATION_MS);

    // ---- 1. 更新资源 ----
    this._updateBackground(scene.background);

    // 处理立绘
    if (scene.hideSprite) {
      this._hideSprite();
      AnimationController.stopBlinking();
    } else {
      this._showSprite();
      // 设置休息模式
      const isRest = scene.spriteType === 'rest';
      AnimationController.setRestMode(isRest);
      // 更新立绘表情
      AnimationController.updateSprite(scene.expression);
      if (scene.expression) {
        AnimationController.startBlinking();
      }
    }

    // 物品展示
    this._updateItem(scene.showItem || null);

    // 加热文字
    if (this._heatingTextEl) {
      this._heatingTextEl.style.display = scene.showHeatingText ? 'block' : 'none';
    }

    // 更新状态
    Dialog.clear();
    GameState.setScene(scene.id);

    // ---- 2. 执行 onEnter ----
    if (typeof scene.onEnter === 'function') {
      scene.onEnter();
    }

    // ---- 3. 遮罩淡出（背景显现）----
    await this._fadeOverlay(false, CONFIG.BG_FADE_DURATION_MS);

    // ---- 4. 立绘滑入（如有）----
    if (!scene.hideSprite && scene.expression) {
      this._playSpriteEnter();
      await this._sleep(CONFIG.SPRITE_FADE_DURATION_MS);
    }

    // ---- 5. 对话框淡入 ----
    Dialog.show();
    Dialog.playEnterAnimation();
    await this._sleep(CONFIG.DIALOG_FADE_DURATION_MS);

    GameState.isTransitioning = false;

    // ---- 6. 特殊模式 ----
    if (scene.isChatMode) {
      // 聊天模式
      await this._playSceneDialog(scene);
      this.enterChatMode();
      return;
    }

    if (scene.isDrinkSelect) {
      // 饮品选择模式
      await this._playSceneDialog(scene);
      this._showDrinkSelection(scene);
      return;
    }

    if (scene.autoAdvanceMs && scene.autoAdvanceTo) {
      // 自动推进（加热场景）
      await this._playSceneDialog(scene);
      await this._sleep(scene.autoAdvanceMs);
      this.loadScene(scene.autoAdvanceTo);
      return;
    }

    if (scene.showReceipt) {
      // 显示小票
      await this._playSceneDialog(scene);
      this._showReceipt();
      this.showChoices(scene);
      return;
    }

    // ---- 7. 正常场景：播放对话 → 显示选项 ----
    await this._playSceneDialog(scene);
    this.showChoices(scene);
  },

  /** 播放场景对话 */
  async _playSceneDialog(scene) {
    const dialogArray = this._resolveDialog(scene);
    if (dialogArray && dialogArray.length > 0) {
      await Dialog.showSequence(dialogArray);
    }
  },

  /** 解析 dialog */
  _resolveDialog(scene) {
    if (typeof scene.getDialog === 'function') {
      return scene.getDialog();
    }
    return scene.dialog || [];
  },

  // ==========================================
  // 遮罩过渡
  // ==========================================
  _fadeOverlay(show, durationMs) {
    return new Promise((resolve) => {
      if (!this._overlayEl) { resolve(); return; }

      this._overlayEl.style.transition = `opacity ${durationMs}ms ease`;

      let settled = false;
      const handler = () => {
        if (settled) return;
        settled = true;
        this._overlayEl.removeEventListener('transitionend', handler);
        resolve();
      };

      this._overlayEl.addEventListener('transitionend', handler);

      if (show) {
        this._overlayEl.classList.add('active');
      } else {
        this._overlayEl.classList.remove('active');
      }

      // 兜底
      setTimeout(() => {
        if (!settled) {
          settled = true;
          this._overlayEl.removeEventListener('transitionend', handler);
          resolve();
        }
      }, durationMs + 150);
    });
  },

  // ==========================================
  // 背景更新
  // ==========================================
  _updateBackground(bgKey) {
    if (!this._bgEl) return;
    const path = CONFIG.backgroundPaths[bgKey];
    if (path) {
      this._bgEl.style.opacity = '0';
      this._bgEl.src = path;
      // 背景淡入
      this._bgEl.style.transition = `opacity ${CONFIG.BG_FADE_DURATION_MS}ms ease`;
      requestAnimationFrame(() => {
        this._bgEl.style.opacity = '1';
      });
    }
  },

  // ==========================================
  // 立绘控制
  // ==========================================
  _hideSprite() {
    if (!this._spriteEl) return;
    this._spriteEl.style.opacity = '0';
    this._spriteEl.style.transition = 'opacity 0.25s ease';
  },

  _showSprite() {
    if (!this._spriteEl) return;
    this._spriteEl.style.display = '';
  },

  _playSpriteEnter() {
    if (!this._spriteEl) return;
    AnimationController.playEnterAnimation();
  },

  // ==========================================
  // 物品展示
  // ==========================================
  _updateItem(itemType) {
    if (!this._itemEl) return;

    if (itemType && CONFIG.itemPaths[itemType]) {
      this._itemEl.src = CONFIG.itemPaths[itemType];
      this._itemEl.classList.add('visible');
    } else {
      this._itemEl.classList.remove('visible');
    }
  },

  // ==========================================
  // 饮品选择
  // ==========================================
  _showDrinkSelection(scene) {
    if (!scene.drinkChoices) return;

    Dialog.showDrinkChoices(scene.drinkChoices, (drink) => {
      if (typeof drink.action === 'function') {
        drink.action();
      }
      if (scene.nextAfterSelect) {
        this.loadScene(scene.nextAfterSelect);
      }
    });
  },

  // ==========================================
  // 普通选项
  // ==========================================
  showChoices(scene) {
    if (!scene.choices || scene.choices.length === 0) return;

    Dialog.showChoices(scene.choices, (choice) => {
      if (typeof choice.action === 'function') {
        choice.action();
      }
      if (typeof scene.onExit === 'function') {
        scene.onExit();
      }
      if (choice.nextScene) {
        this.loadScene(choice.nextScene);
      }
    });
  },

  // ==========================================
  // 小票显示（Scene 20）
  // ==========================================
  _showReceipt() {
    if (!this._receiptEl) return;

    // 填入动态数据
    const drinkName = document.getElementById('receipt-drink');
    const drinkDesc = document.getElementById('receipt-drink-desc');
    const foodName = document.getElementById('receipt-food');
    const foodDesc = document.getElementById('receipt-food-desc');
    const dateStr = document.getElementById('receipt-date');

    if (drinkName) drinkName.textContent = GameState.selectedDrink || '——';
    if (drinkDesc) drinkDesc.textContent = GameState.selectedDrinkDesc || '';
    if (foodName) foodName.textContent = GameState.selectedFood || '——';
    if (foodDesc) foodDesc.textContent = GameState.selectedFoodDesc || '';
    if (dateStr) dateStr.textContent = `${GameState.getDateStr()}  ${GameState.getTimeStr()}`;

    // 显示
    this._receiptEl.classList.add('visible');
  },

  // ==========================================
  // 聊天模式
  // ==========================================
  enterChatMode() {
    this._isChatMode = true;
    Dialog.hide();

    if (this._chatAreaEl) {
      this._chatAreaEl.classList.add('visible');
    }

    if (this._chatMessagesEl) {
      this._chatMessagesEl.innerHTML = '';
      const initMsg = document.createElement('div');
      initMsg.className = 'chat-msg clerk';
      initMsg.textContent = '我会在这里陪你。你可以说今天发生了什么，也可以什么都不解释。我们慢慢来。';
      this._chatMessagesEl.appendChild(initMsg);
    }

    setTimeout(() => {
      if (this._chatInputEl) this._chatInputEl.focus();
    }, 400);
  },

  exitChatMode() {
    this._isChatMode = false;
    Dialog.show();

    if (this._chatAreaEl) {
      this._chatAreaEl.classList.remove('visible');
    }
  },

  async _handleChatSend() {
    if (!this._chatInputEl || !this._chatMessagesEl) return;

    const text = this._chatInputEl.value.trim();
    if (!text) return;

    this._chatInputEl.value = '';

    // 用户消息
    this._appendChatMessage('user', text);
    GameState.addChat('player', text);

    // 正在输入…
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg clerk typing';
    typingEl.textContent = '……';
    this._chatMessagesEl.appendChild(typingEl);
    this._scrollChatToBottom();

    try {
      const response = await LLM.sendMessage(text, GameState.chatHistory);
      typingEl.remove();
      this._appendChatMessage('clerk', response);
      GameState.addChat('clerk', response);
    } catch (err) {
      typingEl.remove();
      this._appendChatMessage('clerk', '啊，信号不太好……不过没关系，我还在听。');
      GameState.addChat('clerk', '啊，信号不太好……不过没关系，我还在听。');
    }
  },

  _appendChatMessage(role, text) {
    if (!this._chatMessagesEl) return;
    const el = document.createElement('div');
    el.className = `chat-msg ${role}`;
    el.textContent = text;
    this._chatMessagesEl.appendChild(el);
    this._scrollChatToBottom();
  },

  _scrollChatToBottom() {
    if (!this._chatMessagesEl) return;
    this._chatMessagesEl.scrollTop = this._chatMessagesEl.scrollHeight;
  },

  // ==========================================
  // 工具
  // ==========================================
  _sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
};

window.SceneManager = SceneManager;
