# 🚀 Development Workflow

Quick reference for developing the TOML Forms extension.

## ⚡ Available Commands

| Command | What It Does | When To Use |
|---------|-------------|-------------|
| `npm run dev-update` | **Compile + Package + Install + Instructions** | Main development workflow |
| `npm run dev-f5` | **Compile + F5 reminder** | Quick testing with Extension Development Host |
| `npm run dev` | **Watch mode** (auto-compile on save) | During active coding |
| `npm run quick` | **Compile + Package** (no install) | Just want the .vsix file |

## 🎯 Recommended Workflows

### **Option 1: F5 Development (Fastest)**
```bash
npm run dev-f5
# Press F5 in Cursor → Extension Development Host opens
# Test your changes immediately
```

### **Option 2: Full Install (Most Realistic)**
```bash
npm run dev-update
# Alt+Tab to your main Cursor window
# Press Ctrl+R to reload
# Extension is now updated in your main IDE
```

### **Option 3: Continuous Development**
```bash
npm run dev        # Start watch mode (leave running)
# Make changes...   # Auto-compiles on save
npm run dev-update # When ready to test
```

## 🔄 Reload Methods

After running `npm run dev-update`:

1. **Keyboard Shortcut**: `Ctrl+R` (fastest)
2. **Command Palette**: `Ctrl+Shift+P` → "Developer: Reload Window"
3. **Menu**: View → Command Palette... → "Developer: Reload Window"

## 🛠️ Troubleshooting

**Extension not updating?**
- Make sure you reloaded Cursor with `Ctrl+R`
- Check if extension is installed: Extensions panel → Search "TOML"

**Compilation errors?**
- Check terminal output from `npm run dev-update`
- Fix TypeScript errors in `/src` files

**Package warnings?**
- All warnings are automatically suppressed in dev builds
- For production: `npm run package` (shows warnings)

## 📁 Key Files

- `src/` - TypeScript source files
- `out/` - Compiled JavaScript (auto-generated)
- `media/` - CSS and JS for webview
- `syntaxes/` - TOML syntax highlighting
- `*.vsix` - Extension package files

## 🎉 Development Tips

1. **Keep watch running**: `npm run dev` in a terminal
2. **Use F5 for quick tests**: Faster than full install
3. **Ctrl+R is your friend**: Quick reload without restart
4. **Alt+Tab**: Switch between Extension Host and main Cursor
5. **Problems panel**: Shows TOML syntax errors instantly

---

**Happy coding!** 🎯 Your TOML editing experience is about to get amazing!