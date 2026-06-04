/* ============================================
   情绪便利店 — config.js
   全局常量、图片映射、饮品选项、动画参数
   ============================================ */

const CONFIG = {
  // ---- 动画时间参数 ----
  FLOAT_DURATION_MS: 4200,
  FLOAT_AMPLITUDE_MIN_PX: 4,
  FLOAT_AMPLITUDE_MAX_PX: 8,
  BLINK_MIN_INTERVAL_MS: 3000,
  BLINK_MAX_INTERVAL_MS: 6000,
  BLINK_CLOSED_DURATION_MS: 150,       // 普通闭眼时长
  REST_BLINK_HALF_DURATION_MS: 120,    // 休息室半睁眼时长
  REST_BLINK_CLOSED_DURATION_MS: 180,  // 休息室闭眼时长
  DOUBLE_BLINK_CHANCE: 0.2,
  DOUBLE_BLINK_GAP_MS: 200,

  // ---- 场景过渡时间 ----
  BG_FADE_DURATION_MS: 400,    // 背景淡入
  SPRITE_FADE_DURATION_MS: 300, // 立绘淡入/滑入
  DIALOG_FADE_DURATION_MS: 200, // 对话框淡入
  BTN_FADE_DURATION_MS: 200,    // 按钮淡入
  OVERLAY_DURATION_MS: 500,     // 黑场过渡

  // ---- 打字机速度 ----
  TYPEWRITER_SPEED_MS: 50,

  // ---- 立绘显示参数 ----
  SPRITE_HEIGHT_VH: 88,
  SPRITE_RIGHT_PCT: 2,
  SPRITE_BOTTOM: 0,

  // ==========================================
  // 背景图路径映射
  // ==========================================
  backgroundPaths: {
    bg_outside:      'assets/backgrounds/bg_outside.png',
    bg_inside:       'assets/backgrounds/bg_inside.png',
    bg_cashier:      'assets/backgrounds/bg_cashier.png',
    bg_shelf:        'assets/backgrounds/bg_shelf.png',
    bg_drink_shelf:  'assets/backgrounds/bg_drink_shelf.png',
    bg_food_shelf:   'assets/backgrounds/bg_food_shelf.png',
    bg_heating:      'assets/backgrounds/bg_heating.png',
    bg_rest:         'assets/backgrounds/bg_rest.png',
    bg_exit:         'assets/backgrounds/bg_exit.png'
  },

  // ==========================================
  // 普通店员立绘路径映射（睁眼/闭眼）
  // ==========================================
  characterSprites: {
    welcome: {
      open:   'assets/sprites/clerk_welcome_open.png',
      closed: 'assets/sprites/clerk_welcome_closed.png'
    },
    listen: {
      open:   'assets/sprites/clerk_listen_open.png',
      closed: 'assets/sprites/clerk_listen_closed.png'
    },
    wave: {
      open:   'assets/sprites/clerk_wave_open.png',
      closed: 'assets/sprites/clerk_wave_closed.png'
    },
    drink: {
      open:   'assets/sprites/clerk_drink_open.png',
      closed: 'assets/sprites/clerk_drink_closed.png'
    },
    display_drink: {
      open:   'assets/sprites/clerk_display_drink_open.png',
      closed: 'assets/sprites/clerk_display_drink_closed.png'
    },
    food_1: {
      open:   'assets/sprites/clerk_food_1_open.png',
      closed: 'assets/sprites/clerk_food_1_closed.png'
    },
    food_2: {
      open:   'assets/sprites/clerk_food_2_open.png',
      closed: 'assets/sprites/clerk_food_2_closed.png'
    },
    display_food: {
      open:   'assets/sprites/clerk_display_food_open.png',
      closed: 'assets/sprites/clerk_display_food_closed.png'
    }
  },

  // ==========================================
  // 休息室店员立绘（三帧：睁眼/半睁眼/闭眼）
  // ==========================================
  restSprites: {
    open:  'assets/sprites/rest_listen_open.png',
    half:  'assets/sprites/rest_listen_half.png',
    closed: 'assets/sprites/rest_listen_closed.png'
  },

  // ==========================================
  // 物品图路径
  // ==========================================
  itemPaths: {
    drink: 'assets/items/item_drink.png'
  },

  // ==========================================
  // 饮品选项（Scene 05 使用）
  // ==========================================
  drinkOptions: [
    {
      id: 'A',
      label: 'A. 慢慢回温热饮',
      name: '慢慢回温热饮',
      desc: '适合疲惫和低电量的时刻，让心慢慢恢复一点温度。',
      hint: '适合觉得疲惫、低电量、想先缓一缓的时候。'
    },
    {
      id: 'B',
      label: 'B. 安心云朵牛奶',
      name: '安心云朵牛奶',
      desc: '适合不安和紧绷的时刻，像一小片云一样托住心情。',
      hint: '适合心里有点慌、想被轻轻安抚的时候。'
    },
    {
      id: 'C',
      label: 'C. 晚风蜂蜜茶',
      name: '晚风蜂蜜茶',
      desc: '适合委屈和说不出口的难过，让心里的声音慢慢被听见。',
      hint: '适合有点委屈、说不太清楚难过的时候。'
    }
  ],

  // ---- LLM API 端点（可选） ----
  LLM_API_ENDPOINT: null
};

window.CONFIG = CONFIG;
