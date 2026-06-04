# Run this script after logging into GitHub: gh auth login
$gitBin = "$env:LOCALAPPDATA\PortableGit\cmd"
$ghBin = "$env:LOCALAPPDATA\GitHubCLI\bin"
$env:PATH = "$gitBin;$ghBin;$env:PATH"

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repoRoot

$repoName = "QuinielaFIFA2026"
Write-Host "Creating GitHub repository '$repoName' and pushing..." -ForegroundColor Cyan

gh repo create $repoName --public --source=. --remote=origin --push --description "FIFA World Cup 2026 Quiniela - React + Node.js + TypeScript"

if ($LASTEXITCODE -eq 0) {
    gh repo view --web
    Write-Host "Done! Repository uploaded to GitHub." -ForegroundColor Green
} else {
    Write-Host "Failed. Make sure you ran: gh auth login" -ForegroundColor Red
}
