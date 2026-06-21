@echo off
setlocal
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"
set "ASTRO_TELEMETRY_DISABLED=1"
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run dev
