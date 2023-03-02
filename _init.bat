REM Download the sample-plugin with git clone ... beforehand to make sure to have all the files.
REM put this file in your plugin folder

@echo off

REM create folder src (or do nothing)
mkdir src

REM we move main.ts to src if not already in src to be sure not to overwrite it
if not exist "src\main.ts" (
    move main.ts src\
)

REM this is needed if you have files in src... 
REM replace entryPoints: ["main.ts"] par entryPoints: ["src/main.ts"] in esbuild.config.mjs or do nothing
powershell -Command "(gc esbuild.config.mjs) -replace 'entryPoints: \[\"main\.ts\"\]', 'entryPoints: [\"src/main.ts\"]' | Out-File -encoding ASCII esbuild.config.mjs"

REM start Visual Studio Code with the main.ts file and create it if it does not exist
REM /B background, will excecute what's next without waiting VSC open
start /B code src/main.ts
REM install and run dev
call npm install 
call npm run dev
pause

REM so it will do all the steps you need to create your addon and edit it.
REM I will create another file to edit all version numbers at once
