# 立即部署 Rich Menu

## 快速部署（只需要 Channel ID）

```powershell
cd apps/backend
.\deploy-rich-menu.ps1 -ChannelId "YOUR_CHANNEL_ID"
```

**注意**：Token 會自動從 Render 環境變數 `LINE_CHANNEL_ACCESS_TOKEN` 讀取。

## 如果圖片不存在

腳本會自動檢查圖片，如果不存在會提示您：

1. **先生成圖片**：
   ```powershell
   npm run rich-menu:generate
   ```

2. **然後重新執行部署**：
   ```powershell
   .\deploy-rich-menu.ps1 -ChannelId "YOUR_CHANNEL_ID"
   ```

## 完成後

- 等待 1-5 分鐘
- 重新開啟 LINE 聊天室
- Rich Menu 應該會顯示在底部

