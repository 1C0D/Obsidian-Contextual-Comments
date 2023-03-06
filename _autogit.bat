@echo off

rem Add all modified files to the Git staging area
git add .
git status

echo Do you want to continue? (y/n)
set /p choice=
if /i "%choice%" neq "y" exit

REM chercher la version dans manifest.json e.g "version": "1.0.2",
for /f "tokens=2 delims=:," %%a in ('findstr /c:"\"version\":" manifest.json') do (
    set previous_version=%%~a
)

echo Previous version: %previous_version%

REM prompt to enter your new version
set /p new_version="Enter new version number: "

REM modify version.json
(
    echo {
    echo     "%new_version%": "0.15.0"
    echo }
) > versions.json

REM exe update-version.ps1
powershell.exe -ExecutionPolicy Bypass -File "%~dp0_newVersion_.ps1" %new_version%

REM get adress repo
for /f "usebackq" %%G in (`git config --get remote.origin.url`) do set remoteUrl=%%G

set "statURL=%remoteUrl:~19,-4%"

REM replace nameRepo in stats.md with correct value
powershell -Command "(gc stats.md) -replace 'nameRepo', '%statURL%' | Out-File -encoding ASCII stats.md"

git add .

rem Prompt the user for a commit message
set /p commitMessage="Enter commit message: "

rem Commit the changes with the specified commit message
git commit -m "%commitMessage%"
git push

REM open repo in browser
start "" "%remoteUrl%"

rem Pause the console to keep it open
pause
