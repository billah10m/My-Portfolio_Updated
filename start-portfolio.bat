@echo off
title Asif Billah Portfolio & Admin CMS
echo ========================================================
echo   Launching Asif Billah Portfolio & Admin CMS...
echo ========================================================
cd /d "D:\Project\portfolio"
echo Starting local server on http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"
npm run dev
pause
