@echo off

REM prompt to enter your new version
set /p new_version="Enter new version number: "
set "versionMinObsidian=0.15.0"

REM modify version.json
(
    echo {
    echo     "%new_version%": "%versionMinObsidian%"
    echo }
) > versions.json

(
    echo {
    echo     "%new_version%": "%versionMinObsidian%"
    echo }
) > versions.json

REM exe update-version.ps1
powershell.exe -ExecutionPolicy Bypass -File "%~dp0_version_.ps1" %new_version%



rem Prompt the user for a commit message
set /p commitMessage="Enter commit message: "

rem Add all modified files to the Git staging area
git add .

rem Commit the changes with the specified commit message
git commit -m "%commitMessage%"
REM git push
rem Display the status of the Git repository
git status

REM open your repo
for /f "usebackq" %%G in (`git config --get remote.origin.url`) do set remoteUrl=%%G
start "" "%remoteUrl%"

REM del the file created by the prompt // mettre en attente
REM del your

rem Pause the console to keep it open
pause







