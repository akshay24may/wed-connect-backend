# PowerShell script to move old code to old_data folder
# This preserves existing code before Phase 1 implementation

Write-Host "Moving old code to old_data folder..." -ForegroundColor Cyan

# Create old_data directory structure
$oldDataPath = "old_data"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupPath = "$oldDataPath/backup_$timestamp"

Write-Host "Creating backup directory: $backupPath" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

# Define directories to move
$directoriesToMove = @(
    "src/controllers",
    "src/services",
    "src/repositories",
    "src/routes",
    "src/utils",
    "src/middleware",
    "src/uploads",
    "src/socket",
    "src/jobs"
)

# Move each directory if it exists
foreach ($dir in $directoriesToMove) {
    if (Test-Path $dir) {
        $dirName = Split-Path $dir -Leaf
        $destination = "$backupPath/$dirName"
        
        Write-Host "Moving $dir to $destination..." -ForegroundColor Green
        
        # Move the directory
        Move-Item -Path $dir -Destination $destination -Force
        
        Write-Host "  Moved $dir" -ForegroundColor Green
    } else {
        Write-Host "  Directory not found: $dir" -ForegroundColor Gray
    }
}

# Recreate empty directories for fresh implementation
Write-Host "`nRecreating empty directories..." -ForegroundColor Cyan

$directoriesToCreate = @(
    "src/controllers/auth",
    "src/controllers/common",
    "src/controllers/panel",
    "src/controllers/vendor",
    "src/controllers/consumer",
    "src/controllers/public",
    "src/services",
    "src/repositories",
    "src/routes/auth",
    "src/routes/common",
    "src/routes/panel",
    "src/routes/vendor",
    "src/routes/consumer",
    "src/routes/public",
    "src/utils/constants",
    "src/middleware",
    "src/uploads/portfolios",
    "src/uploads/profiles",
    "src/uploads/chat",
    "src/uploads/payments"
)

foreach ($dir in $directoriesToCreate) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  Created $dir" -ForegroundColor Green
}

Write-Host "`nMigration complete!" -ForegroundColor Green
Write-Host "Old code backed up to: $backupPath" -ForegroundColor Yellow
Write-Host "Fresh directory structure created for Phase 1 implementation" -ForegroundColor Cyan
