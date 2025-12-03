# Rich Menu 診斷腳本 (PowerShell)
# 使用方法：.\test-rich-menu.ps1 -ChannelId "your-channel-id" -Token "your-token"

param(
    [Parameter(Mandatory=$true)]
    [string]$ChannelId,
    
    [Parameter(Mandatory=$true)]
    [string]$Token
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Rich Menu 診斷工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 測試 Token 有效性
Write-Host "步驟 1: 測試 LINE Channel Access Token 有效性..." -ForegroundColor Yellow
try {
    $tokenTest = Invoke-RestMethod -Uri "https://api.line.me/v2/bot/info" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $Token" }
    
    Write-Host "✅ Token 有效" -ForegroundColor Green
    $tokenTest | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Token 無效或已過期" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "請前往 LINE Developers Console 重新生成長期 Token"
    exit 1
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

# 2. 檢查 Rich Menu 列表
Write-Host "步驟 2: 檢查 Rich Menu 列表..." -ForegroundColor Yellow
try {
    $richMenuList = Invoke-RestMethod -Uri "https://tucheng-cat-autopost.onrender.com/line/rich-menu?channelId=$ChannelId" `
        -Method Get
    
    $richMenuList | ConvertTo-Json -Depth 10
    
    $richMenuCount = ($richMenuList.data | Measure-Object).Count
    if ($richMenuCount -eq 0) {
        Write-Host "⚠️  目前沒有 Rich Menu，需要部署" -ForegroundColor Yellow
    } else {
        Write-Host "✅ 找到 $richMenuCount 個 Rich Menu" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ 無法取得 Rich Menu 列表" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

# 3. 檢查部署狀態
Write-Host "步驟 3: 檢查部署狀態..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "https://tucheng-cat-autopost.onrender.com/line/rich-menu-deploy/status?channelId=$ChannelId" `
        -Method Get
    
    $status | ConvertTo-Json -Depth 10
    
    Write-Host ""
    if ($status.environment.hasAccessToken) {
        Write-Host "✅ LINE_CHANNEL_ACCESS_TOKEN 已設定" -ForegroundColor Green
    } else {
        Write-Host "❌ LINE_CHANNEL_ACCESS_TOKEN 未設定" -ForegroundColor Red
    }
    
    if ($status.environment.hasLiffUrl) {
        Write-Host "✅ LIFF_URL 已設定" -ForegroundColor Green
    } else {
        Write-Host "❌ LIFF_URL 未設定" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ 無法取得部署狀態" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "診斷完成" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

