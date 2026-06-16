# Fresh orphan push — bypasses broken history and large file issues
$repoPath = $PSScriptRoot
Set-Location $repoPath
Write-Host "DIR: $repoPath" -ForegroundColor Cyan

# 1. Remove lock files
foreach ($lock in @(".git\index.lock", ".git\HEAD.lock")) {
    $p = Join-Path $repoPath $lock
    if (Test-Path $p) { Remove-Item $p -Force; Write-Host "Removed $lock" -ForegroundColor Yellow }
}

# 2. Abort any rebase/merge in progress
if (Test-Path (Join-Path $repoPath ".git\rebase-merge"))  { git rebase --abort  2>$null }
if (Test-Path (Join-Path $repoPath ".git\MERGE_HEAD"))    { git merge --abort   2>$null }

# 3. Write .gitignore to exclude large files
$gitignore = @"
# Large files
*.zip
*.ZIP
*.7z
*.rar
*.tar
*.gz
"@
Set-Content ".gitignore" $gitignore -Encoding UTF8
Write-Host "Wrote .gitignore" -ForegroundColor Green

# 4. Create orphan branch (no history)
git checkout --orphan fresh-main
Write-Host "Created orphan branch" -ForegroundColor Green

# 5. Stage everything (gitignore will skip large files)
git add -A
Write-Host "Staged files" -ForegroundColor Green

# 6. Show what's staged (size check)
$staged = git diff --cached --name-only
Write-Host "Files to commit: $($staged.Count)" -ForegroundColor Cyan

# 7. Commit
git commit -m "feat: CVS store picker + n8n v5 + GAS CVS columns"
Write-Host "Committed" -ForegroundColor Green

# 8. Force push as main
Write-Host "`nForce pushing as main..." -ForegroundColor Cyan
git push --force origin fresh-main:main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPush OK! Site updates in ~1-2 