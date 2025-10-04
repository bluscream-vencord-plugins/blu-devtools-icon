# Blu DevTools Icon

A Vencord user plugin that adds a DevTools icon next to the inbox icon in Discord's top navigation bar.

## Features

-   Adds a clickable DevTools icon in the top navigation area
-   Opens Discord's Developer Tools when clicked
-   Uses multiple fallback methods to ensure compatibility
-   Clean, minimal UI that fits Discord's design

## How it works

The plugin:

1. **Patches Discord's header bar** - Uses the same injection point as VencordToolbox
2. **Multiple DevTools opening methods**:
    - First tries `DiscordNative.window.toggleDevTools()`
    - Falls back to `window.webContents.openDevTools()`
    - Finally uses keyboard shortcut simulation (Ctrl+Alt+O)
3. **Visual feedback** - Shows selected state when DevTools are open
4. **Tooltip** - Displays "Open DevTools (Ctrl+Alt+O)" on hover

## Installation

1. Copy the `blu-devtools-icon` folder to your Vencord `src/userplugins` directory
2. Rebuild Vencord: `npm run build`
3. Restart Discord
4. Enable the plugin in Vencord settings

## Usage

Simply click the DevTools icon in the top navigation bar (next to the inbox icon) to open Discord's Developer Tools.

## Technical Details

-   **Component**: Uses `HeaderBarIcon` from Discord's webpack modules
-   **Styling**: Minimal CSS with Discord's CSS variables for theming
-   **Error Handling**: Wrapped in ErrorBoundary to prevent crashes
-   **Compatibility**: Works with both stable and development Discord builds

## Files

-   `index.tsx` - Main plugin code
-   `index.css` - Styling for the DevTools button
-   `package.json` - Plugin metadata
-   `README.md` - This documentation

## Author

Created by Bluscream
