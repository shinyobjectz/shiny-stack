# TOML → shadcn/ui Forms VSCode Extension

**Transform your TOML configuration files into beautiful, interactive shadcn/ui forms with automatic field detection, validation, and real-time editing.**

Perfect for editing OpenCode config files with a user-friendly interface!

## ✨ Features

- 🎨 **Beautiful shadcn/ui inspired forms** - Clean, modern interface that matches VS Code
- 🧠 **Smart field detection** - Automatically generates appropriate form controls based on data types
- 🔧 **Custom form layouts** - Special layouts for ai.config, styles.config, and architecture.config
- 📊 **Interactive components**:
  - 🎚️ Sliders for temperature and numeric ranges
  - 🔐 Password fields with show/hide toggle
  - 📝 Text areas for multi-line content
  - ☑️ Checkboxes for boolean values
  - 🎯 Dropdowns for predefined options
  - 📋 Dynamic arrays with add/remove buttons
- 💾 **Auto-save** - Saves changes after 5 seconds of inactivity
- ⌨️ **Keyboard shortcuts** - Ctrl+S to save, Esc to focus save button
- 🌓 **Theme aware** - Automatically adapts to VS Code light/dark themes
- ✅ **Form validation** - Real-time validation for URLs, emails, and required fields

## 🚀 Installation

### Option 1: From Source (Development)

1. **Clone/copy the extension to your development environment**
2. **Install dependencies:**
   ```bash
   cd extension/
   npm install
   ```

3. **Compile the extension:**
   ```bash
   npm run compile
   ```

4. **Install in VS Code:**
   - Press `F5` to open a new VS Code window with the extension loaded
   - Or package and install: `vsce package` then install the `.vsix` file

### Option 2: Package and Install

```bash
cd extension/
npm install -g vsce
vsce package
code --install-extension toml-shadcn-forms-0.1.0.vsix
```

## 🎯 Usage

### Automatic Activation

The extension automatically activates when you open `.config` or `.toml` files:

1. **Open any `.config` file** (like `ai.config`, `styles.config`)
2. **Click the edit icon** in the editor toolbar
3. **Beautiful form opens** with organized sections and appropriate controls

### Manual Activation

- **Command Palette:** `Ctrl+Shift+P` → "Open TOML Form Editor"
- **Right-click** any `.config` or `.toml` file → "Open TOML Form Editor"

### Keyboard Shortcuts

- **Ctrl+S / Cmd+S** - Save configuration
- **Esc** - Focus save button
- **Tab / Shift+Tab** - Navigate between fields

## 📋 Supported File Types

### Special Layouts

The extension provides custom layouts for:

- **`ai.config`** - AI models, agents, modes, MCP servers
- **`styles.config`** - Themes, keybindings, UI components
- **`architecture.config`** - Tech stack, deployment, patterns

### Generic Support

Works with **any TOML file** with automatic field detection:
- Strings → Text inputs
- Numbers → Number inputs or sliders
- Booleans → Checkboxes
- Arrays → Dynamic lists
- Objects → Collapsible sections

## 🎨 Field Types & Detection

| Data Type | Generated Component | Auto-Detection |
|-----------|-------------------|----------------|
| String | Text Input | Default |
| String (multiline) | Textarea | Contains `\n` or key contains "prompt"/"description" |
| String (password) | Password field | Key contains "password"/"secret"/"key" |
| String (email) | Email input | Key contains "email" |
| String (URL) | URL input | Key contains "url" or value starts with "http" |
| String (select) | Dropdown | Key matches known options (theme, provider, etc.) |
| Number | Number input | Default |
| Number (slider) | Range slider | Key contains "temperature"/"limit"/"coverage" |
| Boolean | Checkbox | Default |
| Array | Dynamic list | Default |
| Object | Collapsible section | Default |

## ⚙️ Configuration

### Extension Settings

```json
{
  "tomlForms.autoOpen": true,           // Auto-open form editor for .config files
  "tomlForms.theme": "auto",            // Theme: "light", "dark", "auto"
  "tomlForms.formWidth": "medium"       // Width: "narrow", "medium", "wide"
}
```

### Custom Field Options

The extension recognizes these patterns:

- **Sliders:** `temperature`, `limit`, `coverage`
- **Passwords:** `password`, `secret`, `apiKey`, `key`
- **Dropdowns:** `theme`, `provider`, `model`, `framework`
- **URLs:** `url`, `baseURL`, `endpoint`
- **Textareas:** `prompt`, `description`, multiline strings

## 🔧 Development

### Project Structure

```
extension/
├── src/
│   ├── extension.ts           # Main extension entry point
│   ├── TomlFormPanel.ts       # Webview panel management
│   └── TomlFormGenerator.ts   # Form generation logic
├── media/
│   ├── main.css              # shadcn/ui inspired styles
│   └── main.js               # Frontend form interactions
├── package.json              # Extension manifest
└── tsconfig.json            # TypeScript configuration
```

### Building

```bash
npm run compile    # Compile TypeScript
npm run watch      # Watch for changes
npm run lint       # Run ESLint
npm run test       # Run tests
```

### Extension API

The extension provides these commands:

- `tomlForms.openEditor` - Open form editor for current file
- `tomlForms.refreshEditor` - Refresh the form with latest file content

## 🎭 Theming

The extension uses CSS custom properties that automatically adapt to VS Code themes:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more shadcn/ui variables */
}

[data-vscode-theme-name*="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark theme overrides */
}
```

## 🐛 Troubleshooting

### Extension Not Loading
- Check VS Code version (requires 1.84.0+)
- Run `Developer: Reload Window` command

### Form Not Generating
- Ensure file has `.config` or `.toml` extension
- Check VS Code console for errors (Help → Toggle Developer Tools)

### Saving Issues
- Check file permissions
- Verify TOML syntax is valid

## 🚀 Perfect for OpenCode Configuration

This extension is **specifically designed** to work with your OpenCode config files:

- **ai.config** → Beautiful forms for AI models, agents, and modes
- **styles.config** → Easy editing of themes, keybindings, and UI components  
- **architecture.config** → Intuitive interface for tech stack preferences

Your OpenCode configuration editing just got **10x better**! 🎉

## 🤝 Contributing

Want to improve the extension? Here's how:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify for your projects!

---

**Built with ❤️ for the ShinyObjectz OpenCode configuration system**