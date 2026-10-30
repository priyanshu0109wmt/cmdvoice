# cmdVoice - Windows Voice Assistant

cmdVoice is a lightweight Rhasspy-inspired voice assistant and command dispatcher for Windows. It provides a local web dashboard, browser speech recognition, a custom `sentences.ini` intent grammar, a Node.js backend, and Windows desktop action execution.

## Features

- Browser microphone input with Web Speech API.
- Rhasspy-compatible REST endpoints and WebSocket updates.
- Editable `sentences.ini` rules from the dashboard.
- Windows app launching by voice, including Notepad, Calculator, File Explorer, Chrome, Edge, VS Code, Word, Excel, PowerPoint, Settings, Task Manager, Spotify, and VLC.
- Windows system status, web search, timers, safe command presets, and basic media keys.
- CLI runner for testing commands directly from PowerShell or Command Prompt.

## Requirements

- Windows 10 or Windows 11.
- Node.js 16 or newer.
- A Chromium-based browser is recommended for speech recognition.
- Apps must be installed and available from the Windows PATH or app URI for voice launching to work. Built-in Windows apps such as Notepad, Calculator, File Explorer, Settings, and Task Manager work out of the box.

## Install

```powershell
npm install
```

## Start The Dashboard

```powershell
npm start
```

Open:

```text
http://localhost:12101
```

Click the microphone and speak commands such as:

```text
open notepad
open calculator
open file explorer
open chrome
open vs code
check system status
turn volume up
search weather on web
set timer for 5 minutes
```

Desktop actions only run when the local Node server is running. If the page is opened without the server, the browser can parse speech but cannot open Windows applications.

## CLI Usage

```powershell
node cmdVoice.js "open notepad"
node cmdVoice.js "open calculator"
node cmdVoice.js "open file explorer"
node cmdVoice.js "check system status"
node cmdVoice.js "run hostname"
```

## API

The server listens on port `12101` by default.

```powershell
Invoke-RestMethod `
  -Uri http://localhost:12101/api/text-to-intent `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"text":"open notepad"}'
```

Main endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/text-to-intent` | Parse text into an intent and execute the mapped action. |
| `POST` | `/api/speech-to-text` | Accept a text/audio-style payload and return recognized text. |
| `GET` | `/api/intents` | Read the active `sentences.ini` grammar. |
| `POST` | `/api/intents` | Save grammar edits and reload the NLU engine. |
| `POST` | `/api/train` | Reload `sentences.ini`. |
| `GET` | `/api/health` | Check server status. |

## Customizing Apps

Edit `sentences.ini` to add spoken app names:

```ini
[LaunchApp]
apps = (chrome | edge | notepad | calculator | file explorer | vs code)
open [the] <apps>{app}
launch [the] <apps>{app}
start <apps>{app}
```

Then add the Windows command alias in `src/intentHandler.js` inside `WINDOWS_APPS`:

```js
'my app': { label: 'My App', command: 'myapp' }
```

Use a `uri` entry for Windows URI schemes:

```js
settings: { label: 'Windows Settings', uri: 'ms-settings:' }
```

## Project Structure

```text
cmdVoice/
├── app.js
├── cmdVoice.js
├── index.html
├── package.json
├── public/
├── sentences.ini
├── server.js
├── src/
│   ├── intentHandler.js
│   └── nlu.js
└── style.css
```
