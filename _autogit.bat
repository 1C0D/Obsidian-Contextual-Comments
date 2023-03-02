@echo off

rem Prompt the user for a commit message
set /p commitMessage="Enter commit message: "

rem Add all modified files to the Git staging area
git add .

rem Commit the changes with the specified commit message
git commit -m "%commitMessage%"

rem Display the status of the Git repository
git status

REM git remote -v
for /f "tokens=2" %%a in ('git config --get remote.origin.url') do (
  set giturl=%%a
  set giturl=!giturl/git\@github\.com\:/https://github.com/!
  start "" "!giturl!"
)

rem Pause the console to keep it open
pause

REM giturl=$(git config --get remote.origin.url) 
REM giturl=${giturl/git\@github\.com\:/https://github.com/}
REM giturl=${giturl/\.git/\/tree/}
REM branch="$(git symbolic-ref HEAD 2>/dev/null)" ||
REM branch="(unnamed branch)"     # detached HEAD
REM branch=${branch##refs/heads/}
REM giturl=$giturl/tree/$branch
REM start $giturl





