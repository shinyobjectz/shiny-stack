@echo off
REM VSCode Extension Setup Script for Windows

echo 🚀 Setting up TOML → shadcn/ui Forms VSCode Extension...

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Compile TypeScript
echo 🔨 Compiling TypeScript...
call npm run compile

REM Package extension (optional)
echo 📦 Packaging extension...
where vsce >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    call vsce package
    echo ✅ Extension packaged successfully!
    echo 📁 Install the .vsix file in VS Code or press F5 to debug
) else (
    echo ℹ️  To package extension, install vsce: npm install -g vsce
    echo 🔍 For now, press F5 in VS Code to debug the extension
)

echo.
echo 🎉 Setup complete! Your TOML → shadcn/ui Forms extension is ready!
echo.
echo 📖 Next steps:
echo    1. Open this folder in VS Code
echo    2. Press F5 to launch Extension Development Host
echo    3. Open any .config file to see the magic! ✨
echo.
echo 🔧 Available commands:
echo    • npm run compile  - Compile TypeScript
echo    • npm run watch    - Watch and compile on changes
echo    • npm run lint     - Run ESLint
echo.
pause