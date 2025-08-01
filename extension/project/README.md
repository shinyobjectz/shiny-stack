# ShinyStack - Modern Full-Stack Application Template

A modern full-stack application template built with React, Convex, and TypeScript, featuring the **SuperShiny configuration system** for seamless development and deployment.

## ✨ Features

- **🚀 Modern Stack**: React + Vite + TypeScript + Tailwind CSS
- **⚡ Serverless Backend**: Convex for database and backend functions
- **🎨 SuperShiny Config**: TOML-based configuration system with VSCode integration
- **🔐 Authentication**: Built-in Convex Auth with anonymous sign-in
- **📱 Responsive Design**: Mobile-first responsive components
- **🎯 Type Safety**: Full TypeScript support throughout
- **⚙️ Real-time Config**: Edit configuration files in VSCode with live preview

## 🏗️ Architecture

```
ShinyStack/
├── src/
│   ├── config/           # SuperShiny configuration files
│   │   ├── ai.config     # AI/ML configuration
│   │   ├── architecture.config  # System architecture settings
│   │   ├── opencode.config      # Open source/code settings
│   │   ├── styles.config        # UI/UX styling configuration
│   │   └── glossary.shiny       # Custom definitions and enums
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-specific components
│   ├── lib/             # Utility functions and helpers
│   └── App.tsx          # Main application component
├── convex/              # Convex backend functions
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **Configure with SuperShiny**:
   - Install the SuperShiny VSCode extension
   - Open the SuperShiny sidebar
   - Edit configuration files with live preview

4. **Deploy to Production**:
   ```bash
   npm run build
   # Follow Convex deployment guidelines
   ```

## ⚙️ Configuration System

ShinyStack uses the **SuperShiny TOML-based configuration system**:

### `.config` Files
- **`ai.config`**: AI/ML model settings, API keys, prompts
- **`architecture.config`**: System architecture, database schemas, API endpoints
- **`opencode.config`**: Open source settings, licensing, contribution guidelines
- **`styles.config`**: UI themes, colors, typography, component styling

### `.shiny` Files
- **`glossary.shiny`**: Custom type definitions, enums, constraints, and validation rules

### Benefits
- **Real-time Editing**: Edit config files in VSCode with instant preview
- **Type Safety**: Full TypeScript support for configuration schemas
- **Validation**: Built-in validation rules and constraints
- **Reusability**: Define reusable patterns in `.shiny` files

## 🎨 Customization

### Styling
Edit `src/config/styles.config` to customize:
- Color palette and themes
- Typography and spacing
- Component-specific styling
- Responsive breakpoints
- Accessibility settings

### AI Integration
Configure `src/config/ai.config` for:
- Model selection and parameters
- API keys and endpoints
- Prompt templates
- Rate limiting and security

### Architecture
Modify `src/config/architecture.config` for:
- Database configuration
- Authentication settings
- API endpoints
- Performance optimization

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run lint` - Run linting and type checking

### Adding New Configuration
1. Create a new `.config` or `.shiny` file in `src/config/`
2. Define your configuration structure in TOML format
3. Use the SuperShiny extension to edit and validate

## 📚 Documentation

- [Convex Documentation](https://docs.convex.dev/)
- [SuperShiny Extension Guide](https://github.com/shanemurphy/shinyobjectz)
- [React + Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.shinystack.com](https://docs.shinystack.com)
- **Community**: [Discord](https://discord.gg/shinystack)
- **Issues**: [GitHub Issues](https://github.com/shanemurphy/shinyobjectz/issues)
- **Email**: support@shinystack.com

---

Built with ❤️ by the ShinyStack team
