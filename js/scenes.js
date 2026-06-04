/* ============================================
   情绪便利店 — scenes.js
   完整 21 个场景定义
   场景顺序严格按照设计文档
   ============================================ */

const SCENES = [

  // ==========================================
  // Scene 01：便利店外 — 旁白开场
  // ==========================================
  {
    id: 'scene_01',
    background: 'bg_outside',
    expression: null,
    hideSprite: true,
    dialog: [
      { speaker: 'narrator', text: '夜色慢慢安静下来。' },
      { speaker: 'narrator', text: '街角还有一家小店亮着灯，\n像是在等某个暂时不知道该去哪里的人。' },
      { speaker: 'narrator', text: '招牌上写着：情绪便利店。' },
      { speaker: 'narrator', text: '这里不急着让谁变好，\n只是给路过的人留一盏灯，\n也留一点可以慢慢呼吸的时间。' }
    ],
    choices: [
      { text: '推门进去', nextScene: 'scene_02' }
    ]
  },

  // ==========================================
  // Scene 02：进入便利店内部 — 旁白
  // ==========================================
  {
    id: 'scene_02',
    background: 'bg_inside',
    expression: null,
    hideSprite: true,
    dialog: [
      { speaker: 'narrator', text: '门铃轻轻响了一声。' },
      { speaker: 'narrator', text: '店里很安静，\n暖黄色的灯光落在货架和地面上。' },
      { speaker: 'narrator', text: '空气里像是有热饮、面包，\n还有一点点让人放松下来的味道。' },
      { speaker: 'narrator', text: '你站在门口，\n好像终于可以不用那么用力地撑着自己了。' }
    ],
    choices: [
      { text: '走向收银台', nextScene: 'scene_03' }
    ]
  },

  // ==========================================
  // Scene 03：收银台初见店员
  // ==========================================
  {
    id: 'scene_03',
    background: 'bg_cashier',
    expression: 'welcome',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '欢迎光临，来到情绪便利店。' },
      { speaker: 'clerk', text: '今天也辛苦你走到这里了。' },
      { speaker: 'clerk', text: '不用急着说明发生了什么，\n也不用马上整理好自己的心情。' },
      { speaker: 'clerk', text: '要不要先跟我一起逛一逛？\n我们可以先选一杯饮品，\n再选一点小小的食物。' },
      { speaker: 'clerk', text: '选看起来顺眼的就好，\n今天在这里，没有标准答案。' }
    ],
    choices: [
      { text: '跟店员逛逛', nextScene: 'scene_04' }
    ]
  },

  // ==========================================
  // Scene 04：前往饮品区
  // ==========================================
  {
    id: 'scene_04',
    background: 'bg_drink_shelf',
    expression: 'wave',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '这边是饮品区。' },
      { speaker: 'clerk', text: '有些饮品不是为了让心情立刻变好，\n只是让你在这一刻，\n有一点可以捧在手里的温度。' },
      { speaker: 'clerk', text: '手心暖一点的时候，\n人也会比较容易想起：\n自己其实不用一直紧绷着。' }
    ],
    choices: [
      { text: '看看饮品', nextScene: 'scene_05' }
    ]
  },

  // ==========================================
  // Scene 05：饮品选择页面
  // 显示：饮品货架 + 店员展示饮品 + 饮品图 + 三个文字选项卡
  // ==========================================
  {
    id: 'scene_05',
    background: 'bg_drink_shelf',
    expression: 'display_drink',
    spriteType: 'normal',
    hideSprite: false,
    showItem: 'drink',
    isDrinkSelect: true,
    dialog: [
      { speaker: 'narrator', text: '请选择一杯今天的饮品' },
      { speaker: 'clerk', text: '这里的饮品都有一点自己的性格。' },
      { speaker: 'clerk', text: '你不用想太久，\n也不用判断哪一个最"正确"。' },
      { speaker: 'clerk', text: '就选那个你第一眼觉得：\n"也许今天可以陪我一下"的吧。' }
    ],
    drinkChoices: [
      {
        id: 'A',
        text: 'A. 慢慢回温热饮',
        hint: '适合觉得疲惫、低电量、想先缓一缓的时候。',
        action() {
          GameState.selectedDrink = '慢慢回温热饮';
          GameState.selectedDrinkDesc = '适合疲惫和低电量的时刻，让心慢慢恢复一点温度。';
        }
      },
      {
        id: 'B',
        text: 'B. 安心云朵牛奶',
        hint: '适合心里有点慌、想被轻轻安抚的时候。',
        action() {
          GameState.selectedDrink = '安心云朵牛奶';
          GameState.selectedDrinkDesc = '适合不安和紧绷的时刻，像一小片云一样托住心情。';
        }
      },
      {
        id: 'C',
        text: 'C. 晚风蜂蜜茶',
        hint: '适合有点委屈、说不太清楚难过的时候。',
        action() {
          GameState.selectedDrink = '晚风蜂蜜茶';
          GameState.selectedDrinkDesc = '适合委屈和说不出口的难过，让心里的声音慢慢被听见。';
        }
      }
    ],
    nextAfterSelect: 'scene_06'
  },

  // ==========================================
  // Scene 06：饮品确认
  // ==========================================
  {
    id: 'scene_06',
    background: 'bg_drink_shelf',
    expression: 'drink',
    spriteType: 'normal',
    hideSprite: false,
    showItem: 'drink',
    getDialog() {
      const name = GameState.selectedDrink || '这杯饮品';
      return [
        { speaker: 'clerk', text: '好，帮你拿这一杯。' },
        { speaker: 'clerk', text: `${name}，听起来很适合今天的你。` },
        { speaker: 'clerk', text: '等一下我会帮你把它加热，\n不用急着喝，\n先让它陪你走完这一小段路也可以。' },
        { speaker: 'clerk', text: '有时候，愿意为自己选一点温热的东西，\n就已经是在照顾自己了。' }
      ];
    },
    choices: [
      { text: '继续逛逛', nextScene: 'scene_07' }
    ]
  },

  // ==========================================
  // Scene 07：第一次经过货架
  // ==========================================
  {
    id: 'scene_07',
    background: 'bg_shelf',
    expression: 'listen',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'narrator', text: '你们慢慢经过一排货架。' },
      { speaker: 'narrator', text: '货架上摆着一些奇怪又温柔的商品：' },
      { speaker: 'narrator', text: '"不用立刻振作糖"\n"今天也算数饼干"\n"把话慢慢说完贴纸"' },
      { speaker: 'narrator', text: '它们安静地待在那里，\n像是在说：每一种情绪，都可以有自己的位置。' },
      { speaker: 'clerk', text: '这里的商品不一定都要买走。' },
      { speaker: 'clerk', text: '有时候只是路过，看见它们，\n心里就会稍微松一点。' },
      { speaker: 'clerk', text: '就像有些话，\n不一定马上说出口，\n但知道有人愿意听，\n也会轻一点。' }
    ],
    choices: [
      { text: '去食物区', nextScene: 'scene_08' }
    ]
  },

  // ==========================================
  // Scene 08：前往食物区
  // ==========================================
  {
    id: 'scene_08',
    background: 'bg_food_shelf',
    expression: 'wave',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '这边是食物区。' },
      { speaker: 'clerk', text: '心情很累的时候，\n身体也常常会跟着变得空空的。' },
      { speaker: 'clerk', text: '选一点小小的食物吧，\n不用很多，\n只要能陪你坐一会儿就好。' },
      { speaker: 'clerk', text: '我们不把它当成任务，\n只是当成一个温柔的小补给。' }
    ],
    choices: [
      { text: '看看食物', nextScene: 'scene_09' }
    ]
  },

  // ==========================================
  // Scene 09：店员拿食物一，询问用户想不想吃
  // ==========================================
  {
    id: 'scene_09',
    background: 'bg_food_shelf',
    expression: 'food_1',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '这个怎么样？' },
      { speaker: 'clerk', text: '看起来软软的，\n像是可以慢慢咬一口的东西。' },
      { speaker: 'clerk', text: '如果今天的你有点累，\n它也许会很适合。' },
      { speaker: 'clerk', text: '你想吃这个吗？\n不想也没关系，\n我还可以再帮你看看别的。' }
    ],
    choices: [
      { text: '想吃', nextScene: 'scene_10b' },
      { text: '不想吃', nextScene: 'scene_10a' }
    ]
  },

  // ==========================================
  // Scene 10A：用户选择"不想吃"
  // ==========================================
  {
    id: 'scene_10a',
    background: 'bg_food_shelf',
    expression: 'food_2',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '嗯，好呀。' },
      { speaker: 'clerk', text: '不想吃就不勉强，\n能知道自己现在不想要什么，\n也是很重要的感觉。' },
      { speaker: 'clerk', text: '那我们换一个。' },
      { speaker: 'clerk', text: '这个呢？\n它看起来更安静一点，\n像是可以陪你慢慢坐在休息区里。' }
    ],
    onEnter() {
      GameState.selectedFood = '安心小食';
      GameState.selectedFoodDesc = '适合现在慢慢吃一点，让身体和心情都稍微踏实下来。';
      GameState.foodChoiceMood = '用户没有选择第一个食物，店员换了另一个更温和的小食。';
    },
    choices: [
      { text: '就这个吧', nextScene: 'scene_11' }
    ]
  },

  // ==========================================
  // Scene 10B：用户选择"想吃"
  // ==========================================
  {
    id: 'scene_10b',
    background: 'bg_food_shelf',
    expression: 'food_2',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '诶，真的想吃这个呀。' },
      { speaker: 'clerk', text: '我还以为你会说想吃这个的呢。' },
      { speaker: 'clerk', text: '不过也好，\n能选出一个"我想要"的东西，\n其实已经很了不起了。' },
      { speaker: 'clerk', text: '那我也把这个一起给你看看。\n它更适合慢慢吃，\n不急着填满肚子，\n只是让心和身体都踏实一点。' }
    ],
    onEnter() {
      GameState.selectedFood = '安心小食';
      GameState.selectedFoodDesc = '适合现在慢慢吃一点，让身体和心情都稍微踏实下来。';
      GameState.foodChoiceMood = '用户选择了第一个食物，店员轻轻开了个玩笑，然后换成了另一个推荐小食。';
    },
    choices: [
      { text: '就这个吧', nextScene: 'scene_11' }
    ]
  },

  // ==========================================
  // Scene 11：食物确认
  // ==========================================
  {
    id: 'scene_11',
    background: 'bg_food_shelf',
    expression: 'display_food',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '嗯，我帮你一起装好。' },
      { speaker: 'clerk', text: '这份小食很适合慢慢吃。' },
      { speaker: 'clerk', text: '不用急着吃完，\n也不用急着让自己马上变好。' },
      { speaker: 'clerk', text: '等一下到了休息区，\n你可以一边喝热饮，\n一边慢慢吃一点。' },
      { speaker: 'clerk', text: '今天只要能让自己舒服一点点，\n就已经很好了。' }
    ],
    choices: [
      { text: '去加热饮品', nextScene: 'scene_12' }
    ]
  },

  // ==========================================
  // Scene 12：第二次经过货架
  // ==========================================
  {
    id: 'scene_12',
    background: 'bg_shelf',
    expression: 'listen',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'narrator', text: '你们又经过一排安静的货架。' },
      { speaker: 'narrator', text: '灯光落在商品包装上，\n也落在你手里的饮品和食物上。' },
      { speaker: 'narrator', text: '这一小段路不长，\n但好像足够让人从外面的夜里，\n慢慢走进一个可以停下来的地方。' },
      { speaker: 'clerk', text: '我们去把饮品加热一下吧。' },
      { speaker: 'clerk', text: '热一点的东西，\n虽然不能解决所有问题，' },
      { speaker: 'clerk', text: '但有时候可以提醒身体：\n你现在是安全的。' },
      { speaker: 'clerk', text: '不用一下子放松下来，\n只要先放松一点点就好。' }
    ],
    choices: [
      { text: '前往加热区', nextScene: 'scene_13' }
    ]
  },

  // ==========================================
  // Scene 13：饮品加热区
  // ==========================================
  {
    id: 'scene_13',
    background: 'bg_heating',
    expression: 'drink',
    spriteType: 'normal',
    hideSprite: false,
    showItem: 'drink',
    getDialog() {
      const name = GameState.selectedDrink || '饮品';
      return [
        { speaker: 'clerk', text: `把${name}放在这里。` },
        { speaker: 'clerk', text: '稍微等一会儿就好。' },
        { speaker: 'clerk', text: '等待的时候，\n我们可以什么都不做。' },
        { speaker: 'clerk', text: '不用回复消息，\n不用整理心情，\n也不用证明自己很好。' },
        { speaker: 'clerk', text: '只是站在这里，\n慢慢呼吸一下。' }
      ];
    },
    choices: [
      { text: '开始加热', nextScene: 'scene_14' }
    ]
  },

  // ==========================================
  // Scene 14：正在加热（自动等待 2 秒后跳转）
  // ==========================================
  {
    id: 'scene_14',
    background: 'bg_heating',
    expression: 'drink',
    spriteType: 'normal',
    hideSprite: false,
    showItem: 'drink',
    showHeatingText: true,
    autoAdvanceMs: 2200,
    autoAdvanceTo: 'scene_15',
    dialog: [
      { speaker: 'narrator', text: '正在加热中……' },
      { speaker: 'narrator', text: '温度正在慢慢回来。' }
    ],
    onEnter() {
      GameState.drinkHeated = true;
    }
  },

  // ==========================================
  // Scene 15：加热完成
  // ==========================================
  {
    id: 'scene_15',
    background: 'bg_heating',
    expression: 'welcome',
    spriteType: 'normal',
    hideSprite: false,
    showItem: 'drink',
    dialog: [
      { speaker: 'clerk', text: '好了。' },
      { speaker: 'clerk', text: '现在它是温热的。' },
      { speaker: 'clerk', text: '拿的时候小心一点，\n也小心一点对待自己。' },
      { speaker: 'clerk', text: '有些心情可能还没有变轻，\n但至少这一刻，\n你手里有一点暖的东西了。' }
    ],
    choices: [
      { text: '去休息区', nextScene: 'scene_16' }
    ]
  },

  // ==========================================
  // Scene 16：前往休息区
  // ==========================================
  {
    id: 'scene_16',
    background: 'bg_inside',
    expression: 'wave',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '后面有一间小小的休息区。' },
      { speaker: 'clerk', text: '灯光会暗一点，\n座位也会软一点，\n不会有人催你快点离开。' },
      { speaker: 'clerk', text: `你可以带着${GameState.selectedDrink || '饮品'}和这份小食，\n在那里坐一会儿。` },
      { speaker: 'clerk', text: '想说话也可以，\n不想说话也可以。' }
    ],
    choices: [
      { text: '进入休息区', nextScene: 'scene_17' }
    ]
  },

  // ==========================================
  // Scene 17：休息区开场 — 切换到三帧眨眼
  // ==========================================
  {
    id: 'scene_17',
    background: 'bg_rest',
    expression: null,
    spriteType: 'rest',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '到了。' },
      { speaker: 'clerk', text: '你可以坐在这里，\n慢慢喝一点，\n慢慢吃一点。' },
      { speaker: 'clerk', text: '如果你愿意，\n也可以和我说说今天发生了什么。' },
      { speaker: 'clerk', text: '说得乱一点也没关系，\n说不清楚也没关系。' },
      { speaker: 'clerk', text: '我不会催你，\n我会慢慢听。' }
    ],
    choices: [
      { text: '和店员说话', nextScene: 'scene_18' }
    ]
  },

  // ==========================================
  // Scene 18：休息区自由聊天主界面
  // ==========================================
  {
    id: 'scene_18',
    background: 'bg_rest',
    expression: null,
    spriteType: 'rest',
    hideSprite: false,
    isChatMode: true,
    dialog: [
      { speaker: 'clerk', text: '我会在这里陪你。' },
      { speaker: 'clerk', text: '你可以说今天发生了什么，\n也可以什么都不解释。' },
      { speaker: 'clerk', text: '我们慢慢来。' },
      { speaker: 'clerk', text: '先喝一口热的也可以，\n先安静坐一会儿也可以。' }
    ]
  },

  // ==========================================
  // Scene 19：离开前
  // ==========================================
  {
    id: 'scene_19',
    background: 'bg_rest',
    expression: null,
    spriteType: 'rest',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '准备离开了吗？' },
      { speaker: 'clerk', text: '那我帮你打印一张今日小票吧。' },
      { speaker: 'clerk', text: '它不是结账单，\n也不是要证明你今天已经完全好了。' },
      { speaker: 'clerk', text: '它只是一个小小的记录：' },
      { speaker: 'clerk', text: '你走进这里，\n选了一杯饮品，\n选了一份小食，\n也给了自己一段可以被温柔对待的时间。' }
    ],
    choices: [
      { text: '生成今日小票', nextScene: 'scene_20' }
    ]
  },

  // ==========================================
  // Scene 20：今日小票 — 动态 HTML/CSS 生成
  // ==========================================
  {
    id: 'scene_20',
    background: 'bg_cashier',
    expression: 'welcome',
    spriteType: 'normal',
    hideSprite: false,
    showReceipt: true,
    dialog: [
      { speaker: 'clerk', text: '这是你的今日小票。' },
      { speaker: 'clerk', text: '请把它收好。' },
      { speaker: 'clerk', text: '不是因为它有多重要，\n而是因为今天的你，\n确实认真地走到了这里。' }
    ],
    choices: [
      { text: '收好小票，离开便利店', nextScene: 'scene_21' }
    ]
  },

  // ==========================================
  // Scene 21：告别页面 — 首尾呼应
  // ==========================================
  {
    id: 'scene_21',
    background: 'bg_outside',
    expression: 'wave',
    spriteType: 'normal',
    hideSprite: false,
    dialog: [
      { speaker: 'clerk', text: '欢迎下次光临。' },
      { speaker: 'clerk', text: '不一定要等到很难过的时候才来。' },
      { speaker: 'clerk', text: '只是有点累，\n只是想坐一会儿，\n只是想被温柔地听一听，\n都可以来。' },
      { speaker: 'clerk', text: '这家小店会一直亮着灯。' },
      { speaker: 'clerk', text: '回去的路上慢一点，\n今天也请对自己好一点。' }
    ],
    choices: [
      { text: '重新开始', nextScene: 'scene_01' }
    ],
    onEnter() {
      // 离开休息室模式
      GameState.setRestMode(false);
    }
  }

];

window.SCENES = SCENES;
