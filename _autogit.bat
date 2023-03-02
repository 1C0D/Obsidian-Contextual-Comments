@echo off

rem Prompt the user for a commit message
set /p commitMessage="Enter commit message: "

rem Add all modified files to the Git staging area
git add .

rem Commit the changes with the specified commit message
git commit -m "%commitMessage%"

rem Push the changes to the remote repository
REM git push

rem Display the status of the Git repository
git status

rem Open the GitHub repository page
set remoteUrl=
for /f "tokens=2" %%a in ('git remote get-url origin') do set remoteUrl=%%a
if not "%remoteUrl%" == "" start "" "%remoteUrl%"
@echo on
echo %remoteUrl%

rem Pause the console to keep it open
pause

