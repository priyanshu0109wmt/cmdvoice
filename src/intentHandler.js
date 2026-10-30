const { exec, execFile } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

const WINDOWS_APPS = {
  chrome: { label: 'Google Chrome', command: 'chrome.exe', processName: 'chrome', args: '--new-window' },
  'google chrome': { label: 'Google Chrome', command: 'chrome.exe', processName: 'chrome', args: '--new-window' },
  edge: { label: 'Microsoft Edge', command: 'msedge.exe', processName: 'msedge', args: '--new-window' },
  'microsoft edge': { label: 'Microsoft Edge', command: 'msedge.exe', processName: 'msedge', args: '--new-window' },
  firefox: { label: 'Mozilla Firefox', command: 'firefox.exe', processName: 'firefox', args: '-new-window' },
  'mozilla firefox': { label: 'Mozilla Firefox', command: 'firefox.exe', processName: 'firefox', args: '-new-window' },
  brave: { label: 'Brave Browser', command: 'brave.exe', processName: 'brave', args: '--new-window' },
  'brave browser': { label: 'Brave Browser', command: 'brave.exe', processName: 'brave', args: '--new-window' },
  browser: { label: 'Brave Browser', command: 'brave.exe', processName: 'brave', args: '--new-window' },
  'web browser': { label: 'Brave Browser', command: 'brave.exe', processName: 'brave', args: '--new-window' },
  explorer: { label: 'File Explorer', command: 'explorer.exe', processName: 'explorer' },
  'file explorer': { label: 'File Explorer', command: 'explorer.exe', processName: 'explorer' },
  files: { label: 'File Explorer', command: 'explorer.exe', processName: 'explorer' },
  notepad: { label: 'Notepad', command: 'notepad.exe', processName: 'notepad' },
  calculator: { label: 'Calculator', command: 'calc.exe', processName: 'CalculatorApp' },
  calc: { label: 'Calculator', command: 'calc.exe', processName: 'CalculatorApp' },
  paint: { label: 'Paint', command: 'mspaint.exe', processName: 'mspaint' },
  terminal: { label: 'Windows Terminal', command: 'wt.exe', processName: 'WindowsTerminal' },
  'windows terminal': { label: 'Windows Terminal', command: 'wt.exe', processName: 'WindowsTerminal' },
  cmd: { label: 'Command Prompt', command: 'cmd.exe', processName: 'cmd' },
  'command prompt': { label: 'Command Prompt', command: 'cmd.exe', processName: 'cmd' },
  powershell: { label: 'PowerShell', command: 'powershell.exe', processName: 'powershell' },
  settings: { label: 'Windows Settings', uri: 'ms-settings:', processName: 'SystemSettings' },
  'control panel': { label: 'Control Panel', command: 'control.exe', processName: 'control' },
  taskmanager: { label: 'Task Manager', command: 'taskmgr.exe', processName: 'Taskmgr' },
  'task manager': { label: 'Task Manager', command: 'taskmgr.exe', processName: 'Taskmgr' },
  spotify: { label: 'Spotify', command: 'spotify.exe', processName: 'Spotify' },
  vlc: { label: 'VLC Media Player', command: 'vlc.exe', processName: 'vlc' },
  'vlc media player': { label: 'VLC Media Player', command: 'vlc.exe', processName: 'vlc' },
  vscode: { label: 'Visual Studio Code', command: 'code.exe', processName: 'Code' },
  'vs code': { label: 'Visual Studio Code', command: 'code.exe', processName: 'Code' },
  'visual studio code': { label: 'Visual Studio Code', command: 'code.exe', processName: 'Code' },
  word: { label: 'Microsoft Word', command: 'winword.exe', processName: 'WINWORD' },
  'microsoft word': { label: 'Microsoft Word', command: 'winword.exe', processName: 'WINWORD' },
  excel: { label: 'Microsoft Excel', command: 'excel.exe', processName: 'EXCEL' },
  'microsoft excel': { label: 'Microsoft Excel', command: 'excel.exe', processName: 'EXCEL' },
  powerpoint: { label: 'Microsoft PowerPoint', command: 'powerpnt.exe', processName: 'POWERPNT' },
  'microsoft powerpoint': { label: 'Microsoft PowerPoint', command: 'powerpnt.exe', processName: 'POWERPNT' },
  outlook: { label: 'Microsoft Outlook', command: 'outlook.exe', processName: 'OUTLOOK' },
  'microsoft outlook': { label: 'Microsoft Outlook', command: 'outlook.exe', processName: 'OUTLOOK' },
  teams: { label: 'Microsoft Teams', command: 'ms-teams.exe', processName: 'ms-teams' },
  'microsoft teams': { label: 'Microsoft Teams', command: 'ms-teams.exe', processName: 'ms-teams' },
  camera: { label: 'Camera', uri: 'microsoft.windows.camera:', processName: 'WindowsCamera' },
  store: { label: 'Microsoft Store', uri: 'ms-windows-store:', processName: 'WinStore.App' },
  'microsoft store': { label: 'Microsoft Store', uri: 'ms-windows-store:', processName: 'WinStore.App' }
};

