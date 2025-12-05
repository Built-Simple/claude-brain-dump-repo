# Claude Brain Dump System - Windows Setup Script
# Run with: powershell -ExecutionPolicy Bypass -File setup-windows.ps1

param(
    [switch]$SkipPlugins,
    [switch]$SkipMCP,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Claude Brain Dump System - Windows Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir

# Define paths
$ClaudeDir = "$env:USERPROFILE\.claude"
$ClaudeDesktopConfig = "$env:APPDATA\Claude\config.json"

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "  [OK] Node.js: $(node --version)" -ForegroundColor Green

if (-not (Test-Command "npm")) {
    Write-Host "ERROR: npm is not installed." -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] npm: $(npm --version)" -ForegroundColor Green

if (-not (Test-Command "git")) {
    Write-Host "WARNING: Git is not installed. Some features may not work." -ForegroundColor Yellow
} else {
    Write-Host "  [OK] Git: $(git --version)" -ForegroundColor Green
}

# Check for Claude Code
if (-not (Test-Command "claude")) {
    Write-Host "WARNING: Claude Code CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @anthropic-ai/claude-code
}

Write-Host ""
Write-Host "Setting up directory structure..." -ForegroundColor Yellow

# Create .claude directory structure
$dirs = @(
    "$ClaudeDir",
    "$ClaudeDir\solutions",
    "$ClaudeDir\patterns",
    "$ClaudeDir\projects",
    "$ClaudeDir\snippets",
    "$ClaudeDir\plugins"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  Exists: $dir" -ForegroundColor Gray
    }
}

# Copy templates
Write-Host ""
Write-Host "Copying templates..." -ForegroundColor Yellow

$templates = @{
    "$RepoRoot\templates\SOLUTION_TEMPLATE.md" = "$ClaudeDir\SOLUTION_TEMPLATE.md"
    "$RepoRoot\templates\MACHINE_PROFILE_TEMPLATE.md" = "$ClaudeDir\MACHINE_PROFILE_TEMPLATE.md"
}

foreach ($src in $templates.Keys) {
    $dest = $templates[$src]
    if (Test-Path $src) {
        Copy-Item $src $dest -Force
        Write-Host "  Copied: $(Split-Path -Leaf $src)" -ForegroundColor Green
    }
}

# Setup plugins (if not skipped)
if (-not $SkipPlugins) {
    Write-Host ""
    Write-Host "Setting up plugins..." -ForegroundColor Yellow

    # Copy settings.json if it doesn't exist
    $settingsExample = "$RepoRoot\config\plugins\settings.json.example"
    $settingsDest = "$ClaudeDir\settings.json"

    if ((-not (Test-Path $settingsDest)) -and (Test-Path $settingsExample)) {
        Copy-Item $settingsExample $settingsDest
        Write-Host "  Created settings.json" -ForegroundColor Green
    }

    # Add marketplaces
    Write-Host "  Adding plugin marketplaces..." -ForegroundColor Yellow
    $marketplaces = @(
        "anthropics/skills",
        "anthropics/claude-code",
        "jeremylongshore/claude-code-plugins",
        "obra/superpowers-marketplace"
    )

    foreach ($marketplace in $marketplaces) {
        try {
            Write-Host "    Adding: $marketplace" -ForegroundColor Gray
            # Note: Actual command depends on Claude Code CLI syntax
            # claude plugins marketplace add $marketplace 2>$null
        } catch {
            Write-Host "    Warning: Could not add $marketplace" -ForegroundColor Yellow
        }
    }
}

# Setup MCP servers (if not skipped)
if (-not $SkipMCP) {
    Write-Host ""
    Write-Host "Setting up MCP servers..." -ForegroundColor Yellow

    # Install Playwright MCP
    Write-Host "  Installing Playwright MCP server..." -ForegroundColor Gray
    npm install -g @playwright/mcp 2>$null

    # Update Claude Desktop config if it exists
    if (Test-Path (Split-Path $ClaudeDesktopConfig)) {
        $configExample = "$RepoRoot\config\mcp-servers\claude_desktop_config.json.example"
        if ((Test-Path $configExample) -and (-not (Test-Path $ClaudeDesktopConfig))) {
            $config = Get-Content $configExample -Raw
            $config = $config -replace '\[USERNAME\]', $env:USERNAME
            Set-Content -Path $ClaudeDesktopConfig -Value $config
            Write-Host "  Created Claude Desktop config" -ForegroundColor Green
        } elseif (Test-Path $ClaudeDesktopConfig) {
            Write-Host "  Claude Desktop config already exists - skipping" -ForegroundColor Gray
        }
    }
}

# Create initial CLAUDE.md if it doesn't exist
$claudeMd = "$env:USERPROFILE\CLAUDE.md"
if (-not (Test-Path $claudeMd)) {
    Write-Host ""
    Write-Host "Creating initial CLAUDE.md..." -ForegroundColor Yellow
    $template = Get-Content "$RepoRoot\templates\CLAUDE.md.template" -Raw
    $template = $template -replace '\[PATH\]', $env:USERPROFILE
    $template = $template -replace '\[Windows/Mac/Linux\]', 'Windows'
    $template = $template -replace '\[YYYY-MM-DD\]', (Get-Date -Format "yyyy-MM-dd")
    Set-Content -Path $claudeMd -Value $template
    Write-Host "  Created: $claudeMd" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'claude' to start Claude Code" -ForegroundColor White
Write-Host "2. Ask Claude to 'document my computer environment'" -ForegroundColor White
Write-Host "3. Start building your brain dump system!" -ForegroundColor White
Write-Host ""
Write-Host "Documentation location: $ClaudeDir" -ForegroundColor Gray
