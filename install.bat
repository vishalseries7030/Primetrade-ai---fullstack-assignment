@echo off
echo ========================================
echo   TaskVerse - Installation Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

echo [2/4] Setting up Backend Environment...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your MongoDB URI and JWT secret.
) else (
    echo .env file already exists.
)
echo.

echo [3/4] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

echo [4/4] Setting up Frontend Environment...
if not exist .env (
    copy .env.example .env
    echo .env file created!
) else (
    echo .env file already exists.
)
echo.

cd ..

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Edit backend/.env with your MongoDB URI
echo 2. Run start-backend.bat to start the backend
echo 3. Run start-frontend.bat to start the frontend
echo.
echo For detailed instructions, see setup.md
echo.
pause
