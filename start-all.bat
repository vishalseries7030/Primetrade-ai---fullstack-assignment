@echo off
echo ========================================
echo   Starting TaskVerse (Backend + Frontend)
echo ========================================
echo.
echo Starting Backend Server...
start "TaskVerse Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend Server...
start "TaskVerse Frontend" cmd /k "cd frontend && npm run dev"
echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:5000/api-docs
echo.
echo Close the terminal windows to stop the servers.
echo.
pause
