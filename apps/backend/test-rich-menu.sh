#!/bin/bash

# Rich Menu 診斷腳本
# 使用方法：bash test-rich-menu.sh YOUR_CHANNEL_ID YOUR_LINE_CHANNEL_ACCESS_TOKEN

CHANNEL_ID=${1:-"your-channel-id"}
TOKEN=${2:-"your-token"}

echo "=========================================="
echo "Rich Menu 診斷工具"
echo "=========================================="
echo ""

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 測試 Token 有效性
echo -e "${YELLOW}步驟 1: 測試 LINE Channel Access Token 有效性...${NC}"
TOKEN_TEST=$(curl -s -X GET \
  "https://api.line.me/v2/bot/info" \
  -H "Authorization: Bearer ${TOKEN}")

if echo "$TOKEN_TEST" | grep -q "userId"; then
  echo -e "${GREEN}✅ Token 有效${NC}"
  echo "$TOKEN_TEST" | jq '.' 2>/dev/null || echo "$TOKEN_TEST"
else
  echo -e "${RED}❌ Token 無效或已過期${NC}"
  echo "$TOKEN_TEST"
  echo ""
  echo "請前往 LINE Developers Console 重新生成長期 Token"
  exit 1
fi

echo ""
echo "=========================================="

# 2. 檢查 Rich Menu 列表
echo -e "${YELLOW}步驟 2: 檢查 Rich Menu 列表...${NC}"
RICH_MENU_LIST=$(curl -s -X GET \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu?channelId=${CHANNEL_ID}")

echo "$RICH_MENU_LIST" | jq '.' 2>/dev/null || echo "$RICH_MENU_LIST"

RICH_MENU_COUNT=$(echo "$RICH_MENU_LIST" | jq '.data | length' 2>/dev/null || echo "0")
if [ "$RICH_MENU_COUNT" = "0" ]; then
  echo -e "${YELLOW}⚠️  目前沒有 Rich Menu，需要部署${NC}"
else
  echo -e "${GREEN}✅ 找到 ${RICH_MENU_COUNT} 個 Rich Menu${NC}"
fi

echo ""
echo "=========================================="

# 3. 檢查部署狀態
echo -e "${YELLOW}步驟 3: 檢查部署狀態...${NC}"
STATUS=$(curl -s -X GET \
  "https://tucheng-cat-autopost.onrender.com/line/rich-menu-deploy/status?channelId=${CHANNEL_ID}")

echo "$STATUS" | jq '.' 2>/dev/null || echo "$STATUS"

HAS_TOKEN=$(echo "$STATUS" | jq '.environment.hasAccessToken' 2>/dev/null || echo "false")
HAS_LIFF=$(echo "$STATUS" | jq '.environment.hasLiffUrl' 2>/dev/null || echo "false")

echo ""
if [ "$HAS_TOKEN" = "true" ]; then
  echo -e "${GREEN}✅ LINE_CHANNEL_ACCESS_TOKEN 已設定${NC}"
else
  echo -e "${RED}❌ LINE_CHANNEL_ACCESS_TOKEN 未設定${NC}"
fi

if [ "$HAS_LIFF" = "true" ]; then
  echo -e "${GREEN}✅ LIFF_URL 已設定${NC}"
else
  echo -e "${RED}❌ LIFF_URL 未設定${NC}"
fi

echo ""
echo "=========================================="
echo "診斷完成"
echo "=========================================="