const WEBSITES = {
  bing: 'https://www.bing.com',
  google: 'https://www.google.com',
  youtube: 'https://www.youtube.com',
  github: 'https://www.github.com',
  reddit: 'https://www.reddit.com',
  twitter: 'https://www.twitter.com',
  x: 'https://www.x.com',
  chatgpt: 'https://chat.openai.com',
  gmail: 'https://mail.google.com',
  wikipedia: 'https://www.wikipedia.org',
  amazon: 'https://www.amazon.com',
  netflix: 'https://www.netflix.com'
};

const WINDOWS_SAFE_COMMANDS = {
  dir: 'dir',
  cd: 'cd',
  whoami: 'whoami',
  date: 'date /t',
  time: 'time /t',
  hostname: 'hostname',
  ver: 'ver',
  ipconfig: 'ipconfig'
};

class IntentHandler {
  async handle(nluResult) {
    const { intent, slots, text } = nluResult;
    const intentName = intent.name;

    let responseText = `Executed intent ${intentName}.`;
    let actionLog = '';
    let status = 'success';

    switch (intentName) {
      case 'LaunchApp': {
        const rawApp = (slots.app || 'notepad').trim();
        const appInfo = this.resolveWindowsApp(rawApp);
        actionLog = `Opening Windows application: ${appInfo.label}`;
        responseText = `Launching ${appInfo.label} now.`;
        try {
          await this.launchWindowsApp(appInfo);
          actionLog = `Launch request sent to Windows: ${appInfo.label}`;
        } catch (e) {
          status = 'error';
          responseText = `I could not launch ${appInfo.label}.`;
          actionLog += ` (Error: ${e.message})`;
        }
        break;
      }

      case 'CloseApp': {
        const rawApp = (slots.app || 'notepad').trim();
        const appInfo = this.resolveWindowsApp(rawApp);
        actionLog = `Closing Windows application: ${appInfo.label}`;
        responseText = `Closing ${appInfo.label} now.`;
        try {
          await this.closeWindowsApp(appInfo);
          actionLog = `Closed application: ${appInfo.label}`;
        } catch (e) {
          status = 'warning';
          responseText = `Could not close ${appInfo.label} (it may not be running).`;
          actionLog += ` (Notice: ${e.message})`;
        }
        break;
      }

      case 'OpenWebsite': {
        const rawSite = (slots.site || 'google').toLowerCase().trim();
        const url = WEBSITES[rawSite] || `https://www.${rawSite}.com`;
        actionLog = `Opening website: ${url}`;
        responseText = `Opening ${this.toTitleCase(rawSite)} in your browser now.`;
        try {
          await this.openUrl(url);
          actionLog = `Opened website in browser: ${url}`;
        } catch (e) {
          status = 'error';
          responseText = `Could not open website ${rawSite}.`;
          actionLog += ` (Error: ${e.message})`;
        }
        break;
      }

      case 'SystemStatus': {
        actionLog = 'Fetching Windows system stats...';
        try {
          const sysInfo = await this.getWindowsSystemStatus();
          actionLog = `System Stats:\n${sysInfo}`;
          responseText = `Windows system health report ready.`;
        } catch (e) {
          responseText = `Could not retrieve system stats.`;
          actionLog = e.message;
        }
        break;
      }

      case 'MediaControl': {
        const action = (slots.action || 'volume up').toLowerCase();
        if (action.includes('up')) {
          this.sendMediaKey('volumeup');
          responseText = `Volume turned up.`;
        } else if (action.includes('down')) {
          this.sendMediaKey('volumedown');
          responseText = `Volume turned down.`;
        } else if (action.includes('mute')) {
          this.sendMediaKey('volumemute');
          responseText = action.includes('unmute') ? `Audio mute toggled off.` : `Audio mute toggled.`;
        } else if (action.includes('play') || action.includes('pause')) {
          this.sendMediaKey('playpause');
          responseText = `Media playback toggled.`;
        } else if (action.includes('next')) {
          this.sendMediaKey('nexttrack');
          responseText = `Skipped to next track.`;
        } else if (action.includes('previous')) {
          this.sendMediaKey('prevtrack');
          responseText = `Returned to previous track.`;
        } else {
          responseText = `Media control action ${action} triggered.`;
        }
        actionLog = `Media Action executed: ${action}`;
        break;
      }

      case 'SetTimer': {
        const minutes = parseInt(slots.minutes || '5', 10);
        responseText = `Timer set for ${minutes} minute${minutes > 1 ? 's' : ''}.`;
        actionLog = `Timer scheduled for ${minutes} min(s).`;
        setTimeout(() => {
          this.showWindowsNotification('cmdVoice Timer', 'Timer Finished!');
        }, minutes * 60 * 1000);
        break;
      }

      case 'SearchWeb': {
        const query = slots.query || 'rhasspy voice assistant';
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        this.openUrl(url);
        responseText = `Searching the web for ${query}.`;
        actionLog = `Opened search URL: ${url}`;
        break;
      }

      case 'RunCommand': {
        const cmd = (slots.command || 'dir').toLowerCase();
        const commandToRun = WINDOWS_SAFE_COMMANDS[cmd];
        if (commandToRun) {
          try {
            const output = await this.execPromise(commandToRun);
            actionLog = `Ran command '${cmd}':\n${output.trim()}`;
            responseText = `Command ${cmd} executed successfully.`;
          } catch (e) {
            actionLog = `Command error: ${e.message}`;
            responseText = `Failed to run command ${cmd}.`;
          }
        } else {
          actionLog = `Command '${cmd}' blocked for security reasons. Allowed: ${Object.keys(WINDOWS_SAFE_COMMANDS).join(', ')}`;
          responseText = `Command execution restricted to safe presets.`;
        }
        break;
      }

      case 'GetWeather': {
        responseText = `It's currently clear and pleasant outside. 22 degrees Celsius.`;
        actionLog = `Fetched weather information from simulated weather service.`;
        break;
      }

      default: {
        responseText = `I recognized your intent as ${intentName}, but no handler action is mapped yet.`;
        actionLog = `Unmapped intent: ${intentName} with query "${text}"`;
        status = 'warning';
        break;
      }
    }

    return {
      intent: intentName,
      slots,
      responseText,
      actionLog,
      status,
      timestamp: new Date().toISOString()
    };
  }

