param(
    [string]$ServerHost = "47.238.126.26",
    [string]$ServerUser = "root",
    [string]$RemoteAppDir = "/www/wwwroot/easy_bill",
    [string]$RemoteDataDir = "/www/wwwroot/easy_bill_data",
    [string]$Pm2Name = "easy-bill-api"
)

$ErrorActionPreference = "Stop"

function Assert-LastExitCode {
    param([string]$Step)
    if ($LASTEXITCODE -ne 0) {
        throw "$Step failed with exit code: $LASTEXITCODE"
    }
}

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ArchivePath = Join-Path $ProjectRoot "server.tgz"
$LocalNodeModules = Join-Path $ProjectRoot "server\node_modules"

Write-Host "[1/5] Packaging backend..."
if (Test-Path $ArchivePath) {
    Remove-Item $ArchivePath -Force
}

if (Test-Path $LocalNodeModules) {
    Write-Warning "Found local server/node_modules. It will be excluded from package."
}

Push-Location $ProjectRoot
try {
    tar --exclude='server/node_modules' -czf $ArchivePath server
    Assert-LastExitCode "Package"

    $archiveList = tar -tf $ArchivePath
    Assert-LastExitCode "Archive validation"
    if ($archiveList | Select-String -Pattern '^server/node_modules/' -Quiet) {
        throw "Archive validation failed: server/node_modules is included."
    }
}
finally {
    Pop-Location
}

Write-Host "[2/5] Uploading package to /tmp/server.tgz ..."
scp $ArchivePath "$ServerUser@$ServerHost`:/tmp/server.tgz"
Assert-LastExitCode "Upload"

Write-Host "[3/5] Running remote deployment..."
$remoteScript = @'
set -e

APP_DIR="__APP_DIR__"
DATA_DIR="__DATA_DIR__"
PM2_NAME="__PM2_NAME__"
OLD_LOCK="/tmp/easy_bill_old_package-lock.json"
OLD_NODE_MODULES="/tmp/easy_bill_node_modules_backup"

mkdir -p "$APP_DIR"
mkdir -p "$DATA_DIR"

if [ -f "$OLD_LOCK" ]; then
    rm -f "$OLD_LOCK"
fi

if [ -d "$OLD_NODE_MODULES" ]; then
    rm -rf "$OLD_NODE_MODULES"
fi

if [ -d "$APP_DIR/server" ]; then
    if [ -f "$APP_DIR/server/package-lock.json" ]; then
        cp "$APP_DIR/server/package-lock.json" "$OLD_LOCK"
    fi

    if [ -d "$APP_DIR/server/node_modules" ]; then
        mv "$APP_DIR/server/node_modules" "$OLD_NODE_MODULES"
    fi

  rm -rf "$APP_DIR/server"
fi

tar -xzf /tmp/server.tgz -C "$APP_DIR"

rm -rf "$APP_DIR/server/data"
ln -sfn "$DATA_DIR" "$APP_DIR/server/data"

if [ -d "$OLD_NODE_MODULES" ]; then
    mv "$OLD_NODE_MODULES" "$APP_DIR/server/node_modules"
fi

cd "$APP_DIR/server"

if [ -f "$OLD_LOCK" ] && cmp -s "$OLD_LOCK" "$APP_DIR/server/package-lock.json"; then
    echo "package-lock unchanged, skip npm install"
else
    npm install --omit=dev --no-audit --no-fund --prefer-offline
fi

if [ -f "$OLD_LOCK" ]; then
    rm -f "$OLD_LOCK"
fi

pm2 restart "$PM2_NAME" || pm2 start src/app.js --name "$PM2_NAME"
pm2 save || pm2 dump || true
'@

$remoteScript = $remoteScript.Replace('__APP_DIR__', $RemoteAppDir)
$remoteScript = $remoteScript.Replace('__DATA_DIR__', $RemoteDataDir)
$remoteScript = $remoteScript.Replace('__PM2_NAME__', $Pm2Name)
$remoteScript = $remoteScript -replace "`r", ""

$remoteScript | ssh "$ServerUser@$ServerHost" "bash -s"
Assert-LastExitCode "Remote deploy"

Write-Host "[4/5] Health check..."
try {
    $health = Invoke-RestMethod -Uri "https://api.pxfish.top/health" -Method Get -TimeoutSec 10
    Write-Host "health =>" ($health | ConvertTo-Json -Compress)
}
catch {
    Write-Warning "Health check failed. Run: curl -s https://api.pxfish.top/health"
}

Write-Host "[5/5] Done"
