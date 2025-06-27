#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

try {
  // Ensure we have all dependencies including dev dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci --include=dev', { stdio: 'inherit' });

  // Create dist directory
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Build client (Vite)
  console.log('🏗️ Building client...');
  const clientDir = path.join(process.cwd(), 'client');
  
  // Check if client directory exists
  if (!fs.existsSync(clientDir)) {
    throw new Error('Client directory not found');
  }

  // Build with Vite using direct node_modules path
  const vitePath = path.join(process.cwd(), 'node_modules', '.bin', 'vite');
  process.chdir(clientDir);
  
  if (process.platform === 'win32') {
    execSync(`"${vitePath}.cmd" build`, { stdio: 'inherit' });
  } else {
    execSync(`"${vitePath}" build`, { stdio: 'inherit' });
  }
  
  // Go back to root
  process.chdir('..');

  // Build server (esbuild)
  console.log('⚙️ Building server...');
  const esbuildPath = path.join(process.cwd(), 'node_modules', '.bin', 'esbuild');
  
  if (process.platform === 'win32') {
    execSync(`"${esbuildPath}.cmd" server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18`, { stdio: 'inherit' });
  } else {
    execSync(`"${esbuildPath}" server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --target=node18`, { stdio: 'inherit' });
  }

  console.log('✅ Build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 