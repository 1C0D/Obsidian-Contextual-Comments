@echo off

rem Prompt the user for a commit message
set /p commitMessage="Enter commit message: "

rem Add all modified files to the Git staging area
git add .

rem Commit the changes with the specified commit message
git commit -m "%commitMessage%"

rem Display the status of the Git repository
git status

for /f "tokens=2" %%a in ('git remote get-url origin') do (
  set remoteUrl=%%a
  set remoteUrl=!remoteUrl:.git=!
  REM echo !remoteUrl!
  echo Remote URL before: %remoteUrl%
  echo !remoteUrl! > tmpfile.txt
  echo Remote URL after: %remoteUrl%

  
  REM Open the URL in the default web browser
  explorer "!remoteUrl!"
)

rem Pause the console to keep it open
pause









