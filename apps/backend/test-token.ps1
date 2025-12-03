# 簡單的 Token 測試腳本
# 使用方法：.\test-token.ps1 -Token "your-token"

param(
    [Parameter(Mandatory=$true)]
    [string]$Token
)

Write-Host "測試 LINE Channel Access Token..." -ForegroundColor Yellow
Write-Host ""

try {
    $result = Invoke-RestMethod -Uri "https://api.line.me/v2/bot/info" `
        -Method Get `
        -Headers @{ "Authorization" = "Bearer $Token" }
    
    Write-Host "✅ Token 有效！" -ForegroundColor Green
    Write-Host ""
    Write-Host "Channel 資訊：" -ForegroundColor Cyan
    $result | ConvertTo-Json -Depth 10
    
    Write-Host ""
    Write-Host "Channel ID: $($result.userId)" -ForegroundColor Green
    Write-Host "Display Name: $($result.displayName)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Token 測試失敗" -ForegroundColor Red
    Write-Host ""
    Write-Host "錯誤訊息：" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Message -like "*Authentication failed*") {
        Write-Host ""
        Write-Host "可能的原因：" -ForegroundColor Yellow
        Write-Host "1. Token 無效或已過期" -ForegroundColor White
        Write-Host "2. Token 格式錯誤（可能複製不完整）" -ForegroundColor White
        Write-Host "3. 需要重新生成長期 Token" -ForegroundColor White
        Write-Host ""
        Write-Host "請前往 LINE Developers Console 重新生成 Token：" -ForegroundColor Yellow
        Write-Host "https://developers.line.biz/console/" -ForegroundColor Cyan
    }
}

