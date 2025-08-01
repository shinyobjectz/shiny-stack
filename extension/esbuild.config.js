const esbuild = require('esbuild');
const path = require('path');

// Build React app
async function buildReact() {
  try {
    await esbuild.build({
      entryPoints: ['./src/main.tsx'],
      bundle: true,
      outfile: 'out/main.js',
      external: ['vscode'],
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      define: {
        'process.env.NODE_ENV': '"production"',
        'process': 'undefined',
        'global': 'window',
        'Buffer': 'undefined',
        '__dirname': 'undefined',
        '__filename': 'undefined',
        'production': 'true'
      },
      loader: {
        '.css': 'css'
      },
      minify: true,
      sourcemap: false
    });

    // Build CSS
    await esbuild.build({
      entryPoints: ['./src/styles.css'],
      bundle: true,
      outfile: 'out/main.css',
      loader: {
        '.css': 'css'
      },
      minify: true
    });

    console.log('✅ React build completed successfully');
  } catch (error) {
    console.error('❌ React build failed:', error);
    process.exit(1);
  }
}

// Build TypeScript extension
async function buildExtension() {
  try {
    await esbuild.build({
      entryPoints: ['./src/extension.ts'],
      bundle: true,
      outfile: 'out/extension.js',
      external: ['vscode'],
      format: 'cjs',
      platform: 'node',
      target: 'node16',
      sourcemap: true
    });

    console.log('✅ Extension build completed successfully');
  } catch (error) {
    console.error('❌ Extension build failed:', error);
    process.exit(1);
  }
}

// Main build function
async function build() {
  console.log('🚀 Starting build...');
  
  // Clean output directory
  const fs = require('fs');
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }
  fs.mkdirSync('out', { recursive: true });

  // Build both React app and extension
  await Promise.all([
    buildReact(),
    buildExtension()
  ]);

  console.log('🎉 All builds completed successfully!');
}

// Run build if this file is executed directly
if (require.main === module) {
  build();
}

module.exports = { build, buildReact, buildExtension }; 