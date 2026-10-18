[Setup]
AppName=ArcWord
AppVersion=1.0.3
AppPublisher=Sebastian Rubaj
DefaultDirName={autopf}\ArcWord
DefaultGroupName=ArcWord
OutputDir=installer
OutputBaseFilename=ArcWord-Setup
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=lowest
DisableProgramGroupPage=yes
CloseApplications=yes
DiskSpanning=yes

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
Filename: "{app}\ArcWord.exe"; Description: "{cm:LaunchProgram,ArcWord}"; Flags: nowait postinstall

[Registry]
Root: HKCU; Subkey: "Software\ArcWord"; ValueType: string; ValueName: "UserName"; ValueData: "{code:GetCustomUserName}"; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\Classes\.docx\OpenWithProgids"; ValueType: string; ValueName: "ArcWord.Document"; ValueData: ""; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Classes\ArcWord.Document"; ValueType: string; ValueName: ""; ValueData: "Dokument programu ArcWord"; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\Classes\ArcWord.Document\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\ArcWord.exe,0"
Root: HKCU; Subkey: "Software\Classes\ArcWord.Document\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\ArcWord.exe"" ""%1"""

[Code]
var
  UserPage: TInputQueryWizardPage;
  IsUpgradeInstall: Boolean;

function IsAppAlreadyInstalled(): Boolean;
var
  InstalledVer: String;
  PrevPath: String;
begin
  Result := RegQueryStringValue(HKCU, 'Software\ArcWord', 'InstalledVersion', InstalledVer) or
            RegQueryStringValue(HKCU, 'Software\ArcWord', 'InstallPath', PrevPath) or
            FileExists(ExpandConstant('{autopf}\ArcWord\ArcWord.exe'));
end;

function InitializeSetup(): Boolean;
begin
  IsUpgradeInstall := IsAppAlreadyInstalled();
  Result := True;
end;

procedure InitializeWizard();
begin
  if not IsUpgradeInstall and not WizardSilent() then
  begin
    UserPage := CreateInputQueryPage(wpWelcome,
      'Personalizacja profilu użytkownika',
      'Jak masz na imię?',
      'Podaj swoje imię lub pseudonim, który będzie widoczny w programie ArcWord:');
    UserPage.Add('Twoja nazwa / imię:', False);
    UserPage.Values[0] := GetUserNameString();
  end;
end;

function GetCustomUserName(Param: String): String;
var
  ExistingVal: String;
begin
  if Assigned(UserPage) and (UserPage.Values[0] <> '') then
    Result := UserPage.Values[0]
  else if RegQueryStringValue(HKCU, 'Software\ArcWord', 'UserName', ExistingVal) and (ExistingVal <> '') then
    Result := ExistingVal
  else
    Result := GetUserNameString();
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  FinalName: String;
  ConfigPath: String;
  JsonContent: String;
begin
  if CurStep = ssPostInstall then
  begin
    FinalName := GetCustomUserName('');
    RegWriteStringValue(HKCU, 'Software\ArcWord', 'InstalledVersion', '1.0.3');
    RegWriteStringValue(HKCU, 'Software\ArcWord', 'InstallPath', ExpandConstant('{app}'));
    RegWriteStringValue(HKCU, 'Software\ArcWord', 'UserName', FinalName);

    ConfigPath := ExpandConstant('{app}\user_config.json');
    JsonContent := '{"userName":"' + FinalName + '"}';
    SaveStringToFile(ConfigPath, JsonContent, False);
  end;
end;
