#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting dev update...\n');

// Step 1: Compile TypeScript
console.log('📦 Compiling TypeScript...');
exec('npm run compile', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Compilation failed:', error);
    return;
  }
  console.log('✅ TypeScript compiled successfully\n');

  // Step 2: Package extension (silent)
  console.log('📦 Packaging extension...');
  exec('npx @vscode/vsce package --allow-missing-repository --allow-star-activation --no-dependencies', 
    (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Packaging failed:', error);
        return;
      }
      console.log('✅ Extension packaged successfully\n');

      // Step 3: Install extension
      console.log('🔧 Installing extension...');
      
      // Try Cursor first, then VS Code
      const installCommands = [
        'cursor --install-extension toml-shadcn-forms-0.1.0.vsix --force',
        'code --install-extension toml-shadcn-forms-0.1.0.vsix --force'
      ];

      let commandIndex = 0;
      function tryInstall() {
        if (commandIndex >= installCommands.length) {
          console.log('⚠️  Could not install extension automatically');
          console.log('💡 Manual install: Extensions > Install from VSIX > toml-shadcn-forms-0.1.0.vsix');
          return;
        }

        const cmd = installCommands[commandIndex];
        const editorName = cmd.startsWith('cursor') ? 'Cursor' : 'VS Code';
        
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.log(`⚠️  ${editorName} not found, trying next...`);
            commandIndex++;
            tryInstall();
            return;
          }
          
          console.log(`✅ Extension installed in ${editorName}\n`);
          
          console.log('\n🎉 Dev update complete!');
          console.log('💡 Your extension is now updated and installed');
          console.log(`🔄 Please reload ${editorName} manually:`);
          console.log('   • Press Ctrl+R (or Cmd+R on Mac)');
          console.log('   • Or: Ctrl+Shift+P → "Developer: Reload Window"');
          
          // Try to focus the existing window (doesn't always work but worth trying)
          if (process.platform === 'win32') {
            console.log('\n⚡ Tip: Use Alt+Tab to switch back to your main Cursor window, then Ctrl+R');
          }
        });
      }

      tryInstall();
    }
  );
});