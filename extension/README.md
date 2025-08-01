# SuperShiny - Config Editor Extension

A Visual Studio Code extension that provides a beautiful, interactive editor for TOML configuration files using modern React components and shadcn/ui.

## ✨ Features

- **TOML Config Parsing** - Automatically parses and displays TOML configuration files
- **Interactive Forms** - Edit config values with appropriate input types:
  - Text inputs for strings
  - Textareas for multi-line strings
  - Number inputs for numeric values
  - Switches for boolean values
  - Array inputs (comma-separated)
- **Tabbed Interface** - Separate tabs for each config file
- **Section Headers** - Proper markdown-style headers for sections and subsections
- **Comments Support** - Displays TOML comments as informational text
- **Real File Integration** - Loads actual config files from the VSCode workspace
- **Save Functionality** - Save changes back to files
- **Modern UI** - Beautiful shadcn-style components with Tailwind CSS

## 🚀 Getting Started

### Development Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Build the Extension**
   ```bash
   pnpm run compile
   ```

3. **Run in Development Mode**
   ```bash
   code --extensionDevelopmentPath=/path/to/extension
   ```

### Usage

1. Open a workspace with `.config` files
2. Click the SuperShiny icon in the activity bar
3. Edit your config files using the interactive forms
4. Click "Save" to persist changes

## 🏗️ Architecture

### Components

- **ConfigEditor** - Main component with tabs for different config files
- **ConfigSection** - Renders sections with proper headers and indentation
- **ConfigFormField** - Renders different field types based on data type
- **UI Components** - shadcn-style Button, Input, Textarea, Switch, Tabs, Label

### File Structure

```
src/
├── components/
│   ├── ui/           # shadcn UI components
│   ├── ConfigEditor.tsx
│   ├── ConfigSection.tsx
│   └── ConfigFormField.tsx
├── utils/
│   ├── tomlParser.ts # TOML parsing utilities
│   ├── configLoader.ts # File loading utilities
│   └── cn.ts        # Class name utilities
├── types/
│   └── config.ts    # TypeScript type definitions
└── main.tsx         # Main React application
```

## 🎨 Styling

The extension uses Tailwind CSS with custom VSCode theme integration:

- Automatically adapts to VSCode's color scheme
- Uses VSCode CSS variables for consistent theming
- Responsive design that works in the sidebar
- No background colors (following user preferences)

## 🔧 Configuration

The extension automatically detects and loads `.config` files from:
- Root workspace directory
- `src/configs/` directory
- Any subdirectory with `.config` files

## 📝 Supported Config Types

- **AI Configuration** (`ai.config`) - AI models, providers, agents, modes
- **Architecture Configuration** (`architecture.config`) - Tech stack preferences
- **OpenCode Configuration** (`opencode.config`) - Main configuration
- **Styles Configuration** (`styles.config`) - UI theming and preferences

## 🛠️ Development

### Build Commands

```bash
# Compile TypeScript and build React
pnpm run compile

# Watch for changes
pnpm run watch

# Package extension
pnpm run package

# Install extension
pnpm run install-extension
```

### Adding New Config Types

1. Add your config file to the workspace
2. The extension will automatically detect and parse it
3. Customize field rendering in `ConfigFormField.tsx` if needed

## 🎯 Key Features

- **Real-time Parsing** - Changes are parsed and validated immediately
- **Type Safety** - Full TypeScript support throughout
- **Accessibility** - Proper ARIA labels and keyboard navigation
- **Performance** - Efficient rendering with React optimization
- **Extensibility** - Easy to add new field types and config formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details