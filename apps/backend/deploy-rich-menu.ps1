# Rich Menu 自動部署腳本
# 使用方法：.\deploy-rich-menu.ps1 -ChannelId "your-channel-id"
# Token 會從環境變數 LINE_CHANNEL_ACCESS_TOKEN 讀取，或從 Render 環境變數讀取

param(
    [Parameter(Mandatory=$true)]
    [string]$ChannelId,
    
    [Parameter(Mandatory=$false)]
    [string]$Token = $env:LINE_CHANNEL_ACCESS_TOKEN
)

$baseUrl = "https://tucheng-cat-autopost.onrender.com"

if (-not $Token) {
    Write-Host "❌ 錯誤: 未找到 LINE_CHANNEL_ACCESS_TOKEN" -ForegroundColor Red
    Write-Host "   請設定環境變數或使用 -Token 參數" -ForegroundColor Yellow
    exit 1
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Rich Menu 自動部署" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Channel ID: $ChannelId" -ForegroundColor Cyan
Write-Host ""

# 步驟 1：建立 Rich Menu
Write-Host "步驟 1: 建立 Rich Menu..." -ForegroundColor Yellow
try {
    # 後端 API 使用環境變數中的 Token，不需要 Authorization header
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/line/rich-menu/default?channelId=$ChannelId" `
        -Method Post
    
    $richMenuId = $createResponse.richMenuId
    Write-Host "✅ Rich Menu 已建立: $richMenuId" -ForegroundColor Green
} catch {
    Write-Host "❌ 建立失敗: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode.value__
    exit 1
}

Write-Host ""

# 步驟 2：檢查圖片是否存在
Write-Host "步驟 2: 檢查圖片檔案..." -ForegroundColor Yellow
$imagePath = Join-Path $PSScriptRoot "rich-menu-dashboard.png"

if (-not (Test-Path $imagePath)) {
    Write-Host "⚠️  圖片檔案不存在: $imagePath" -ForegroundColor Yellow
    Write-Host "   請先執行: npm run rich-menu:generate" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   或者手動上傳圖片：" -ForegroundColor Yellow
    Write-Host "   POST $baseUrl/line/rich-menu/$richMenuId/image?channelId=$ChannelId" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Rich Menu 已建立，但需要手動上傳圖片" -ForegroundColor Green
    Write-Host "   Rich Menu ID: $richMenuId" -ForegroundColor Cyan
    exit 0
}

Write-Host "✅ 找到圖片: $imagePath" -ForegroundColor Green
Write-Host ""

# 步驟 3：上傳圖片
Write-Host "步驟 3: 上傳圖片..." -ForegroundColor Yellow
try {
    $form = @{
        image = Get-Item -Path $imagePath
    }
    
    # 注意：後端 API 不需要 Authorization header，因為它使用環境變數
    Invoke-RestMethod -Uri "$baseUrl/line/rich-menu/$richMenuId/image?channelId=$ChannelId" `
        -Method Post `
        -Form $form
    
    Write-Host "✅ 圖片已上傳" -ForegroundColor Green
} catch {
    Write-Host "❌ 上傳失敗: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 步驟 4：設定為預設
Write-Host "步驟 4: 設定為預設 Rich Menu..." -ForegroundColor Yellow
try {
    # 後端 API 使用環境變數中的 Token
    Invoke-RestMethod -Uri "$baseUrl/line/rich-menu/$richMenuId/set-default?channelId=$ChannelId" `
        -Method Post
    
    Write-Host "✅ 已設定為預設 Rich Menu" -ForegroundColor Green
} catch {
    Write-Host "❌ 設定失敗: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Rich Menu ID: $richMenuId" -ForegroundColor Cyan
Write-Host ""
Write-Host "注意：" -ForegroundColor Yellow
Write-Host "- Rich Menu 可能需要 1-5 分鐘才會在 LINE 中顯示" -ForegroundColor White
Write-Host "- 請重新開啟 LINE 聊天室查看" -ForegroundColor White

