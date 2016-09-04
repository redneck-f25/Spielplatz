@ echo off

setlocal enableextensions enabledelayedexpansion

set "IP_ADDR=%1"
set "IFACE_METRIC=%2"

if "%IP_ADDR%"=="" goto usage
if "%IFACE_METRIC%"=="" goto usage
goto main

:usage
echo\Usage: %~nx0 ^<IP_ADDR^> ^<IFACE_METRIC^>
exit /b

:main
powershell -Command "Get-NetIPInterface -AssociatedIPAddress ( Get-NetIPAddress -IPAddress %IP_ADDR% ) | Set-NetIPInterface -InterfaceMetric %IFACE_METRIC%"
::powershell -Command "Get-NetIPAddress -IPAddress %IP_ADDR%"
::powershell -Command "Get-NetIPInterface -AssociatedIPAddress ( Get-NetIPAddress -IPAddress %IP_ADDR% )"
