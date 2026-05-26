@echo off
REM Start a tiny local web server in this folder.
REM Then open http://localhost:8000 in your browser.
cd /d "%~dp0"
echo.
echo  Nebula blog — local server
echo  --------------------------
echo  Open: http://localhost:8000
echo  Stop: Ctrl+C
echo.
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server 8000
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    py -m http.server 8000
  ) else (
    where npx >nul 2>nul
    if %errorlevel%==0 (
      npx --yes serve -l 8000 .
    ) else (
      echo  No Python or Node found. Install one of:
      echo    - Python: https://python.org
      echo    - Node:   https://nodejs.org
      pause
    )
  )
)
