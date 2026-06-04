/* ============================================
   情绪便利店 — state.js
   全局游戏状态管理
   ============================================ */

const GameState = {
  // ---- 用户选择的饮品 ----
  selectedDrink: '',
  selectedDrinkDesc: '',

  // ---- 用户选择的食物 ----
  selectedFood: '',
  selectedFoodDesc: '',

  // ---- 饮品是否已加热 ----
  drinkHeated: false,

  // ---- 食物选择心情标记 ----
  foodChoiceMood: '',

  // ---- 聊天记录 ----
  chatHistory: [],

  // ---- 当前场景 ----
  currentScene: '',

  // ---- 当前店员表情 key ----
  currentExpression: 'welcome',

  // ---- 当前是否在休息室（决定用三帧眨眼还是两帧） ----
  isRestMode: false,

  // ---- 动画状态 ----
  isBlinking: false,
  isTransitioning: false,
  isTyping: false,

  // ---- 方法 ----

  /** 重置所有状态 */
  reset() {
    this.selectedDrink = '';
    this.selectedDrinkDesc = '';
    this.selectedFood = '';
    this.selectedFoodDesc = '';
    this.drinkHeated = false;
    this.foodChoiceMood = '';
    this.currentScene = '';
    this.chatHistory = [];
    this.currentExpression = 'welcome';
    this.isRestMode = false;
    this.isBlinking = false;
    this.isTransitioning = false;
    this.isTyping = false;
  },

  /** 添加聊天记录 */
  addChat(role, text) {
    this.chatHistory.push({
      role: role,
      text: text,
      timestamp: new Date().toISOString()
    });
  },

  /** 设置当前场景 */
  setScene(sceneId) {
    this.currentScene = sceneId;
  },

  /** 切换店员表情 */
  setExpression(expr) {
    this.currentExpression = expr;
  },

  /** 设置休息模式（切换眨眼策略） */
  setRestMode(on) {
    this.isRestMode = !!on;
  },

  /** 获取今日日期字符串 */
  getDateStr() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  },

  /** 获取当前时间字符串 */
  getTimeStr() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }
};

window.GameState = GameState;
