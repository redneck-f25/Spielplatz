#NoTrayIcon

connection=%1%

if ( !connection )
{
    MsgBox, Usage: %A_ScriptName% <CONNECTION>
    ExitApp
}

SplitPath, A_ScriptName,,,, scriptNameNoExt
inifile := scriptNameNoExt ".ini"
IniRead, username, %inifile%, %1%, Username
IniRead, password, %inifile%, %1%, Password

SetTitleMatchMode, 3

WinWait, VPN Connect - %1% ahk_class SHREWSOFT_CON ahk_exe ipsecc.exe
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
