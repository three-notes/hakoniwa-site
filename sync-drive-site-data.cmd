@echo off
cd /d "%~dp0"
npm.cmd run sync:drive-data -- %*
