@echo off
setlocal
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"
set "ASTRO_TELEMETRY_DISABLED=1"
set "PUBLIC_BASE_PATH=/hakoniwa-site/"
set "PUBLIC_OUT_DIR=docs"
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run build

