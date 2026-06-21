$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = if ($args.Count -ge 1) { [int]$args[0] } else { 4321 }
$server = Join-Path $root "scripts\static-server.mjs"
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

function Test-Node($path) {
  if (-not $path) {
    return $false
  }

  try {
    & $path --version *> $null
    return $LASTEXITCODE -eq 0
  } catch {
    return $false
  }
}

$node = $null

try {
  $cmd = Get-Command node -ErrorAction Stop
  if (Test-Node $cmd.Source) {
    $node = $cmd.Source
  }
} catch {
  $node = $null
}

if (-not $node -and (Test-Path $bundledNode) -and (Test-Node $bundledNode)) {
  $node = $bundledNode
}

if (-not $node) {
  Write-Error "Node.js was not found. Install Node.js LTS, then reopen the terminal."
  exit 1
}

Write-Host "Starting preview server..."
Write-Host "URL: http://127.0.0.1:$port/"
Write-Host "Press Ctrl+C to stop."

& $node $server $root $port
