 # 🎙️ cmdVoice - Windows Voice Assistant & Command Dispatcher

    [![Platform:
    Windows](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue.svg?logo=windows)](https://www.microso
    ft.com/windows)
    [![Node.js
    Version](https://img.shields.io/badge/Node.js-%3E%3D%2016.0.0-brightgreen.svg?logo=node.js)](https://nodejs.org/)
    [![Rhasspy
    Protocol](https://img.shields.io/badge/Rhasspy-Compatible%20API-orange.svg)](https://rhasspy.readthedocs.io/)
    [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

    **cmdVoice** is a lightweight, customizable Rhasspy-inspired voice assistant and desktop automation dispatcher
    built specifically for Windows 10 and Windows 11.

    It provides a modern real-time web dashboard with microphone audio visualizers, browser-based speech recognition
    (Web Speech API), deterministic offline intent parsing via `sentences.ini` grammar rules, and automated Windows
    desktop execution (launching apps, closing processes, navigating websites, controlling system media/volume, and
    checking system health).

    ---

    ## ✨ Features

    - 🎤 **Live Web Dashboard:** Browser-based microphone input with interactive audio waveform visualizer and
    real-time activity terminal.
    - 🧠 **Deterministic Offline NLU:** Rhasspy-compatible `sentences.ini` rule compiler with slot extraction and
    smart fallback matching.
    - 🚀 **Windows App Launcher:** Opens apps including Google Chrome, Brave Browser, Microsoft Edge, Notepad,
    Calculator, VS Code, Word, Excel, File Explorer, Task Manager, Settings, Spotify, VLC, and Windows Terminal.
    - 🌐 **Instant Website Navigation:** Speak `"Open Bing"`, `"Open YouTube"`, or `"Go to GitHub"` to navigate
    directly in your browser.
    - 🛑 **Process Closing:** Speak `"close Brave"`, `"quit Chrome"`, or `"close Notepad"` to safely terminate
    applications.
    - 💻 **Windows System Control:** Query CPU/Memory/Disk stats, set timers, control system volume (mute, volume
    up/down), and execute safe command presets (`whoami`, `hostname`, `ipconfig`).
    - ⚡ **Rhasspy-Compatible API & WebSockets:** REST endpoints (`/api/text-to-intent`, `/api/train`, `/api/intents`)
    and live WebSocket broadcasts.
    - 🛠️ **CLI Runner & 1-Click Launcher:** Includes `start.bat` for instant startup and `cmdVoice.js` for executing
    commands directly from PowerShell or Command Prompt.

    ---

    ## 📋 Requirements

    - **Operating System:** Windows 10 or Windows 11
    - **Node.js:** v16.0.0 or higher ([Download Node.js](https://nodejs.org/))
    - **Browser:** Google Chrome, Brave, or Microsoft Edge (Chromium-based browser recommended for the Web Speech API)

    ---

    ## 🚀 Quick Start

    ### 1. Clone the repository

    ```powershell
    git clone https://github.com/wastemytime0109/cmdVoice.git
    cd cmdVoice

  ### 2. Install dependencies

    npm install
  ### 3. Launch the Assistant
  Double-click start.bat (or run npm start in PowerShell / Command Prompt):
    npm start
  ### 4. Open the Web Dashboard
  Open your browser to:
    http://localhost:12101

  Click the microphone icon, allow microphone permissions, and speak!
  │ Note
  │ Keep the terminal window running in the background while using the assistant so the local server can execute
  │ desktop actions.
  ──────
  ## 🗣️ Voice Commands Cheatsheet
   Category         │ Example Spoken Commands                      │ Action Performed
  ──────────────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────────
   App Launching    │ "open chrome" / "open google chrome"         │ Launches Google Chrome with a new window
                    │ "open brave" / "open brave browser"          │ Launches Brave Browser
                    │ "open notepad"                               │ Opens Windows Notepad
                    │ "open calculator" / "open calc"              │ Opens Windows Calculator
                    │ "open vs code" / "start code"                │ Opens Visual Studio Code
                    │ "open file explorer"                         │ Opens Windows File Explorer
                    │ "open task manager"                          │ Opens Windows Task Manager
                    │ "open settings"                              │ Opens Windows Settings (ms-settings:)
   Closing Apps     │ "close brave" / "quit brave"                 │ Closes Brave Browser process
                    │ "close notepad"                              │ Closes Notepad
                    │ "close chrome"                               │ Closes Google Chrome
   Websites         │ "open bing"                                  │ Navigates to https://www.bing.com
                    │ "open youtube"                               │ Navigates to https://www.youtube.com
                    │ "go to github"                               │ Navigates to https://www.github.com
                    │ "open chatgpt" / "open reddit"               │ Opens ChatGPT / Reddit
   System Info      │ "check system status" / "check system stats" │ Reports Hostname, CPU, Free RAM & C: Drive space
                    │ "how much disk space is left"                │ Checks available drive storage
   Media & Volume   │ "turn volume up"                             │ Increases system master volume
                    │ "turn volume down"                           │ Lowers system master volume
                    │ "mute sound" / "unmute audio"                │ Toggles system audio mute
   Timers & Web     │ "set a timer for 5 minutes"                  │ Schedules a desktop popup notification
                    │ "search weather on web"                      │ Performs a Google search for query
   Safe Commands    │ "run whoami" / "run hostname"                │ Executes Windows preset commands
  ──────
  ## 💻 CLI Runner (PowerShell / Command Prompt)
  You can also test commands directly from the terminal without opening the browser:
    node cmdVoice.js "open notepad"
    node cmdVoice.js "open brave"
    node cmdVoice.js "open bing"
    node cmdVoice.js "close notepad"
    node cmdVoice.js "check system status"
    node cmdVoice.js "run hostname"
  ──────
  ## ⚙️ Customization

  ### Adding New Apps or Spoken Phrases

  1. Open sentences.ini and add your app name to the apps rule:
    [LaunchApp]
    apps = (chrome | edge | brave | notepad | calculator | myapp)
    open [the] <apps>{app}
    launch [the] <apps>{app}
    start <apps>{app}

  2. Register the executable name or path in src/intentHandler.js inside WINDOWS_APPS:
    'myapp': {
      label: 'My Application',
      command: 'myapp.exe',
      processName: 'myapp'
    }

  3. Save and reload either by restarting the server or clicking Train Engine in the web dashboard.
  ──────
  ## 🔌 Rhasspy REST API
  The server listens on port 12101 by default:
   Method               │ Endpoint            │ Description
  ──────────────────────┼─────────────────────┼───────────────────────────────────────────────────────────────────────
   POST                 │ /api/text-to-intent │ Parses text into intent slots and executes the mapped desktop action.
   POST                 │ /api/speech-to-text │ Accepts text or audio input buffer and broadcasts transcript.
   GET                  │ /api/intents        │ Returns the raw contents of sentences.ini.
   POST                 │ /api/intents        │ Updates sentences.ini and immediately recompiles the NLU engine.
   POST                 │ /api/train          │ Reloads rules and rebuilds intent grammar in memory.
   GET                  │ /api/health         │ Returns server health status and active port.
  ### Example API Request (PowerShell)

    Invoke-RestMethod `
      -Uri http://localhost:12101/api/text-to-intent `
      -Method Post `
      -ContentType "application/json" `
      -Body '{"text":"open notepad"}'
  ──────
  ## 📁 Repository Structure

    cmdVoice/
    ├── start.bat             # 1-click Windows server launcher
    ├── server.js             # Express & WebSocket backend (port 12101)
    ├── cmdVoice.js           # CLI terminal runner
    ├── app.js                # Frontend dashboard controller
    ├── index.html            # Web dashboard UI
    ├── style.css             # Cyberpunk/Rhasspy dashboard styling
    ├── sentences.ini         # NLU intent grammar definitions
    ├── package.json          # Node dependencies & start scripts
    ├── public/               # Static web assets fallback
    └── src/
        ├── intentHandler.js  # Windows action dispatcher (PowerShell / Win32)
        └── nlu.js            # Sentences.ini parser and slot extractor
  ──────
  ## ❓ Troubleshooting

  • Microphone not working / "Permission Denied": Ensure you are accessing http://localhost:12101 in Chrome, Edge, or
  Brave. Click the lock/settings icon on the left of the browser URL bar and allow Microphone access.
  • "Client-only mode cannot open desktop apps": This means the browser cannot connect to the backend. Make sure the
  Node.js server is running (npm start or double-click start.bat).
  • Port 12101 already in use: If port 12101 is occupied by an older process, run Get-Process -Name node | Stop-
  Process -Force in PowerShell, then start again.
  ──────
  ## 📄 License

  This project is licensed under the MIT License /LICENSE.
