// Simple main.js to run Manifest backend
const { spawn } = require('child_process');

console.log('🚀 [MAIN] Starting Manifest backend...');

// Run the Manifest watch script (which is the main entry point)
const child = spawn('node', ['node_modules/manifest/scripts/watch/watch.js'], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (error) => {
  console.error('❌ [MAIN] Failed to start Manifest:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log('🚀 [MAIN] Manifest process exited with code:', code);
  process.exit(code);
});
