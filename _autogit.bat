@echo off

rem Prompt the user for a commit message
set /p commitMessage="Enter commit message: "

rem Add all modified files to the Git staging area
git add .

rem Commit the changes with the specified commit message
git commit -m "%commitMessage%"

rem Display the status of the Git repository
git status

for /f "usebackq" %%G in (`git config --get remote.origin.url`) do set remoteUrl=%%G
set remoteUrl=!remoteUrl:.git=!
start "" "https://github.com/%remoteUrl%"

rem Pause the console to keep it open
pause






