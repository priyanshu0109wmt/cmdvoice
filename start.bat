@echo off
title cmdVoice Assistant Server
cd /d "%~dp0"
echo ===================================================
echo   Starting cmdVoice Windows Voice Assistant Server
echo ===================================================
echo.
node server.js
if %errorlevel% neq 0 (
  echo.
  echo Server stopped with error.
  pause
)
