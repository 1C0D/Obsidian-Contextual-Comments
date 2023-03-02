REM Udpate your version in version.json, package.json, manifest.json

@echo off

setlocal enableextensions

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

REM del the file created by the prompt
del your
