import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Replace 'your-repo-name' below with your actual GitHub repository name.
// e.g. if your repo is github.com/pritishmehta/shruti-planner, set it to '/shruti-planner'
// If deploying to a custom domain or <username>.github.io root repo, set base to '/'
const REPO_NAME = '/Planner';

export default defineConfig({
  base: REPO_NAME,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
