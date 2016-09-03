#NoTrayIcon

connection=%1%

SplitPath, A_ScriptName,,,, scriptNameNoExt
inifile := scriptNameNoExt ".ini"
IniRead, username, %inifile%, %connection%, Username
IniRead, password, %inifile%, %connection%, Password

SetTitleMatchMode, 3

WinWait, % "VPN Connect - " connection " ahk_class SHREWSOFT_CON ahk_exe ipsecc.exe"
WinGet, ipsecc_hwnd, ID
ControlGet, connect_hwnd, hwnd,, Connect, ahk_id %ipsecc_hwnd%
if ( connect_hwnd )
{
    ControlSetText, Edit1, %username%, ahk_id %ipsecc_hwnd%
    ControlSetText, Edit2, %password%, ahk_id %ipsecc_hwnd%
    ControlClick, Connect, ahk_id %ipsecc_hwnd%
    ExitApp, 0
}
else
{
    WinMinimize, ahk_id %ipsecc_hwnd%
    ExitApp, 1
}
