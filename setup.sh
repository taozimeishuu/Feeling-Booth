#!/bin/bash
# ============================================
# 情绪便利店 — 素材整理脚本
# 将中文文件名图片复制到 assets/ 目录
# 用法: bash setup.sh
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="/Users/taozimeishu/Desktop/情绪便利店图片素材"
ASSETS_DIR="$SCRIPT_DIR/assets"

if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ 素材源目录不存在: $SOURCE_DIR"
  echo "   请确认图片素材文件夹在桌面。"
  exit 1
fi

echo "📁 素材源目录: $SOURCE_DIR"
echo "📁 输出目录:   $ASSETS_DIR"
echo ""

# ---------- 创建输出目录 ----------
mkdir -p "$ASSETS_DIR/backgrounds"
mkdir -p "$ASSETS_DIR/sprites"
mkdir -p "$ASSETS_DIR/items"

# ---------- 复制函数 ----------
copy_file() {
  local src="$1"
  local dst="$2"
  local label="$3"

  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "  ✅ $label"
  else
    echo "  ⚠️  $label  ← 源文件不存在！"
  fi
}

# ==========================================
# 背景图
# ==========================================
echo "🖼️  复制背景图..."
copy_file "$SOURCE_DIR/便利店外景图.png"           "$ASSETS_DIR/backgrounds/bg_outside.png"      "bg_outside"
copy_file "$SOURCE_DIR/便利店内部全景图.png"        "$ASSETS_DIR/backgrounds/bg_inside.png"       "bg_inside"
copy_file "$SOURCE_DIR/收银台近景.png"             "$ASSETS_DIR/backgrounds/bg_cashier.png"      "bg_cashier"
copy_file "$SOURCE_DIR/通用货架全景.png"            "$ASSETS_DIR/backgrounds/bg_shelf.png"        "bg_shelf"
copy_file "$SOURCE_DIR/饮品货架.png"               "$ASSETS_DIR/backgrounds/bg_drink_shelf.png"  "bg_drink_shelf"
copy_file "$SOURCE_DIR/食品货架.png"               "$ASSETS_DIR/backgrounds/bg_food_shelf.png"   "bg_food_shelf"
copy_file "$SOURCE_DIR/加热区:微波炉区域.png"        "$ASSETS_DIR/backgrounds/bg_heating.png"      "bg_heating"
copy_file "$SOURCE_DIR/休息区:用餐区.png"            "$ASSETS_DIR/backgrounds/bg_rest.png"         "bg_rest"
copy_file "$SOURCE_DIR/出店离开场景.png"             "$ASSETS_DIR/backgrounds/bg_exit.png"         "bg_exit"
echo ""

# ==========================================
# 店员立绘 — 普通场景
# ==========================================
echo "🧑‍🎨 复制店员立绘（普通场景）..."
copy_file "$SOURCE_DIR/店员欢迎光临图（睁眼）.png"   "$ASSETS_DIR/sprites/clerk_welcome_open.png"   "welcome_open"
copy_file "$SOURCE_DIR/店员欢迎光临图（闭眼）.png"   "$ASSETS_DIR/sprites/clerk_welcome_closed.png" "welcome_closed"
copy_file "$SOURCE_DIR/店员倾听图（睁眼）.png"       "$ASSETS_DIR/sprites/clerk_listen_open.png"    "listen_open"
copy_file "$SOURCE_DIR/店员倾听图（闭眼）.png"       "$ASSETS_DIR/sprites/clerk_listen_closed.png"  "listen_closed"
copy_file "$SOURCE_DIR/店员挥手告别图（睁眼）.png"   "$ASSETS_DIR/sprites/clerk_wave_open.png"      "wave_open"
copy_file "$SOURCE_DIR/店员挥手告别图（闭眼）.png"   "$ASSETS_DIR/sprites/clerk_wave_closed.png"    "wave_closed"
copy_file "$SOURCE_DIR/店员拿饮品图（睁眼）.png"     "$ASSETS_DIR/sprites/clerk_drink_open.png"     "drink_open"
copy_file "$SOURCE_DIR/店员拿着饮品图（闭眼）.png"   "$ASSETS_DIR/sprites/clerk_drink_closed.png"   "drink_closed"
copy_file "$SOURCE_DIR/店员展示饮品（睁眼）.png"     "$ASSETS_DIR/sprites/clerk_display_drink_open.png"   "display_drink_open"
copy_file "$SOURCE_DIR/店员展示饮品（闭眼）.png"     "$ASSETS_DIR/sprites/clerk_display_drink_closed.png" "display_drink_closed"
copy_file "$SOURCE_DIR/店员拿食物图（睁眼）图一.png" "$ASSETS_DIR/sprites/clerk_food_1_open.png"    "food_1_open"
copy_file "$SOURCE_DIR/店员拿着食物图（闭眼）图一.png" "$ASSETS_DIR/sprites/clerk_food_1_closed.png" "food_1_closed"
copy_file "$SOURCE_DIR/店员拿食品图（睁眼）图二.png" "$ASSETS_DIR/sprites/clerk_food_2_open.png"    "food_2_open"
copy_file "$SOURCE_DIR/店员拿着食物图（闭眼）图二.png" "$ASSETS_DIR/sprites/clerk_food_2_closed.png" "food_2_closed"
copy_file "$SOURCE_DIR/店员展示食品（睁眼）.png"     "$ASSETS_DIR/sprites/clerk_display_food_open.png"   "display_food_open"
copy_file "$SOURCE_DIR/店员展示食品（闭眼）.png"     "$ASSETS_DIR/sprites/clerk_display_food_closed.png" "display_food_closed"
echo ""

# ==========================================
# 店员立绘 — 休息室
# ==========================================
echo "🛋️  复制店员立绘（休息室）..."
copy_file "$SOURCE_DIR/休息室店员倾听图（睁眼）.png"   "$ASSETS_DIR/sprites/rest_listen_open.png"   "rest_open"
copy_file "$SOURCE_DIR/休息室店员倾听图（半睁眼）.png" "$ASSETS_DIR/sprites/rest_listen_half.png"   "rest_half"
copy_file "$SOURCE_DIR/休息室店员倾听图（闭眼）.png"   "$ASSETS_DIR/sprites/rest_listen_closed.png" "rest_closed"
echo ""

# ==========================================
# 商品图
# ==========================================
echo "🛒 复制物品图..."
copy_file "$SOURCE_DIR/饮品图.png" "$ASSETS_DIR/items/item_drink.png" "item_drink"
echo ""

# ---------- 统计 ----------
bg_count=$(ls "$ASSETS_DIR/backgrounds/"*.png 2>/dev/null | wc -l | tr -d ' ')
sp_count=$(ls "$ASSETS_DIR/sprites/"*.png 2>/dev/null | wc -l | tr -d ' ')
it_count=$(ls "$ASSETS_DIR/items/"*.png 2>/dev/null | wc -l | tr -d ' ')

echo "========================================"
echo "✅ 完成！"
echo "   背景: $bg_count 张"
echo "   立绘: $sp_count 张"
echo "   物品: $it_count 张"
echo "========================================"
echo ""
echo "🚀 用浏览器打开 index.html 即可开始体验。"
echo "   （推荐使用本地服务器: python3 -m http.server 8000）"
