[Setup]
AppName=ArcWord
AppVersion=1.0.0
AppPublisher=Sebastian Rubaj
DefaultDirName={autopf}\ArcWord
DefaultGroupName=ArcWord
OutputDir=installer
OutputBaseFilename=ArcWord-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
DisableProgramGroupPage=yes

[Languages]
Name: "polish"; MessagesFile: "compiler:Languages\Polish.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "build-exe\ArcWord-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\ArcWord"; Filename: "{app}\ArcWord.exe"
Name: "{autodesktop}\ArcWord"; Filename: "{app}\ArcWord.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\ArcWord.exe"; Description: "{cm:LaunchProgram,ArcWord}"; Flags: nowait postinstall skipifsilent
