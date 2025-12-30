@echo off
echo ========================================
echo Applying cleanup changes to main branch
echo ========================================
cd /d "D:\Development\Applications\cp_generate_sunhorse\generate_service_cp"

echo.
echo Step 1: Adding all changes...
git add .

echo.
echo Step 2: Committing changes...
git commit -m "cleanup: удалены неиспользуемые файлы, библиотеки и debug логи (merged from cleanup-unused-files)"

echo.
echo Step 3: Checking status...
git status

echo.
echo ========================================
echo Cleanup applied successfully!
echo ========================================
echo.
echo To push changes, run: git push origin main
echo.
pause

