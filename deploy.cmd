cmd /c "npm run test"
xcopy web.config .\dist\ /Y
robocopy .\dist\ \\192.168.125.230\extop_web /MIR
