@echo off
setlocal
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run sync:data