  execPromise(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout || stderr);
      });
    });
  }

  resolveWindowsApp(rawApp) {
    const normalized = rawApp.toLowerCase().replace(/\s+/g, ' ').trim();
    const knownApp = WINDOWS_APPS[normalized];
    if (knownApp) return knownApp;

    if (!/^[a-z0-9 ._-]+$/i.test(rawApp)) {
      throw new Error('Application name contains unsafe characters.');
    }

    return {
      label: this.toTitleCase(rawApp),
      command: rawApp
    };
  }

  resolveAppPath(command) {
    if (!command) return command;
    if (path.isAbsolute(command) && fs.existsSync(command)) {
      return command;
    }

    const localAppData = process.env.LOCALAPPDATA || '';
    const programFiles = process.env.ProgramFiles || 'C:\\Program Files';
    const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

    const knownPaths = {
      brave: [
        path.join(localAppData, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
        path.join(programFiles, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe')
      ],
      'brave.exe': [
        path.join(localAppData, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
        path.join(programFiles, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe')
      ],
      chrome: [
        path.join(programFiles, 'Google\\Chrome\\Application\\chrome.exe'),
        path.join(programFilesX86, 'Google\\Chrome\\Application\\chrome.exe'),
        path.join(localAppData, 'Google\\Chrome\\Application\\chrome.exe')
      ],
      'chrome.exe': [
        path.join(programFiles, 'Google\\Chrome\\Application\\chrome.exe'),
        path.join(programFilesX86, 'Google\\Chrome\\Application\\chrome.exe'),
        path.join(localAppData, 'Google\\Chrome\\Application\\chrome.exe')
      ],
      msedge: [
        path.join(programFilesX86, 'Microsoft\\Edge\\Application\\msedge.exe'),
        path.join(programFiles, 'Microsoft\\Edge\\Application\\msedge.exe')
      ],
      'msedge.exe': [
        path.join(programFilesX86, 'Microsoft\\Edge\\Application\\msedge.exe'),
        path.join(programFiles, 'Microsoft\\Edge\\Application\\msedge.exe')
      ],
      code: [
        path.join(localAppData, 'Programs\\Microsoft VS Code\\Code.exe'),
        path.join(programFiles, 'Microsoft VS Code\\Code.exe')
      ],
      'code.exe': [
        path.join(localAppData, 'Programs\\Microsoft VS Code\\Code.exe'),
        path.join(programFiles, 'Microsoft VS Code\\Code.exe')
      ]
    };

    const candidates = knownPaths[command.toLowerCase()];
    if (candidates) {
      for (const p of candidates) {
        if (fs.existsSync(p)) return p;
      }
    }
    return command;
  }

  async launchWindowsApp(appInfo) {
    if (process.platform !== 'win32') {
      throw new Error(`This command is configured for Windows, but the current platform is ${process.platform}.`);
    }

    const rawTarget = appInfo.uri || appInfo.command;
    const target = appInfo.uri ? appInfo.uri : this.resolveAppPath(rawTarget);
    const args = appInfo.args || '';

    try {
      return await this.openWithPowerShellStart(target, args);
    } catch (powerShellError) {
      try {
        return await this.openWithWindowsStart(target, args);
      } catch (startError) {
        throw new Error(`${powerShellError.message}; fallback failed: ${startError.message}`);
      }
    }
  }

  async closeWindowsApp(appInfo) {
    if (process.platform !== 'win32') {
      throw new Error(`This command is configured for Windows, but the current platform is ${process.platform}.`);
    }

    const procName = appInfo.processName || appInfo.command.replace(/\.exe$/i, '');
    const escapedProc = procName.replace(/'/g, "''");
    const cmd = `Stop-Process -Name '${escapedProc}' -Force -ErrorAction Stop`;

    return this.execFilePromise('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      cmd
    ], {
      windowsHide: false
    });
  }

  openUrl(url) {
    if (process.platform === 'win32') {
      // Prefer modern browsers if found, or fall back to system default handler
      const bravePath = this.resolveAppPath('brave.exe');
      const chromePath = this.resolveAppPath('chrome.exe');
      const browserPath = (fs.existsSync(bravePath) && bravePath) || (fs.existsSync(chromePath) && chromePath);

      if (browserPath && browserPath.endsWith('.exe')) {
        return this.openWithPowerShellStart(browserPath, `--new-window "${url}"`).catch(() => {
          return this.openWithPowerShellStart(url);
        });
      }
      return this.openWithPowerShellStart(url);
    }
    throw new Error(`Web search opening is configured for Windows, but the current platform is ${process.platform}.`);
  }

  openWithWindowsStart(target, args = '') {
    return new Promise((resolve, reject) => {
      const fullCmd = args ? `start "" "${target}" ${args}` : `start "" "${target}"`;
      exec(fullCmd, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout || stderr);
      });
    });
  }

  openWithPowerShellStart(target, args = '') {
    const escapedTarget = target.replace(/'/g, "''");
    let cmd = `Start-Process -FilePath '${escapedTarget}'`;
    if (args) {
      const escapedArgs = args.replace(/'/g, "''");
      cmd += ` -ArgumentList '${escapedArgs}'`;
    }
    return this.execFilePromise('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy',
      'Bypass',
      '-Command',
      cmd
    ], {
      windowsHide: false
    });
  }

  async getWindowsSystemStatus() {
    const totalMemoryGb = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMemoryGb = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const uptimeMinutes = Math.round(os.uptime() / 60);
    const lines = [
      `Platform: ${os.type()} ${os.release()}`,
      `Host: ${os.hostname()}`,
      `CPU: ${os.cpus()[0] ? os.cpus()[0].model : 'Unknown'}`,
      `Memory: ${freeMemoryGb} GB free of ${totalMemoryGb} GB`,
      `Uptime: ${uptimeMinutes} minutes`
    ];

    if (process.platform === 'win32') {
      try {
        const diskInfo = await this.execFilePromise('powershell.exe', [
          '-NoProfile',
          '-Command',
          "$d = [System.IO.DriveInfo]::GetDrives() | Where-Object { $_.Name -eq 'C:\\' }; 'Drive C: ' + ([math]::Round($d.AvailableFreeSpace / 1GB, 2)) + ' GB free of ' + ([math]::Round($d.TotalSize / 1GB, 2)) + ' GB'"
        ]);
        lines.push(diskInfo.trim());
      } catch (e) {
        lines.push('Drive C: unavailable');
      }
    }

    return lines.join('\n');
  }

  sendMediaKey(key) {
    if (process.platform !== 'win32') {
      throw new Error(`Media controls are configured for Windows, but the current platform is ${process.platform}.`);
    }

    const keyMap = {
      volumeup: 0xAF,
      volumedown: 0xAE,
      volumemute: 0xAD,
      playpause: 0xB3,
      nexttrack: 0xB0,
      prevtrack: 0xB1
    };
    const code = keyMap[key];
    if (!code) throw new Error(`Unsupported media key: ${key}`);

    const ps = `$ws = New-Object -ComObject WScript.Shell; $ws.SendKeys([char]${code})`;
    execFile('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], {
      windowsHide: true
    });
  }

  showWindowsNotification(title, message) {
    if (process.platform !== 'win32') return;
    const ps = [
      'Add-Type -AssemblyName System.Windows.Forms',
      `$n = New-Object System.Windows.Forms.NotifyIcon`,
      `$n.Icon = [System.Drawing.SystemIcons]::Information`,
      `$n.BalloonTipTitle = ${JSON.stringify(title)}`,
      `$n.BalloonTipText = ${JSON.stringify(message)}`,
      `$n.Visible = $true`,
      `$n.ShowBalloonTip(5000)`,
      'Start-Sleep -Seconds 6',
      '$n.Dispose()'
    ].join('; ');

    execFile('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', ps], {
      windowsHide: true
    });
  }

  toTitleCase(value) {
    return value
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  execFilePromise(file, args, options = {}) {
    return new Promise((resolve, reject) => {
      execFile(file, args, { windowsHide: true, ...options }, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(stdout || stderr);
      });
    });
  }
}

module.exports = IntentHandler;
