
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This is critical for Capacitor/Android apps. 
  // It ensures files are loaded from the relative path inside the APK
  // instead of looking for them at the root of the file system.
  base: './', 
});
