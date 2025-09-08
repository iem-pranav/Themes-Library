THEMES LIBRARY — README

[Live](https://iem-pranav.github.io/Themes-Library/themes.html)
---------

Overview:
---------
The 'themes' library is a lightweight, drop-in JavaScript tool to add
vibrant, user-switchable themes to any web page. It provides a floating
collapsible UI for selecting themes, a random theme button, automatic
shuffle mode, and a help popup. Themes persist using localStorage.

Features:
---------
1. Floating 🎨 button to toggle theme panel.
2. Theme buttons (Vibrant, Techy, Energetic, Cosmic) to apply background
   gradients and text colors.
3. Random theme picker (🎲) to instantly choose a theme.
4. Shuffle mode (🔁) for automatic theme rotation with user-defined interval.
5. Ctrl+H keyboard shortcut to open a help popup explaining usage.
6. LocalStorage persistence for selected theme and shuffle mode.
7. Easy-to-use API exposed via `window.themesSwitcher`:
   - `themesSwitcher.initThemeSwitcher()` — manually initialize UI
   - `themesSwitcher.setTheme(name)` — apply a specific theme
   - `themesSwitcher.startShuffle(sec)` — start auto-rotation
   - `themesSwitcher.stopShuffle()` — stop auto-rotation
   - `themesSwitcher.toggleShuffle()` — toggle shuffle on/off
   - `themesSwitcher.randomTheme()` — get random theme name
   - `themesSwitcher.getCurrentTheme()` — returns current theme
   - `themesSwitcher.isShuffleActive()` — returns true if shuffle is active

Installation:
-------------
1. Include the CSS and JS files in your project:

   <link rel="stylesheet" href="styles/themes.css" />
   <script src="scripts/themes.js"></script>

2. The library auto-initializes on page load. You can also manually
   initialize via:
   `window.themesSwitcher.initThemeSwitcher();`

Usage:
------
- Click the floating 🎨 icon to open the theme panel.
- Click any theme button to apply it.
- Click 🎲 to select a random theme.
- Click 🔁 to enable shuffle mode (default 18 seconds).
- Press Ctrl+H to see the help popup.
- Theme selection and shuffle state persist automatically across page reloads.

Custom Themes:
--------------
- Add or modify themes in `themes.js` under the `THEMES` object.
- Each theme must define:
  - `name` — display name
  - `--bg-gradient` — background CSS gradient
  - `--text-color` — main text color
  - `--btn-bg` — button background color

Notes:
------
- The library applies themes globally using CSS variables (`:root`) so
  it will work with any page content.
- Designed to be minimal, responsive, and easy to integrate.

Author:
-------
Pranav Khairnar
