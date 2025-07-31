@echo off
echo 🚀 Starting dev update...
echo.

echo 📦 Compiling TypeScript...
call npm run compile
if %errorlevel% neq 0 (
    echo ❌ Compilation failed
    pause
    exit /b 1
)
echo ✅ TypeScript compiled successfully
echo.

echo 📦 Packaging extension...
call npx @vscode/vsce package --allow-missing-repository --allow-star-activation --no-dependencies
if %errorlevel% neq 0 (
    echo ❌ Packaging failed
    pause
    exit /b 1
)
echo ✅ Extension packaged successfully
echo.

echo 🔧 Installing extension...
rem Try Cursor first
cursor --install-extension toml-shadcn-forms-0.1.0.vsix --force >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Extension installed in Cursor
    echo.
    echo 🔄 Please reload Cursor manually:
    echo    • Press Ctrl+R
    echo    • Or: Ctrl+Shift+P → "Developer: Reload Window"
) else (
    rem Try VS Code
    code --install-extension toml-shadcn-forms-0.1.0.vsix --force >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Extension installed in VS Code
        echo.
        echo 🔄 Please reload VS Code manually:
        echo    • Press Ctrl+R  
        echo    • Or: Ctrl+Shift+P → "Developer: Reload Window"
    ) else (
        echo ⚠️  Could not install extension automatically
        echo 💡 Manual install: Extensions ^> Install from VSIX ^> toml-shadcn-forms-0.1.0.vsix
    )
)

echo.
echo 🎉 Dev update complete!
echo 💡 Your extension is now updated and active
pause