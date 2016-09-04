@echo off

setlocal enableextensions enabledelayedexpansion

set "IPSECC=C:\Program Files\ShrewSoft\VPN Client\ipsecc.exe"
set "AUTOHOTKEY=C:\Program Files\AutoHotkey\AutoHotkey.exe"

set "CONNECTION=%1"

if "%CONNECTION%"=="" goto usage
goto main

:usage
echo\Usage: %~nx0 ^<CONNECTION^>
exit /b

:main

start "" "%IPSECC%" -r "%CONNECTION%"
start "" "%AUTOHOTKEY%" "%~dp0\ipsecc_credentials.ahk" "%1"
